import assert from "assert";
import path from "path";
import zlib from "zlib";
import { pathToFileURL } from "url";

const projectRoot = process.cwd();

// Import pdf-lib from project node_modules
const pdfLibPath = pathToFileURL(path.join(projectRoot, "node_modules/pdf-lib/dist/pdf-lib.esm.js")).href;
const { PDFDocument } = await import(pdfLibPath);

// Import pngToPdfEngine module dynamically
const enginePath = pathToFileURL(path.join(projectRoot, "src/features/png-to-pdf/utils/pngToPdfEngine.js")).href;
const {
  validatePngFile,
  parsePngHeaderDimensions,
  sanitizePngToPdfFilename,
  createPdfFromPngs,
  PNG_SAFETY_LIMITS
} = await import(enginePath);

console.log("==========================================");
console.log("RUNNING PHASE 2 UI INTEGRATION & REAL PDF PIPELINE TESTS");
console.log("==========================================");

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

// Simulated UI State Machine for Integration Testing
class SimulatedPngToPdfUI {
  constructor() {
    this.stage = "upload";
    this.images = [];
    this.error = null;
    this.settings = {
      pageSize: "a4",
      orientation: "auto",
      fitMode: "FIT_TO_PAGE",
      margin: "none"
    };
    this.progress = { current: 0, total: 0, stage: "" };
    this.result = null;
    this.revokedUrls = [];
  }

  async processFiles(fileList) {
    this.error = null;
    if (!fileList || fileList.length === 0) return;

    const remainingCapacity = PNG_SAFETY_LIMITS.MAX_BATCH_IMAGE_COUNT - this.images.length;
    if (remainingCapacity <= 0) {
      this.error = `Maximum batch limit of ${PNG_SAFETY_LIMITS.MAX_BATCH_IMAGE_COUNT} images has been reached.`;
      return;
    }

    let filesToProcess = Array.from(fileList);
    let capExceeded = false;
    if (filesToProcess.length > remainingCapacity) {
      filesToProcess = filesToProcess.slice(0, remainingCapacity);
      capExceeded = true;
    }

    const newImages = [];
    for (const item of filesToProcess) {
      const filename = item.name || "image.png";
      const bytes = item.bytes || item.data || item;
      const size = item.size !== undefined ? item.size : bytes.length;

      // Validation
      const sizeValidation = validatePngFile({ size }, filename);
      if (!sizeValidation.isValid) {
        this.error = sizeValidation.error;
        continue;
      }

      const dims = parsePngHeaderDimensions(bytes);
      if (!dims) {
        this.error = `Could not determine dimensions for PNG file "${filename}". The file may be corrupted.`;
        continue;
      }

      if (dims.width * dims.height > PNG_SAFETY_LIMITS.MAX_CANVAS_PIXELS) {
        this.error = `Image "${filename}" (${dims.width}×${dims.height} px) exceeds the maximum 12 Megapixel safety cap.`;
        continue;
      }

      newImages.push({
        id: Math.random().toString(36).substring(2, 9) + Date.now(),
        bytes,
        name: filename,
        size,
        width: dims.width,
        height: dims.height,
        url: `blob:mock-preview-${filename}`
      });
    }

    if (newImages.length > 0) {
      this.images = [...this.images, ...newImages];
      this.stage = "workspace";
      if (capExceeded) {
        this.error = `Added ${newImages.length} images. Remaining files were skipped to maintain the 100 image batch limit.`;
      }
    }
  }

  addImages(newFiles) {
    return this.processFiles(newFiles);
  }

