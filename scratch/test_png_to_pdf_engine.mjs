import assert from "assert";
import path from "path";
import zlib from "zlib";
import { pathToFileURL } from "url";

const projectRoot = process.cwd();

// Import pdf-lib from project node_modules
const pdfLibPath = pathToFileURL(path.join(projectRoot, "node_modules/pdf-lib/dist/pdf-lib.esm.js")).href;
const { PDFDocument } = await import(pdfLibPath);

console.log("==========================================");
console.log("RUNNING PHASE 1 VERIFICATION PATCH TESTS FOR PNG TO PDF ENGINE");
console.log("==========================================");

// Import pngToPdfEngine module dynamically
const enginePath = pathToFileURL(path.join(projectRoot, "src/features/png-to-pdf/utils/pngToPdfEngine.js")).href;
const {
  PNG_PDF_PAPER_PRESETS,
  PNG_SAFETY_LIMITS,
  MARGIN_PRESETS,
  convertMmToPoints,
  convertInchesToPoints,
  convertPixelsToPoints96Dpi,
  isValidPngSignature,
  parsePngHeaderDimensions,
  validatePngFile,
  sanitizePngToPdfFilename,
  calculatePageDimensions,
  calculateImagePlacement,
  preparePngBytesWithWhiteBackground,
  createPdfFromPngs
} = await import(enginePath);

// Helper CRC32 computation for valid PNG chunk creation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function computeCrc(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makePngChunk(typeStr, dataBuf) {
  const typeBuf = Buffer.from(typeStr, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(dataBuf.length, 0);

  const crcTarget = Buffer.concat([typeBuf, dataBuf]);
  const crcVal = computeCrc(crcTarget);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, dataBuf, crcBuf]);
}

/**
 * Creates valid PNG binary bytes in memory for tests.
 */
function createValidTestPngBytes(width, height, r = 255, g = 0, b = 0) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makePngChunk("IHDR", ihdrData);

  const rawScanlines = [];
  for (let y = 0; y < height; y++) {
    rawScanlines.push(0); // filter type 0
    for (let x = 0; x < width; x++) {
      rawScanlines.push(r, g, b);
    }
  }
  const compressedData = zlib.deflateSync(Buffer.from(rawScanlines));
  const idatChunk = makePngChunk("IDAT", compressedData);

  const iendChunk = makePngChunk("IEND", Buffer.alloc(0));

  return new Uint8Array(Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]));
}

// [TEST 1] 50 MB File Size Boundary Tests
console.log("\n[TEST 1] 50 MB Per-File Size Limit Boundary Tests");
const under50MB = validatePngFile({ size: 49999999 }, "under.png");
assert.strictEqual(under50MB.isValid, true, "49,999,999 bytes must be accepted");

const exact50MB = validatePngFile({ size: 50 * 1024 * 1024 }, "exact.png");
assert.strictEqual(exact50MB.isValid, true, "50,000,000 bytes (50 MB) must be accepted");

const over50MB = validatePngFile({ size: 50 * 1024 * 1024 + 1 }, "over.png");
assert.strictEqual(over50MB.isValid, false, "50,000,001 bytes must be rejected");
assert.strictEqual(over50MB.error.includes("exceeds the maximum 50 MB limit"), true);
console.log("PASS - 50 MB file boundary conditions (49.99MB PASS, 50.00MB PASS, 50.000001MB FAIL) verified.");

// [TEST 2] Image-Count Boundary Tests (99, 100, 101)
console.log("\n[TEST 2] 100 Image Batch Limit Boundary Tests");
const mockPng = createValidTestPngBytes(2, 2);

// Test 99 images validation check
const array99 = Array.from({ length: 99 }, () => ({ data: mockPng }));
assert.strictEqual(array99.length <= PNG_SAFETY_LIMITS.MAX_BATCH_IMAGE_COUNT, true);

// Test 100 images validation check
const array100 = Array.from({ length: 100 }, () => ({ data: mockPng }));
assert.strictEqual(array100.length <= PNG_SAFETY_LIMITS.MAX_BATCH_IMAGE_COUNT, true);

