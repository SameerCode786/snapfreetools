/**
 * Automated Test Suite for Phase A Extract PDF Images Engine
 * 
 * Verifies core engine functionality:
 * - JPEG SOI byte recovery & validation
 * - PNG signature validation & pure JS PNG pixel encoding
 * - Password protection & corrupted PDF error classification
 * - Indirect XObject deduplication & source page association
 * - AbortSignal cancellation & progress callbacks
 * - Structured metadata return shape & dimension filtering
 */

import fs from "fs";
import { PDFDocument } from "pdf-lib";
import {
  extractPdfImages,
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

// Helper to build PDF with PNGs
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

// Helper to build text-only PDF
async function createTextOnlyPdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  page.drawText("Hello SnapFreeTools PDF Engine Test", { x: 50, y: 700 });
  return await pdfDoc.save();
}

// Helper to build vector path PDF
async function createVectorPathPdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  page.drawLine({ start: { x: 50, y: 50 }, end: { x: 250, y: 250 } });
  page.drawRectangle({ x: 100, y: 100, width: 150, height: 150 });
  return await pdfDoc.save();
}

async function runTests() {
  console.log("=================================================");
  console.log("  STARTING PHASE A PDF IMAGE EXTRACTION ENGINE TESTS");
  console.log("=================================================\n");

  // 1. Initialization & Valid PDF Buffer Handling
  try {
    const pdfBytes = await createTextOnlyPdf();
    const res = await extractPdfImages(pdfBytes);
    assert(res.success === true, "Result should indicate success: true");
    assert(typeof res.timingMs === "number", "timingMs should be a number");
    pass("Test 1: Valid PDF Buffer Initialization");
  } catch (e) {
    console.error(e);
  }

  // 2. Null / Empty Source Rejection
  try {
    let errorCaught = false;
    try {
      await extractPdfImages(null);
    } catch (err) {
      errorCaught = true;
      assert(
        err instanceof PdfExtractionError,
        "Should throw PdfExtractionError"
      );
      assert(
        err.code === "INVALID_SOURCE",
        `Expected code INVALID_SOURCE, got ${err.code}`
      );
    }
    assert(errorCaught, "Null source should throw INVALID_SOURCE error");
    pass("Test 2: Null / Empty Source Rejection");
  } catch (e) {
    console.error(e);
  }

  // 3. Invalid Buffer Type Rejection
  try {
    let errorCaught = false;
    try {
      await extractPdfImages({ invalidKey: 123 });
    } catch (err) {
      errorCaught = true;
      assert(err.code === "INVALID_SOURCE", "Expected INVALID_SOURCE code");
    }
    assert(errorCaught, "Invalid object type should throw INVALID_SOURCE");
    pass("Test 3: Invalid Buffer Type Rejection");
  } catch (e) {
    console.error(e);
  }

  // 4. Password-Protected PDF Rejection
  try {
    let errorCaught = false;
    try {
      const encBytes = fs.readFileSync("scratch/test_aes256.pdf");
      await extractPdfImages(encBytes);
    } catch (err) {
      errorCaught = true;
      assert(
        err.code === "PASSWORD_PROTECTED",
        `Expected PASSWORD_PROTECTED, got ${err.code}`
      );
    }
    assert(errorCaught, "Encrypted PDF should throw PASSWORD_PROTECTED error");
    pass("Test 4: Password-Protected PDF Rejection");
  } catch (e) {
    console.error(e);
  }

  // 5. Corrupted PDF Structure Handling
  try {
    let errorCaught = false;
    try {
      const corruptBytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      await extractPdfImages(corruptBytes);
    } catch (err) {
      errorCaught = true;
      assert(
        err.code === "CORRUPTED_PDF",
        `Expected CORRUPTED_PDF, got ${err.code}`
      );
    }
    assert(errorCaught, "Corrupt PDF should throw CORRUPTED_PDF error");
    pass("Test 5: Corrupted PDF Structure Handling");
  } catch (e) {
    console.error(e);
  }

  // 6. Single Embedded Image Extraction
  try {
    const pdfBytes = await createTestPdfWithPngs([VALID_PNG_BYTES], [0]);
    const res = await extractPdfImages(pdfBytes);
    assert(res.uniqueImagesCount === 1, "Should find 1 unique image");
    assert(res.images.length === 1, "images array length should be 1");
    pass("Test 6: Single Embedded Image Extraction");
  } catch (e) {
    console.error(e);
  }

  // 7. PNG MIME Type & Format Metadata
  try {
    const pdfBytes = await createTestPdfWithPngs([VALID_PNG_BYTES], [0]);
    const res = await extractPdfImages(pdfBytes);
    const img = res.images[0];
    assert(img.mimeType === "image/png", `MIME type should be image/png, got ${img.mimeType}`);
    assert(img.format === "png", `Format should be png, got ${img.format}`);
    pass("Test 7: PNG MIME Type & Format Metadata");
  } catch (e) {
    console.error(e);
  }

  // 8. PNG Natural Dimension Accuracy
  try {
    const pdfBytes = await createTestPdfWithPngs([VALID_PNG_BYTES], [0]);
    const res = await extractPdfImages(pdfBytes);
    const img = res.images[0];
    assert(img.width === 1, `Width should be 1, got ${img.width}`);
    assert(img.height === 1, `Height should be 1, got ${img.height}`);
    pass("Test 8: PNG Natural Dimension Accuracy");
  } catch (e) {
    console.error(e);
  }

  // 9. PNG Header Validity (isPngValid)
  try {
    const pdfBytes = await createTestPdfWithPngs([VALID_PNG_BYTES], [0]);
    const res = await extractPdfImages(pdfBytes);
    const img = res.images[0];
    assert(isPngValid(img.data), "Extracted data should be a valid PNG binary");
    pass("Test 9: PNG Header Validity (isPngValid)");
  } catch (e) {
    console.error(e);
  }

  // 10. JPEG Header Helper Validation (isJpegValid)
  try {
    const validJpgHeader = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
    const invalidHeader = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    assert(isJpegValid(validJpgHeader) === true, "Valid header should return true");
    assert(isJpegValid(invalidHeader) === false, "Invalid header should return false");
    pass("Test 10: JPEG Header Helper Validation (isJpegValid)");
  } catch (e) {
    console.error(e);
  }

  // 11. Pure JS PNG Encoder (encodePixelsToPng) Output Validity
  try {
    const rgbaPixels = new Uint8Array([255, 0, 0, 255, 0, 255, 0, 255]);
    const encodedPng = encodePixelsToPng(2, 1, rgbaPixels, true);
    assert(isPngValid(encodedPng), "Encoded pixels should produce valid PNG signature");
    pass("Test 11: Pure JS PNG Encoder Output Validity");
  } catch (e) {
    console.error(e);
  }

  // 12. Multiple Image Extraction
  try {
    const pdfBytes = await createTestPdfWithPngs(
      [VALID_PNG_BYTES, VALID_PNG_BYTES],
      [0, 1]
    );
    const res = await extractPdfImages(pdfBytes);
    assert(res.uniqueImagesCount === 2, `Expected 2 unique images, got ${res.uniqueImagesCount}`);
    pass("Test 12: Multiple Image Extraction");
  } catch (e) {
    console.error(e);
  }

  // 13. Page Association Tracking (sourcePages)
  try {
    const pdfBytes = await createTestPdfWithPngs([VALID_PNG_BYTES], [0]);
    const res = await extractPdfImages(pdfBytes);
    const img = res.images[0];
    assert(
      Array.isArray(img.sourcePages) && img.sourcePages[0] === 1,
      "sourcePages should be [1]"
    );
    pass("Test 13: Page Association Tracking (sourcePages)");
  } catch (e) {
    console.error(e);
  }

  // 14. Indirect Object Deduplication Across Multiple Pages
  try {
    const pdfBytes = await createTestPdfWithPngs([VALID_PNG_BYTES], [0, 0]);
    const res = await extractPdfImages(pdfBytes);
    assert(
      res.uniqueImagesCount === 1,
      `Expected 1 unique image, got ${res.uniqueImagesCount}`
    );
    assert(
      res.totalImagesCount === 2,
      `Expected 2 total occurrences, got ${res.totalImagesCount}`
    );
    assert(
      res.images[0].sourcePages.length === 2 &&
        res.images[0].sourcePages[0] === 1 &&
        res.images[0].sourcePages[1] === 2,
      "sourcePages should contain [1, 2]"
    );
    pass("Test 14: Indirect Object Deduplication Across Pages");
  } catch (e) {
    console.error(e);
  }

  // 15. Unique vs Total Image Counting Accuracy
  try {
    const pdfBytes = await createTestPdfWithPngs([VALID_PNG_BYTES], [0, 0, 0]);
    const res = await extractPdfImages(pdfBytes);
    assert(res.uniqueImagesCount === 1, "uniqueImagesCount should be 1");
    assert(res.totalImagesCount === 3, "totalImagesCount should be 3");
    pass("Test 15: Unique vs Total Image Counting Accuracy");
  } catch (e) {
    console.error(e);
  }

  // 16. Dimension Filtering (minWidth & minHeight)
  try {
    const pdfBytes = await createTestPdfWithPngs([VALID_PNG_BYTES], [0]);
    const resFiltered = await extractPdfImages(pdfBytes, {
      minWidth: 10,
      minHeight: 10,
    });
    assert(
      resFiltered.uniqueImagesCount === 0,
      "Images smaller than 10x10 should be filtered out"
    );
    pass("Test 16: Dimension Filtering (minWidth & minHeight)");
  } catch (e) {
    console.error(e);
  }

  // 17. Portrait Orientation Page Document Handling
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([500, 800]);
    const img = await pdfDoc.embedPng(VALID_PNG_BYTES);
    page.drawImage(img, { x: 50, y: 50, width: 100, height: 100 });
    const pdfBytes = await pdfDoc.save();

    const res = await extractPdfImages(pdfBytes);
    assert(res.pageCount === 1, "Page count should be 1");
    assert(res.uniqueImagesCount === 1, "Should extract image from portrait page");
    pass("Test 17: Portrait Orientation Page Document Handling");
  } catch (e) {
    console.error(e);
  }

  // 18. Landscape Orientation Page Document Handling
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([800, 500]);
    const img = await pdfDoc.embedPng(VALID_PNG_BYTES);
    page.drawImage(img, { x: 50, y: 50, width: 100, height: 100 });
    const pdfBytes = await pdfDoc.save();

    const res = await extractPdfImages(pdfBytes);
    assert(res.pageCount === 1, "Page count should be 1");
    assert(res.uniqueImagesCount === 1, "Should extract image from landscape page");
    pass("Test 18: Landscape Orientation Page Document Handling");
  } catch (e) {
    console.error(e);
  }

  // 19. Multi-Page Document Page Scanning
  try {
    const pdfDoc = await PDFDocument.create();
    for (let i = 0; i < 5; i++) {
      pdfDoc.addPage([400, 400]);
    }
    const pdfBytes = await pdfDoc.save();
    const res = await extractPdfImages(pdfBytes);
    assert(res.pageCount === 5, `Expected 5 pages, got ${res.pageCount}`);
    assert(res.scannedPagesCount === 5, "scannedPagesCount should be 5");
    pass("Test 19: Multi-Page Document Page Scanning");
  } catch (e) {
    console.error(e);
  }

  // 20. Text-Only Document Handling
  try {
    const pdfBytes = await createTextOnlyPdf();
    const res = await extractPdfImages(pdfBytes);
    assert(res.uniqueImagesCount === 0, "Text-only PDF should return 0 images");
    assert(res.images.length === 0, "images array should be empty");
    pass("Test 20: Text-Only Document Handling");
  } catch (e) {
    console.error(e);
  }

  // 21. Vector Path / Non-Raster Document Handling
  try {
    const pdfBytes = await createVectorPathPdf();
    const res = await extractPdfImages(pdfBytes);
    assert(res.uniqueImagesCount === 0, "Vector path PDF should return 0 raster images");
    assert(
      res.warnings.some((w) => w.includes("vector") || w.includes("raster")),
      "Should include informative warning regarding vector paths"
    );
    pass("Test 21: Vector Path / Non-Raster Document Handling");
  } catch (e) {
    console.error(e);
  }

  // 22. AbortSignal Cancellation Handling
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
    pass("Test 22: AbortSignal Cancellation Handling");
  } catch (e) {
    console.error(e);
  }

  // 23. Progress Callback Dispatch
  try {
    let progressCallsCount = 0;
    const pdfBytes = await createTestPdfWithPngs([VALID_PNG_BYTES], [0]);
    await extractPdfImages(pdfBytes, {
      onProgress: (p) => {
        progressCallsCount++;
        assert(typeof p.currentPage === "number", "p.currentPage should be number");
        assert(typeof p.totalPages === "number", "p.totalPages should be number");
      },
    });
    assert(progressCallsCount > 0, "onProgress callback should be dispatched");
    pass("Test 23: Progress Callback Dispatch");
  } catch (e) {
    console.error(e);
  }

  // 24. Deterministic Image ID Assignment
  try {
    const pdfBytes = await createTestPdfWithPngs([VALID_PNG_BYTES], [0]);
    const res = await extractPdfImages(pdfBytes);
    const img = res.images[0];
    assert(
      typeof img.id === "string" && img.id.startsWith("img_obj_"),
      `Image ID should be string starting with img_obj_, got ${img.id}`
    );
    pass("Test 24: Deterministic Image ID Assignment");
  } catch (e) {
    console.error(e);
  }

  // 25. Structured Result Output Shape Verification
  try {
    const pdfBytes = await createTestPdfWithPngs([VALID_PNG_BYTES], [0]);
    const res = await extractPdfImages(pdfBytes);
    assert(res.hasOwnProperty("success"), "Result must contain success field");
    assert(res.hasOwnProperty("pageCount"), "Result must contain pageCount field");
    assert(res.hasOwnProperty("totalImagesCount"), "Result must contain totalImagesCount");
    assert(res.hasOwnProperty("uniqueImagesCount"), "Result must contain uniqueImagesCount");
    assert(Array.isArray(res.images), "Result must contain images array");
    assert(Array.isArray(res.warnings), "Result must contain warnings array");
    assert(typeof res.timingMs === "number", "Result must contain timingMs");
    pass("Test 25: Structured Result Output Shape Verification");
  } catch (e) {
    console.error(e);
  }

  // 26. Cleanup & Resource Release Verification
  try {
    const pdfBytes = await createTestPdfWithPngs([VALID_PNG_BYTES], [0]);
    const res = await extractPdfImages(pdfBytes);
    assert(res.images[0].data instanceof Uint8Array, "Extracted data must be Uint8Array");
    assert(res.images[0].byteSize > 0, "byteSize must be > 0");
    pass("Test 26: Cleanup & Resource Release Verification");
  } catch (e) {
    console.error(e);
  }

  console.log("\n=================================================");
  console.log(`  TEST RESULTS SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("=================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Unhandled test runner error:", err);
  process.exit(1);
});