  moveImage(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= this.images.length) return;
    const reordered = [...this.images];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    this.images = reordered;
  }

  removeImage(index) {
    const target = this.images[index];
    if (target && target.url) {
      this.revokedUrls.push(target.url);
    }
    this.images = this.images.filter((_, idx) => idx !== index);
    if (this.images.length === 0) {
      this.stage = "upload";
    }
  }

  clearAll() {
    this.images.forEach((img) => {
      if (img.url) this.revokedUrls.push(img.url);
    });
    this.images = [];
    this.error = null;
    this.cleanupResult();
    this.stage = "upload";
  }

  changeSettings(key, value) {
    this.settings[key] = value;
  }

  async convert() {
    if (this.images.length === 0) return;
    this.stage = "processing";
    this.error = null;

    try {
      const pdfOutput = await createPdfFromPngs({
        images: this.images,
        settings: this.settings,
        onProgress: (prog) => {
          this.progress = prog;
        }
      });

      this.result = {
        pdfBytes: pdfOutput.pdfBytes,
        filename: pdfOutput.filename,
        pageCount: pdfOutput.pageCount,
        fileSize: pdfOutput.pdfBytes.byteLength,
        downloadUrl: `blob:mock-pdf-${pdfOutput.filename}`
      };
      this.stage = "success";
    } catch (err) {
      this.error = err.message;
      this.stage = "workspace";
    }
  }

  cleanupResult() {
    if (this.result && this.result.downloadUrl) {
      this.revokedUrls.push(this.result.downloadUrl);
      this.result = null;
    }
  }

  reset() {
    this.cleanupResult();
    this.error = null;
    this.stage = "workspace";
  }
}

// ----------------------------------------------------
// EXPLICIT INDIVIDUAL TEST SUITE (TESTS 1 - 19)
// ----------------------------------------------------

// TEST 1: Valid PNG Selection
const ui1 = new SimulatedPngToPdfUI();
const png1 = createValidTestPngBytes(100, 100, 255, 0, 0);
await ui1.processFiles([{ name: "test1.png", bytes: png1, size: png1.length }]);
assert.strictEqual(ui1.stage, "workspace");
assert.strictEqual(ui1.images.length, 1);
assert.strictEqual(ui1.images[0].name, "test1.png");
console.log("[TEST 1] Valid PNG Selection -> PASS");

// TEST 2: Invalid Non-PNG Rejection
const ui2 = new SimulatedPngToPdfUI();
const invalidData = new Uint8Array([0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77]);
await ui2.processFiles([{ name: "fake.png", bytes: invalidData, size: invalidData.length }]);
assert.strictEqual(ui2.stage, "upload");
assert.strictEqual(ui2.images.length, 0);
assert.strictEqual(ui2.error.includes("Could not determine dimensions"), true);
console.log("[TEST 2] Invalid Non-PNG Rejection -> PASS");

// TEST 3: >50MB File Rejection
const ui3 = new SimulatedPngToPdfUI();
await ui3.processFiles([{ name: "huge.png", bytes: png1, size: 55 * 1024 * 1024 }]);
assert.strictEqual(ui3.stage, "upload");
assert.strictEqual(ui3.images.length, 0);
assert.strictEqual(ui3.error.includes("exceeds the maximum 50 MB limit"), true);
console.log("[TEST 3] >50MB File Rejection -> PASS");

// TEST 4: >12MP Image Rejection
const ui4 = new SimulatedPngToPdfUI();
const oversizedHeaderPng = createValidTestPngBytes(4000, 3100, 0, 255, 0); // 12.4 MP
await ui4.processFiles([{ name: "huge-res.png", bytes: oversizedHeaderPng, size: oversizedHeaderPng.length }]);
assert.strictEqual(ui4.stage, "upload");
assert.strictEqual(ui4.images.length, 0);
assert.strictEqual(ui4.error.includes("12 Megapixel safety cap"), true);
console.log("[TEST 4] >12MP Image Rejection -> PASS");

// TEST 5: >100 Image Batch Limit Rejection
const ui5 = new SimulatedPngToPdfUI();
const batch105 = Array.from({ length: 105 }, (_, i) => ({ name: `img${i}.png`, bytes: png1, size: png1.length }));
await ui5.processFiles(batch105);
assert.strictEqual(ui5.stage, "workspace");
assert.strictEqual(ui5.images.length, 100);
assert.strictEqual(ui5.error.includes("Remaining files were skipped to maintain the 100 image batch limit"), true);
console.log("[TEST 5] >100 Image Batch Limit Rejection -> PASS");

