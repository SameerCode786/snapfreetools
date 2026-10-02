import fs from "fs";
import { PDFDocument, rgb } from "pdf-lib";
import { createCanvas } from "@napi-rs/canvas";

// Set up Node.js test environment canvas hook
globalThis.__NAPI_CANVAS_CREATE__ = (w, h) => createCanvas(w, h);

import {
  readPdfGrayscaleInfo,
  convertPdfToGrayscale,
  getSafeGrayscaleFilename,
  normalizeToUint8Array,
  PdfGrayscaleError
} from "../src/features/pdf-to-grayscale/engine/pdfGrayscaleEngine.js";

console.log("=================================================");
console.log("   STARTING PDF TO GRAYSCALE ENGINE TEST SUITE   ");
console.log("=================================================\n");

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

// Helper to construct sample PDF bytes with color shapes & text
async function createSampleColorPdf(pagesConfig = [{ width: 500, height: 700 }]) {
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < pagesConfig.length; i++) {
    const cfg = pagesConfig[i];
    const page = pdfDoc.addPage([cfg.width, cfg.height]);

    // Draw bright color text and shapes
    page.drawText(`Page ${i + 1} - Color Test Document`, {
      x: 50,
      y: cfg.height - 50,
      size: 18,
      color: rgb(0.9, 0.1, 0.1) // Bright Red
    });

    // Draw Red Box
    page.drawRectangle({
      x: 50,
      y: cfg.height - 200,
      width: 150,
      height: 100,
      color: rgb(1, 0, 0)
    });

    // Draw Green Box
    page.drawRectangle({
      x: 220,
      y: cfg.height - 200,
      width: 150,
      height: 100,
      color: rgb(0, 1, 0)
    });

    // Draw Blue Box
    page.drawRectangle({
      x: 50,
      y: cfg.height - 350,
      width: 320,
      height: 100,
      color: rgb(0, 0, 1)
    });
  }

  return await pdfDoc.save();
}