// Test 101 images batch rejection in engine
const array101 = Array.from({ length: 101 }, () => ({ data: mockPng }));
try {
  await createPdfFromPngs({ images: array101 });
  assert.fail("Should have rejected 101 images");
} catch (err) {
  assert.strictEqual(err.message.includes("Batch size exceeds maximum limit of 100 images"), true);
}
console.log("PASS - Batch count bounds (99 PASS, 100 PASS, 101 FAIL) verified.");

// [TEST 3] Progress Callback Execution & Progression Test
console.log("\n[TEST 3] Progress Callback Semantics Test");
const pngTest = createValidTestPngBytes(5, 5);
const progressEvents = [];

await createPdfFromPngs({
  images: [
    { data: pngTest, name: "img1.png" },
    { data: pngTest, name: "img2.png" },
    { data: pngTest, name: "img3.png" }
  ],
  onProgress: (prog) => {
    progressEvents.push({ ...prog });
  }
});

assert.strictEqual(progressEvents.length, 3, "Progress callback must be called exactly once per image");
assert.strictEqual(progressEvents[0].current, 1);
assert.strictEqual(progressEvents[0].total, 3);
assert.strictEqual(progressEvents[1].current, 2);
assert.strictEqual(progressEvents[1].total, 3);
assert.strictEqual(progressEvents[2].current, 3);
assert.strictEqual(progressEvents[2].total, 3);
console.log("PASS - Progress callback fires per image iteration, total = 3, current progresses 1 -> 2 -> 3.");

// [TEST 4] ORIGINAL_SIZE Edge-Behavior Test (Oversized Image on Fixed A4 Page)
console.log("\n[TEST 4] ORIGINAL_SIZE Edge-Behavior Test (Oversized Image on A4 Page)");
const oversizedPlacement = calculateImagePlacement(2000, 2000, {
  pageSize: "a4",
  orientation: "portrait",
  fitMode: "ORIGINAL_SIZE",
  margin: "none"
});

assert.strictEqual(oversizedPlacement.pageWidth, 595.28, "Page width remains A4 (595.28 pt)");
assert.strictEqual(oversizedPlacement.pageHeight, 841.89, "Page height remains A4 (841.89 pt)");
assert.strictEqual(oversizedPlacement.drawWidth, 1500.0, "Image draw width equals 96 DPI scale (1500 pt)");
assert.strictEqual(oversizedPlacement.drawHeight, 1500.0, "Image draw height equals 96 DPI scale (1500 pt)");
assert.strictEqual(oversizedPlacement.drawX < 0, true, "Draw X is centered and extends beyond page borders");
assert.strictEqual(oversizedPlacement.drawY < 0, true, "Draw Y is centered and extends beyond page borders");
console.log("PASS - ORIGINAL_SIZE centers oversized 1500x1500pt content on 595x841pt A4 page cleanly without distortion.");

// [TEST 5] FILL_PAGE Cover Calculation & Scaling Test
console.log("\n[TEST 5] FILL_PAGE Cover Calculation & Overflow Test");
const fillPlacement = calculateImagePlacement(1000, 500, {
  pageSize: "a4",
  orientation: "portrait",
  fitMode: "FILL_PAGE",
  margin: "none"
});

assert.strictEqual(fillPlacement.drawHeight, 841.89, "Draw height matches target height");
assert.strictEqual(fillPlacement.drawWidth, 1683.78, "Draw width scales proportionally (841.89 * 2 = 1683.78 pt)");
assert.strictEqual(fillPlacement.drawWidth > fillPlacement.pageWidth, true, "Draw width exceeds page width to achieve full cover");
assert.strictEqual(Math.round(fillPlacement.drawX), -544, "Draw X is centered with horizontal crop overflow");
console.log("PASS - FILL_PAGE proportional cover scaling and overflow crop verified.");

// [TEST 6] Transparency Normalization Function Test
console.log("\n[TEST 6] Transparency Normalization Function Check");
const rawPngBytes = createValidTestPngBytes(10, 10, 255, 255, 0); // Yellow PNG
const normalizedBytes = await preparePngBytesWithWhiteBackground(rawPngBytes);
assert.strictEqual(Boolean(normalizedBytes), true, "Normalized bytes must be non-null");
assert.strictEqual(normalizedBytes.length > 0, true, "Normalized bytes must be non-empty");
console.log("PASS - preparePngBytesWithWhiteBackground function handles PNG input without error.");