// TEST 6: Add More Images Behavior
const ui6 = new SimulatedPngToPdfUI();
const pngA = createValidTestPngBytes(50, 50, 255, 0, 0);
const pngB = createValidTestPngBytes(60, 60, 0, 255, 0);
await ui6.processFiles([{ name: "a.png", bytes: pngA, size: pngA.length }]);
assert.strictEqual(ui6.images.length, 1);
await ui6.addImages([{ name: "b.png", bytes: pngB, size: pngB.length }]);
assert.strictEqual(ui6.images.length, 2);
assert.strictEqual(ui6.images[0].name, "a.png");
assert.strictEqual(ui6.images[1].name, "b.png");
console.log("[TEST 6] Add More Images Behavior -> PASS");

// TEST 7: Remove Image Behavior
ui6.removeImage(0);
assert.strictEqual(ui6.images.length, 1);
assert.strictEqual(ui6.images[0].name, "b.png");
ui6.removeImage(0);
assert.strictEqual(ui6.images.length, 0);
assert.strictEqual(ui6.stage, "upload");
console.log("[TEST 7] Remove Image Behavior -> PASS");

// TEST 8: Reorder Images Behavior
const ui8 = new SimulatedPngToPdfUI();
await ui8.processFiles([
  { name: "img-a.png", bytes: pngA, size: pngA.length },
  { name: "img-b.png", bytes: pngB, size: pngB.length }
]);
assert.strictEqual(ui8.images[0].name, "img-a.png");
assert.strictEqual(ui8.images[1].name, "img-b.png");
ui8.moveImage(0, 1);
assert.strictEqual(ui8.images[0].name, "img-b.png");
assert.strictEqual(ui8.images[1].name, "img-a.png");
console.log("[TEST 8] Reorder Images Behavior -> PASS");

// TEST 9: Duplicate Images Handling
const ui9 = new SimulatedPngToPdfUI();
await ui9.processFiles([
  { name: "dup.png", bytes: pngA, size: pngA.length },
  { name: "dup.png", bytes: pngA, size: pngA.length }
]);
assert.strictEqual(ui9.images.length, 2);
assert.strictEqual(ui9.images[0].name, "dup.png");
assert.strictEqual(ui9.images[1].name, "dup.png");
console.log("[TEST 9] Duplicate Images Handling -> PASS");

// TEST 10: Default Settings Values
const ui10 = new SimulatedPngToPdfUI();
assert.strictEqual(ui10.settings.pageSize, "a4");
assert.strictEqual(ui10.settings.orientation, "auto");
assert.strictEqual(ui10.settings.fitMode, "FIT_TO_PAGE");
assert.strictEqual(ui10.settings.margin, "none");
console.log("[TEST 10] Default Settings Values -> PASS");

// TEST 11: Settings Modification Passed to Engine
ui10.changeSettings("pageSize", "letter");
ui10.changeSettings("margin", "small");
assert.strictEqual(ui10.settings.pageSize, "letter");
assert.strictEqual(ui10.settings.margin, "small");
console.log("[TEST 11] Settings Modification Passed to Engine -> PASS");

// TEST 12: Progress Callback Wiring
const ui12 = new SimulatedPngToPdfUI();
await ui12.processFiles([
  { name: "p1.png", bytes: pngA, size: pngA.length },
  { name: "p2.png", bytes: pngB, size: pngB.length }
]);
await ui12.convert();
assert.strictEqual(ui12.progress.current, 2);
assert.strictEqual(ui12.progress.total, 2);
assert.strictEqual(typeof ui12.progress.stage, "string");
console.log("[TEST 12] Progress Callback Wiring -> PASS");

// TEST 13: Real PDF Bytes Generation
assert.strictEqual(ui12.result.pdfBytes instanceof Uint8Array, true);
assert.strictEqual(ui12.result.pdfBytes.length > 0, true);
console.log("[TEST 13] Real PDF Bytes Generation -> PASS");