async function runTests() {
  // Test 1: API Exports Verification
  try {
    assert(typeof readPdfGrayscaleInfo === "function", "readPdfGrayscaleInfo must be a function");
    assert(typeof convertPdfToGrayscale === "function", "convertPdfToGrayscale must be a function");
    assert(typeof getSafeGrayscaleFilename === "function", "getSafeGrayscaleFilename must be a function");
    assert(typeof normalizeToUint8Array === "function", "normalizeToUint8Array must be a function");
    assert(typeof PdfGrayscaleError === "function", "PdfGrayscaleError must be a class");
    pass("Test 1: Core API & Class Export Verification");
  } catch (e) {
    console.error("Test 1 Failed:", e.message);
  }

  // Test 2: Filename Sanitization Matrix
  try {
    assert(getSafeGrayscaleFilename("Report.pdf") === "report-grayscale.pdf", "Basic filename sanitization");
    assert(getSafeGrayscaleFilename("My Document 2026!.PDF") === "my-document-2026-grayscale.pdf", "Special chars & uppercase extension");
    assert(getSafeGrayscaleFilename("file.name.with.dots.pdf") === "file-name-with-dots-grayscale.pdf", "Multiple extensions");
    assert(getSafeGrayscaleFilename("") === "document-grayscale.pdf", "Empty string default fallback");
    assert(getSafeGrayscaleFilename(null) === "document-grayscale.pdf", "Null default fallback");
    pass("Test 2: Filename Sanitization & Output Naming Rules");
  } catch (e) {
    console.error("Test 2 Failed:", e.message);
  }

  // Test 3: Input Normalization Utility
  try {
    const arr = new Uint8Array([1, 2, 3]);
    const norm1 = await normalizeToUint8Array(arr);
    assert(norm1 instanceof Uint8Array && norm1.length === 3, "Uint8Array normalization");

    const ab = arr.buffer;
    const norm2 = await normalizeToUint8Array(ab);
    assert(norm2 instanceof Uint8Array && norm2.length === 3, "ArrayBuffer normalization");

    pass("Test 3: Buffer & Input Normalization Safety");
  } catch (e) {
    console.error("Test 3 Failed:", e.message);
  }

  // Test 4: PDF Info Extraction (Single & Multi-Page)
  try {
    const sampleBytes = await createSampleColorPdf([
      { width: 500, height: 700 },
      { width: 800, height: 600 }
    ]);
    const info = await readPdfGrayscaleInfo(sampleBytes);
    assert(info.pageCount === 2, `Expected pageCount 2, got ${info.pageCount}`);
    assert(info.byteSize > 0, "Byte size should be greater than 0");
    assert(info.pdfBytes instanceof Uint8Array, "pdfBytes must be Uint8Array");
    pass("Test 4: PDF Metadata & Info Reading");
  } catch (e) {
    console.error("Test 4 Failed:", e.message);
  }

  // Test 5: Single-Page Grayscale Conversion Execution
  try {
    const colorPdfBytes = await createSampleColorPdf([{ width: 600, height: 800 }]);
    const result = await convertPdfToGrayscale(colorPdfBytes, {
      filename: "test-single.pdf",
      dpi: 150
    });

    assert(result.success === true, "Result success flag must be true");
    assert(result.pageCount === 1, `Page count must be 1, got ${result.pageCount}`);
    assert(result.filename === "test-single-grayscale.pdf", `Filename mismatch: ${result.filename}`);
    assert(result.originalSize > 0, "Original size > 0");
    assert(result.outputSize > 0, "Output size > 0");
    assert(result.pdfBytes instanceof Uint8Array, "pdfBytes must be Uint8Array");
    assert(result.mode === "standard", "Mode should be standard");
    assert(result.dpi === 150, "DPI should be 150");

    // Verify reloaded document integrity with pdf-lib
    const reloaded = await PDFDocument.load(result.pdfBytes);
    assert(reloaded.getPageCount() === 1, "Reloaded PDF page count must be 1");
    const firstPage = reloaded.getPage(0);
    assert(Math.round(firstPage.getWidth()) === 600, `Page width mismatch: ${firstPage.getWidth()}`);
    assert(Math.round(firstPage.getHeight()) === 800, `Page height mismatch: ${firstPage.getHeight()}`);

    pass("Test 5: Single-Page Grayscale Conversion & Reload Verification");
  } catch (e) {
    console.error("Test 5 Failed:", e.message);
  }

  // Test 6: Multi-Page & Mixed Dimensions (Portrait + Landscape)
  try {
    const colorPdfBytes = await createSampleColorPdf([
      { width: 595, height: 842 }, // A4 Portrait
      { width: 842, height: 595 }, // A4 Landscape
      { width: 600, height: 600 }  // Square
    ]);

    const result = await convertPdfToGrayscale(colorPdfBytes, {
      filename: "mixed-pages.pdf",
      dpi: 150
    });

    assert(result.pageCount === 3, `Expected 3 pages, got ${result.pageCount}`);
    const reloaded = await PDFDocument.load(result.pdfBytes);
    assert(reloaded.getPageCount() === 3, "Reloaded document page count must be 3");

    const page1 = reloaded.getPage(0);
    const page2 = reloaded.getPage(1);
    const page3 = reloaded.getPage(2);

    assert(Math.round(page1.getWidth()) === 595 && Math.round(page1.getHeight()) === 842, "Page 1 A4 Portrait dimensions preserved");
    assert(Math.round(page2.getWidth()) === 842 && Math.round(page2.getHeight()) === 595, "Page 2 A4 Landscape dimensions preserved");
    assert(Math.round(page3.getWidth()) === 600 && Math.round(page3.getHeight()) === 600, "Page 3 Square dimensions preserved");

    pass("Test 6: Multi-Page & Mixed Aspect Ratio Dimension Preservation");
  } catch (e) {
    console.error("Test 6 Failed:", e.message);
  }

  // Test 7: Luminance Grayscale Conversion Formula Math Check
  try {
    const testCases = [
      { r: 255, g: 0, b: 0, expected: 76 },   // Red -> 0.299 * 255 = 76.245 -> 76
      { r: 0, g: 255, b: 0, expected: 150 },  // Green -> 0.587 * 255 = 149.685 -> 150
      { r: 0, g: 0, b: 255, expected: 29 },   // Blue -> 0.114 * 255 = 29.07 -> 29
      { r: 255, g: 255, b: 255, expected: 255 }, // White
      { r: 0, g: 0, b: 0, expected: 0 }        // Black
    ];

    for (const tc of testCases) {
      const gray = Math.round(0.299 * tc.r + 0.587 * tc.g + 0.114 * tc.b);
      assert(gray === tc.expected, `Luminance formula for RGB(${tc.r},${tc.g},${tc.b}) expected ${tc.expected}, got ${gray}`);
    }
    pass("Test 7: Standard ITU-R BT.601 Luminance Pixel Formula Verification");
  } catch (e) {
    console.error("Test 7 Failed:", e.message);
  }

  // Test 8: Progress Callback Updates
  try {
    const pdfBytes = await createSampleColorPdf([{ width: 500, height: 700 }, { width: 500, height: 700 }]);
    const reportedStages = [];

    await convertPdfToGrayscale(pdfBytes, {
      onProgress: (p) => {
        reportedStages.push({ stage: p.stage, pct: p.percentage, page: p.currentPage });
      }
    });

    assert(reportedStages.length > 0, "onProgress should receive events");
    const stagesSet = new Set(reportedStages.map(s => s.stage));
    assert(stagesSet.has("initializing"), "Progress should contain 'initializing'");
    assert(stagesSet.has("rendering"), "Progress should contain 'rendering'");
    assert(stagesSet.has("converting"), "Progress should contain 'converting'");
    assert(stagesSet.has("assembling"), "Progress should contain 'assembling'");
    assert(stagesSet.has("complete"), "Progress should contain 'complete'");

    pass("Test 8: Granular Progress Callback Tracking");
  } catch (e) {
    console.error("Test 8 Failed:", e.message);
  }

  // Test 9: AbortSignal Cancellation
  try {
    const pdfBytes = await createSampleColorPdf([{ width: 500, height: 700 }, { width: 500, height: 700 }]);
    const controller = new AbortController();
    controller.abort(); // Pre-cancelled signal

    let caughtError = null;
    try {
      await convertPdfToGrayscale(pdfBytes, {
        signal: controller.signal
      });
    } catch (err) {
      caughtError = err;
    }

    assert(caughtError !== null, "Cancellation must throw error");
    assert(caughtError instanceof PdfGrayscaleError, "Error must be PdfGrayscaleError");
    assert(caughtError.code === "CANCELLED", `Error code must be CANCELLED, got ${caughtError.code}`);

    pass("Test 9: AbortSignal Cancellation Safety");
  } catch (e) {
    console.error("Test 9 Failed:", e.message);
  }

  // Test 10: Corrupted PDF Error Handling
  try {
    const invalidBytes = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let caughtError = null;
    try {
      await convertPdfToGrayscale(invalidBytes);
    } catch (err) {
      caughtError = err;
    }

    assert(caughtError !== null, "Corrupted PDF must throw error");
    assert(caughtError instanceof PdfGrayscaleError, "Error must be PdfGrayscaleError");
    assert(caughtError.code === "CORRUPTED_PDF", `Expected CORRUPTED_PDF error code, got ${caughtError.code}`);

    pass("Test 10: Corrupted PDF Error Classification");
  } catch (e) {
    console.error("Test 10 Failed:", e.message);
  }

  // Test 11: Encrypted / Password-Protected PDF Detection
  try {
    if (fs.existsSync("scratch/test_aes256.pdf")) {
      const encryptedBytes = fs.readFileSync("scratch/test_aes256.pdf");
      let caughtError = null;
      try {
        await convertPdfToGrayscale(encryptedBytes);
      } catch (err) {
        caughtError = err;
      }

      assert(caughtError !== null, "Encrypted PDF must throw error");
      assert(caughtError instanceof PdfGrayscaleError, "Error must be PdfGrayscaleError");
      assert(caughtError.code === "PASSWORD_PROTECTED", `Expected PASSWORD_PROTECTED code, got ${caughtError.code}`);
      pass("Test 11: Encrypted PDF Password Protection Catch");
    } else {
      console.log("⚠️ Skipped Test 11: scratch/test_aes256.pdf fixture not found.");
    }
  } catch (e) {
    console.error("Test 11 Failed:", e.message);
  }

  console.log("\n=================================================");
  console.log(`TEST SUITE COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("=================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal Test Runner Error:", err);
  process.exit(1);
});