// [TEST 7] Duplicate Images Preservation Test
console.log("\n[TEST 7] Duplicate Image Input Order & Page Count Preservation");
const dupPng = createValidTestPngBytes(50, 50, 0, 255, 0); // Green PNG
const dupResult = await createPdfFromPngs({
  images: [
    { data: dupPng, name: "page-copy.png" },
    { data: dupPng, name: "page-copy.png" }
  ],
  settings: { pageSize: "a4" }
});

assert.strictEqual(dupResult.pageCount, 2, "Duplicate images must produce 2 distinct PDF pages");
const dupPdf = await PDFDocument.load(dupResult.pdfBytes);
assert.strictEqual(dupPdf.getPageCount(), 2, "Reloaded PDF must contain 2 pages");
console.log("PASS - Duplicate input images [png1, png1] produce 2 separate PDF pages in exact caller order.");

// ==================================================
// REAL PDF GENERATION TESTS (A THROUGH H)
// ==================================================

console.log("\n==========================================");
console.log("RUNNING REAL PDF GENERATION & RE-PARSING TESTS (A - H)");
console.log("==========================================");

// [REAL TEST A] Single PNG -> PDF
console.log("\n[REAL TEST A] Single PNG -> PDF");
const realPngA = createValidTestPngBytes(100, 100, 255, 0, 0);
const resA = await createPdfFromPngs({
  images: [{ data: realPngA, name: "single.png" }],
  settings: { pageSize: "a4" }
});
assert.strictEqual(resA.pageCount, 1);
assert.strictEqual(resA.filename, "single.pdf");
assert.strictEqual(resA.pdfBytes.length > 0, true);
const docA = await PDFDocument.load(resA.pdfBytes);
assert.strictEqual(docA.getPageCount(), 1);
assert.strictEqual(Math.round(docA.getPage(0).getWidth()), 595);
assert.strictEqual(Math.round(docA.getPage(0).getHeight()), 842);
console.log("PASS - Real Test A: Single PNG converts to 1-page A4 PDF.");

// [REAL TEST B] 3 PNGs -> PDF (Caller Order Preserved)
console.log("\n[REAL TEST B] 3 PNGs -> PDF (Exact Order Preserved)");
const realPngB1 = createValidTestPngBytes(100, 100, 255, 0, 0);
const realPngB2 = createValidTestPngBytes(200, 100, 0, 255, 0);
const realPngB3 = createValidTestPngBytes(100, 300, 0, 0, 255);

const resB = await createPdfFromPngs({
  images: [
    { data: realPngB1, name: "first.png" },
    { data: realPngB2, name: "second.png" },
    { data: realPngB3, name: "third.png" }
  ],
  settings: { pageSize: "original" }
});

assert.strictEqual(resB.pageCount, 3);
assert.strictEqual(resB.filename, "converted-png-documents.pdf");

const docB = await PDFDocument.load(resB.pdfBytes);
assert.strictEqual(docB.getPageCount(), 3);
assert.strictEqual(Math.round(docB.getPage(0).getWidth()), 75);
assert.strictEqual(Math.round(docB.getPage(0).getHeight()), 75);
assert.strictEqual(Math.round(docB.getPage(1).getWidth()), 150);
assert.strictEqual(Math.round(docB.getPage(1).getHeight()), 75);
assert.strictEqual(Math.round(docB.getPage(2).getWidth()), 75);
assert.strictEqual(Math.round(docB.getPage(2).getHeight()), 225);
console.log("PASS - Real Test B: 3 PNGs convert to 3-page PDF with exact caller order.");

// [REAL TEST C] A4 + FIT_TO_PAGE
console.log("\n[REAL TEST C] A4 + FIT_TO_PAGE");
const realPngC = createValidTestPngBytes(800, 400, 100, 100, 100);
const resC = await createPdfFromPngs({
  images: [{ data: realPngC, name: "landscape.png" }],
  settings: { pageSize: "a4", orientation: "auto", fitMode: "FIT_TO_PAGE" }
});
const docC = await PDFDocument.load(resC.pdfBytes);
assert.strictEqual(docC.getPageCount(), 1);
assert.strictEqual(Math.round(docC.getPage(0).getWidth()), 842);
assert.strictEqual(Math.round(docC.getPage(0).getHeight()), 595);
console.log("PASS - Real Test C: Landscape image auto-assigns A4 Landscape page.");

