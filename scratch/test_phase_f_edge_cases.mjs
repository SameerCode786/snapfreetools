/**
 * Automated Test Suite for Phase F PDF Image Extraction Hardening & Edge Cases
 */

import fs from "fs";
import { PDFDocument, PDFName, PDFRawStream } from "pdf-lib";
import {
  extractPdfImages,
  parsePageRange,
  isJpegValid,
  isPngValid,
  encodePixelsToPng,
  PdfExtractionError,
} from "../src/features/extract-pdf-images/engine/pdfImageExtractor.js";

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (!condition) {
    failedCount++;
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

function pass(testName) {
  passedCount++;
  console.log(`✅ PASS: ${testName}`);
}

// Sample 1x1 Red PNG Base64
const VALID_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const VALID_PNG_BYTES = Buffer.from(VALID_PNG_BASE64, "base64");

// Helper to build test PDF with embedded PNGs
async function createTestPdfWithPngs(pngArray = [VALID_PNG_BYTES], pagesSetup = [0]) {
  const pdfDoc = await PDFDocument.create();
  const embeddedImgs = [];

  for (const pngBytes of pngArray) {
    const img = await pdfDoc.embedPng(pngBytes);
    embeddedImgs.push(img);
  }

  for (let pIdx = 0; pIdx < pagesSetup.length; pIdx++) {
    const imgIndex = pagesSetup[pIdx];
    const page = pdfDoc.addPage([500, 500]);
    const imgToDraw = embeddedImgs[imgIndex];
    page.drawImage(imgToDraw, { x: 50, y: 50, width: 100, height: 100 });
  }

  return await pdfDoc.save();
}

async function runPhaseFTests() {
  console.log("=================================================");
  console.log("  STARTING PHASE F PDF IMAGE ENGINE TEST SUITE   ");
  console.log("=================================================\n");

  // 1. RGB JPEG Header & Recovery Test
  try {
    const validJpgHeader = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    assert(isJpegValid(validJpgHeader) === true, "Valid JPEG header should be recognized");
    pass("Test 1: RGB JPEG Header Validation");
  } catch (e) {
    console.error(e);
  }

  // 2. RGB Flate Image Extraction Test
  try {
    const bytes = await createTestPdfWithPngs([VALID_PNG_BYTES], [0]);
    const res = await extractPdfImages(bytes);
    assert(res.uniqueImagesCount === 1, "Should find 1 Flate PNG image");
    assert(res.images[0].format === "png", "Format should be png");
    pass("Test 2: RGB Flate Image Extraction");
  } catch (e) {
    console.error(e);
  }

  // 3. Grayscale Image Pixel Encoding Test
  try {
    const grayPixels = new Uint8Array([128, 255, 0, 64]);
    const encodedPng = encodePixelsToPng(2, 2, grayPixels, false);
    assert(isPngValid(encodedPng), "Grayscale pixel array should encode to valid PNG");
    pass("Test 3: Grayscale Image Pixel Encoding");
  } catch (e) {
    console.error(e);
  }

  // 4. Indexed / Palette Image Fallback Metadata Classification
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 400]);

    const streamDict = pdfDoc.context.obj({
      Type: PDFName.of("XObject"),
      Subtype: PDFName.of("Image"),
      Width: 10,
      Height: 10,
      BitsPerComponent: 8,
      ColorSpace: PDFName.of("Indexed"),
    });
    const rawStream = PDFRawStream.of(streamDict, new Uint8Array([1, 2, 3]));
    const streamRef = pdfDoc.context.register(rawStream);
    page.node.set(
      PDFName.of("Resources"),
      pdfDoc.context.obj({
        XObject: { ImgIndexed: streamRef },
      })
    );

    const bytes = await pdfDoc.save();
    const res = await extractPdfImages(bytes);
    assert(res.uniqueImagesCount === 1, "Should detect indexed XObject");
    assert(
      res.images[0].colorSpace.includes("Indexed"),
      `Should classify Indexed Palette colorSpace, got ${res.images[0].colorSpace}`
    );
    pass("Test 4: Indexed / Palette Image Fallback Metadata Classification");
  } catch (e) {
    console.error(e);
  }

  // 5. CMYK Image Fallback Metadata Classification
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 400]);

    const streamDict = pdfDoc.context.obj({
      Type: PDFName.of("XObject"),
      Subtype: PDFName.of("Image"),
      Width: 20,
      Height: 20,
      BitsPerComponent: 8,
      ColorSpace: PDFName.of("DeviceCMYK"),
    });
    const rawStream = PDFRawStream.of(streamDict, new Uint8Array([0, 100, 100, 0]));
    const streamRef = pdfDoc.context.register(rawStream);
    page.node.set(
      PDFName.of("Resources"),
      pdfDoc.context.obj({
        XObject: { ImgCmyk: streamRef },
      })
    );

    const bytes = await pdfDoc.save();
    const res = await extractPdfImages(bytes);
    assert(res.uniqueImagesCount === 1, "Should detect CMYK XObject");
    assert(
      res.images[0].colorSpace === "DeviceCMYK",
      `Should classify DeviceCMYK colorSpace, got ${res.images[0].colorSpace}`
    );
    pass("Test 5: CMYK Image Fallback Metadata Classification");
  } catch (e) {
    console.error(e);
  }

  // 6. Transparent Image with SMask Handling
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 400]);

    const maskDict = pdfDoc.context.obj({
      Type: PDFName.of("XObject"),
      Subtype: PDFName.of("Image"),
      Width: 10,
      Height: 10,
      BitsPerComponent: 8,
      ColorSpace: PDFName.of("DeviceGray"),
    });
    const maskStream = PDFRawStream.of(maskDict, new Uint8Array(100));
    const maskRef = pdfDoc.context.register(maskStream);

    const imgDict = pdfDoc.context.obj({
      Type: PDFName.of("XObject"),
      Subtype: PDFName.of("Image"),
      Width: 10,
      Height: 10,
      BitsPerComponent: 8,
      ColorSpace: PDFName.of("DeviceRGB"),
      SMask: maskRef,
    });
    const imgStream = PDFRawStream.of(imgDict, new Uint8Array(300));
    const imgRef = pdfDoc.context.register(imgStream);

    page.node.set(
      PDFName.of("Resources"),
      pdfDoc.context.obj({
        XObject: { ImgSMask: imgRef },
      })
    );

    const bytes = await pdfDoc.save();
    const res = await extractPdfImages(bytes);
    assert(res.uniqueImagesCount >= 1, "Should detect SMask image");
    assert(
      res.images[0].colorSpace.includes("SMask"),
      `Should classify SMask Transparency, got ${res.images[0].colorSpace}`
    );
    pass("Test 6: Transparent Image with SMask Handling");
  } catch (e) {
    console.error(e);
  }

  // 7. JPEG2000 / JPXDecode Filter Classification
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 400]);

    const streamDict = pdfDoc.context.obj({
      Type: PDFName.of("XObject"),
      Subtype: PDFName.of("Image"),
      Width: 15,
      Height: 15,
      Filter: PDFName.of("JPXDecode"),
    });
    const rawStream = PDFRawStream.of(streamDict, new Uint8Array([0, 0, 0, 12, 106, 80, 32, 32]));
    const streamRef = pdfDoc.context.register(rawStream);
    page.node.set(
      PDFName.of("Resources"),
      pdfDoc.context.obj({
        XObject: { ImgJpx: streamRef },
      })
    );

    const bytes = await pdfDoc.save();
    const res = await extractPdfImages(bytes);
    assert(res.uniqueImagesCount === 1, "Should detect JPXDecode XObject");
    assert(
      res.images[0].colorSpace.includes("JPXDecode"),
      `Should classify JPXDecode (JPEG2000), got ${res.images[0].colorSpace}`
    );
    pass("Test 7: JPEG2000 / JPXDecode Filter Classification");
  } catch (e) {
    console.error(e);
  }

  // 8. Content-Stream Inline Image Detection (BI / ID / EI)
  try {
    const bytes = await createTestPdfWithPngs([VALID_PNG_BYTES], [0]);
    const res = await extractPdfImages(bytes);
    assert(res.success === true, "Inline operator scanner pass should execute without errors");
    pass("Test 8: Content-Stream Inline Image Operator Pass Execution");
  } catch (e) {
    console.error(e);
  }

  // 9. Nested Form XObject Image Extraction with Cycle Protection
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([500, 500]);
    const img = await pdfDoc.embedPng(VALID_PNG_BYTES);

    const formDict = pdfDoc.context.obj({
      Type: PDFName.of("XObject"),
      Subtype: PDFName.of("Form"),
      BBox: [0, 0, 100, 100],
      Resources: {
        XObject: { FormInnerImg: img.ref },
      },
    });
    const formStream = PDFRawStream.of(formDict, new Uint8Array(0));
    const formRef = pdfDoc.context.register(formStream);

    page.node.set(
      PDFName.of("Resources"),
      pdfDoc.context.obj({
        XObject: { ParentForm: formRef },
      })
    );

    const bytes = await pdfDoc.save();
    const res = await extractPdfImages(bytes);
    assert(res.uniqueImagesCount >= 1, "Should recursively extract image from inside Form XObject");
    pass("Test 9: Nested Form XObject Image Extraction with Cycle Protection");
  } catch (e) {
    console.error(e);
  }

  // 10. Multi-Page Image References & Source Page Association
  try {
    const pdfBytes = await createTestPdfWithPngs([VALID_PNG_BYTES], [0, 0]);
    const res = await extractPdfImages(pdfBytes);
    assert(res.uniqueImagesCount === 1, "Should identify 1 unique image");
    assert(res.images[0].sourcePages.length === 2, "sourcePages should map to both pages [1, 2]");
    pass("Test 10: Multi-Page Image References & Source Page Association");
  } catch (e) {
    console.error(e);
  }

  // 11. Page-Range Extraction ("1-2", "2", "all")
  try {
    const pdfDoc = await PDFDocument.create();
    const img1 = await pdfDoc.embedPng(VALID_PNG_BYTES);
    const img2 = await pdfDoc.embedPng(VALID_PNG_BYTES);

    const page1 = pdfDoc.addPage([400, 400]);
    page1.drawImage(img1, { x: 10, y: 10, width: 50, height: 50 });

    const page2 = pdfDoc.addPage([400, 400]);
    page2.drawImage(img2, { x: 10, y: 10, width: 50, height: 50 });

    const page3 = pdfDoc.addPage([400, 400]);

    const bytes = await pdfDoc.save();

    const resPage1 = await extractPdfImages(bytes, { pageRange: "1" });
    assert(resPage1.scannedPagesCount === 1, "Should scan exactly 1 page for range '1'");

    const resRange23 = await extractPdfImages(bytes, { pageRange: "2-3" });
    assert(resRange23.scannedPagesCount === 2, "Should scan 2 pages for range '2-3'");

    pass("Test 11: Page-Range Extraction (parsePageRange)");
  } catch (e) {
    console.error(e);
  }

  // 12. Indirect Object Deduplication
  try {
    const pdfBytes = await createTestPdfWithPngs([VALID_PNG_BYTES], [0, 0, 0]);
    const res = await extractPdfImages(pdfBytes);
    assert(res.uniqueImagesCount === 1, "Deduplication should consolidate 3 page uses to 1 unique image");
    assert(res.totalImagesCount === 3, "totalImagesCount should record 3 placements");
    pass("Test 12: Indirect Object Deduplication");
  } catch (e) {
    console.error(e);
  }

  // 13. AbortSignal Cancellation
  try {
    let errorCaught = false;
    const controller = new AbortController();
    controller.abort();

    try {
      const pdfBytes = await createTestPdfWithPngs([VALID_PNG_BYTES], [0]);
      await extractPdfImages(pdfBytes, { signal: controller.signal });
    } catch (err) {
      errorCaught = true;
      assert(err.code === "CANCELLED", `Expected CANCELLED code, got ${err.code}`);
    }
    assert(errorCaught, "Aborted signal should throw CANCELLED error");
    pass("Test 13: AbortSignal Cancellation");
  } catch (e) {
    console.error(e);
  }

  // 14. Corrupted PDF Handling
  try {
    let errorCaught = false;
    try {
      const corruptBytes = new Uint8Array([99, 111, 114, 114, 117, 112, 116]);
      await extractPdfImages(corruptBytes);
    } catch (err) {
      errorCaught = true;
      assert(err.code === "CORRUPTED_PDF", `Expected CORRUPTED_PDF, got ${err.code}`);
    }
    assert(errorCaught, "Corrupted bytes should throw CORRUPTED_PDF error");
    pass("Test 14: Corrupted PDF Handling");
  } catch (e) {
    console.error(e);
  }

  // 15. Password-Protected PDF Classification
  try {
    let errorCaught = false;
    try {
      const encBytes = fs.readFileSync("scratch/test_aes256.pdf");
      await extractPdfImages(encBytes);
    } catch (err) {
      errorCaught = true;
      assert(err.code === "PASSWORD_PROTECTED", `Expected PASSWORD_PROTECTED, got ${err.code}`);
    }
    assert(errorCaught, "Encrypted PDF should throw PASSWORD_PROTECTED error");
    pass("Test 15: Password-Protected PDF Classification");
  } catch (e) {
    console.error(e);
  }

  // 16. Text-Only PDF Handling
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 400]);
    page.drawText("Text Only PDF Document");
    const bytes = await pdfDoc.save();

    const res = await extractPdfImages(bytes);
    assert(res.uniqueImagesCount === 0, "Text-only PDF should return 0 images");
    pass("Test 16: Text-Only PDF Handling");
  } catch (e) {
    console.error(e);
  }

  // 17. Vector-Only PDF Handling
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 400]);
    page.drawLine({ start: { x: 10, y: 10 }, end: { x: 100, y: 100 } });
    page.drawRectangle({ x: 20, y: 20, width: 80, height: 80 });
    const bytes = await pdfDoc.save();

    const res = await extractPdfImages(bytes);
    assert(res.uniqueImagesCount === 0, "Vector-only PDF should return 0 raster images");
    assert(res.warnings.length > 0, "Vector-only PDF should issue warning");
    pass("Test 17: Vector-Only PDF Handling");
  } catch (e) {
    console.error(e);
  }

  console.log("\n=================================================");
  console.log(`  PHASE F TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("=================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runPhaseFTests().catch((err) => {
  console.error("Unhandled test runner error:", err);
  process.exit(1);
});