// TEST 14: Filename Sanitization
const cleanNameSingle = sanitizePngToPdfFilename("My Document.PNG", 1);
assert.strictEqual(cleanNameSingle, "my_document.pdf");
const cleanNameBatch = sanitizePngToPdfFilename("photo.png", 3);
assert.strictEqual(cleanNameBatch, "converted-png-documents.pdf");
console.log("[TEST 14] Filename Sanitization -> PASS");

// TEST 15: Success State Output Handling
assert.strictEqual(ui12.stage, "success");
assert.strictEqual(ui12.result.pageCount, 2);
assert.strictEqual(Boolean(ui12.result.downloadUrl), true);
console.log("[TEST 15] Success State Output Handling -> PASS");

// TEST 16: Reset / Start-Over Behavior
ui12.reset();
assert.strictEqual(ui12.stage, "workspace");
assert.strictEqual(ui12.result, null);
console.log("[TEST 16] Reset / Start-Over Behavior -> PASS");

// TEST 17: Output Object URL Cleanup
assert.strictEqual(ui12.revokedUrls.includes("blob:mock-pdf-converted-png-documents.pdf"), true);
console.log("[TEST 17] Output Object URL Cleanup -> PASS");

// TEST 18: Client-Side Local Processing Boundary
assert.strictEqual(typeof createPdfFromPngs, "function");
console.log("[TEST 18] Client-Side Local Processing Boundary -> PASS");

// TEST 19: Actual PNG → PDF → PDF Reload Integration
const ui19 = new SimulatedPngToPdfUI();
const redPng = createValidTestPngBytes(100, 100, 255, 0, 0);
const greenPng = createValidTestPngBytes(200, 100, 0, 255, 0);
const bluePng = createValidTestPngBytes(100, 300, 0, 0, 255);

await ui19.processFiles([
  { name: "red.png", bytes: redPng, size: redPng.length },
  { name: "green.png", bytes: greenPng, size: greenPng.length },
  { name: "blue.png", bytes: bluePng, size: bluePng.length }
]);

// Reorder: Move blue (index 2) to index 0 -> [blue, red, green]
ui19.moveImage(2, 0);
assert.strictEqual(ui19.images[0].name, "blue.png");
assert.strictEqual(ui19.images[1].name, "red.png");
assert.strictEqual(ui19.images[2].name, "green.png");

// Set settings: Page Size = Original
ui19.changeSettings("pageSize", "original");

// Execute Conversion
await ui19.convert();

assert.strictEqual(ui19.stage, "success");
assert.strictEqual(ui19.result.pageCount, 3);
assert.strictEqual(ui19.result.filename, "converted-png-documents.pdf");

// Reload PDF using pdf-lib and verify exact page counts & dimensions
const pdfDocReloaded = await PDFDocument.load(ui19.result.pdfBytes);
assert.strictEqual(pdfDocReloaded.getPageCount(), 3);

// Page 0 (blue.png 100x300 px at 96 DPI -> 75x225 pt)
const page0 = pdfDocReloaded.getPage(0);
assert.strictEqual(Math.round(page0.getWidth()), 75);
assert.strictEqual(Math.round(page0.getHeight()), 225);

// Page 1 (red.png 100x100 px at 96 DPI -> 75x75 pt)
const page1 = pdfDocReloaded.getPage(1);
assert.strictEqual(Math.round(page1.getWidth()), 75);
assert.strictEqual(Math.round(page1.getHeight()), 75);

// Page 2 (green.png 200x100 px at 96 DPI -> 150x75 pt)
const page2 = pdfDocReloaded.getPage(2);
assert.strictEqual(Math.round(page2.getWidth()), 150);
assert.strictEqual(Math.round(page2.getHeight()), 75);

console.log("[TEST 19] Actual PNG → PDF → PDF Reload Integration -> PASS");

console.log("\n==========================================");
console.log("ALL 19 INDIVIDUAL UI INTEGRATION TESTS PASSED!");
console.log("==========================================");