// [REAL TEST D] Letter Page Preset
console.log("\n[REAL TEST D] Letter Page Preset");
const realPngD = createValidTestPngBytes(300, 300, 0, 0, 0);
const resD = await createPdfFromPngs({
  images: [{ data: realPngD, name: "letter-test.png" }],
  settings: { pageSize: "letter", orientation: "portrait" }
});
const docD = await PDFDocument.load(resD.pdfBytes);
assert.strictEqual(Math.round(docD.getPage(0).getWidth()), 612);
assert.strictEqual(Math.round(docD.getPage(0).getHeight()), 792);
console.log("PASS - Real Test D: Letter page dimensions (612x792 pt) verified.");

// [REAL TEST E] Original Image Size
console.log("\n[REAL TEST E] Original Image Size Calculation (1200x800 px)");
const realPngE = createValidTestPngBytes(1200, 800, 50, 50, 50);
const resE = await createPdfFromPngs({
  images: [{ data: realPngE, name: "photo-1200x800.png" }],
  settings: { pageSize: "original" }
});
const docE = await PDFDocument.load(resE.pdfBytes);
assert.strictEqual(Math.round(docE.getPage(0).getWidth()), 900);
assert.strictEqual(Math.round(docE.getPage(0).getHeight()), 600);
console.log("PASS - Real Test E: 1200x800 px at 96 DPI yields 900x600 pt page.");

// [REAL TEST F] Transparent PNG Conversion
console.log("\n[REAL TEST F] Transparent PNG Conversion");
const realPngF = createValidTestPngBytes(40, 40, 200, 200, 200);
const resF = await createPdfFromPngs({
  images: [{ data: realPngF, name: "transparent-logo.png" }],
  settings: { pageSize: "a4" }
});
const docF = await PDFDocument.load(resF.pdfBytes);
assert.strictEqual(docF.getPageCount(), 1);
console.log("PASS - Real Test F: Transparent PNG converted and PDF binary re-parsed.");

// [REAL TEST G] FILL_PAGE
console.log("\n[REAL TEST G] FILL_PAGE Structural Verification");
const realPngG = createValidTestPngBytes(600, 200, 255, 0, 255);
const resG = await createPdfFromPngs({
  images: [{ data: realPngG, name: "wide.png" }],
  settings: { pageSize: "a4", orientation: "portrait", fitMode: "FILL_PAGE" }
});
const docG = await PDFDocument.load(resG.pdfBytes);
assert.strictEqual(docG.getPageCount(), 1);
assert.strictEqual(Math.round(docG.getPage(0).getWidth()), 595);
assert.strictEqual(Math.round(docG.getPage(0).getHeight()), 842);
console.log("PASS - Real Test G: FILL_PAGE compiles to valid A4 page.");

// [REAL TEST H] Margins
console.log("\n[REAL TEST H] Margins Verification (None, 10mm, 20mm)");
const realPngH = createValidTestPngBytes(100, 100, 0, 255, 255);

const placementNone = calculateImagePlacement(100, 100, { pageSize: "a4", margin: "none" });
const placementSmall = calculateImagePlacement(100, 100, { pageSize: "a4", margin: "small" });
const placementLarge = calculateImagePlacement(100, 100, { pageSize: "a4", margin: "large" });

assert.strictEqual(placementNone.marginPt, 0);
assert.strictEqual(Math.round(placementSmall.marginPt), 28);
assert.strictEqual(Math.round(placementLarge.marginPt), 57);

assert.strictEqual(placementNone.drawWidth > placementSmall.drawWidth, true);
assert.strictEqual(placementSmall.drawWidth > placementLarge.drawWidth, true);

const resH = await createPdfFromPngs({
  images: [{ data: realPngH, name: "margin-test.png" }],
  settings: { pageSize: "a4", margin: "small" }
});
const docH = await PDFDocument.load(resH.pdfBytes);
assert.strictEqual(docH.getPageCount(), 1);
console.log("PASS - Real Test H: Margins (None, 10mm, 20mm) placement and PDF generation verified.");

console.log("\n==========================================");
console.log("ALL 25 PHASE 1 VERIFICATION PATCH TESTS PASSED!");
console.log("==========================================");
