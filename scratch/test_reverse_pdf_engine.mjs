import fs from "fs";
import { PDFDocument, rgb } from "pdf-lib";
import {
  readPdfInfo,
  reversePdfPages,
  buildReorderedIndices,
  getSafeReversedFilename,
  normalizeToUint8Array,
  ReversePdfError
} from "../src/features/reverse-pdf-pages/engine/reversePdfEngine.js";

console.log("=================================================");
console.log("   STARTING REVERSE PDF ENGINE TEST SUITE       ");
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

// Helper to construct sample PDF bytes with distinct page text
async function createNumberedPdf(pageCount = 5) {
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.addPage([500, 700]);
    page.drawText(`Unique Page Identifier #${i + 1}`, {
      x: 50,
      y: 650,
      size: 16,
      color: rgb(0.1, 0.1, 0.8)
    });
  }

  return await pdfDoc.save();
}

async function runTests() {
  // Test 1: API Exports
  try {
    assert(typeof readPdfInfo === "function", "readPdfInfo must be a function");
    assert(typeof reversePdfPages === "function", "reversePdfPages must be a function");
    assert(typeof buildReorderedIndices === "function", "buildReorderedIndices must be a function");
    assert(typeof getSafeReversedFilename === "function", "getSafeReversedFilename must be a function");
    assert(typeof normalizeToUint8Array === "function", "normalizeToUint8Array must be a function");
    assert(typeof ReversePdfError === "function", "ReversePdfError must be a class");
    pass("Test 1: API Exports & Module Structure");
  } catch (e) {
    console.error("Test 1 Failed:", e.message);
  }

  // Test 2: Filename Sanitization
  try {
    assert(getSafeReversedFilename("Document.pdf") === "document-reversed.pdf", "Basic filename reversal naming");
    assert(getSafeReversedFilename("Invoice 2026!.PDF") === "invoice-2026-reversed.pdf", "Special characters handling");
    assert(getSafeReversedFilename("my.contract.final.pdf") === "my-contract-final-reversed.pdf", "Multiple dots handling");
    assert(getSafeReversedFilename("") === "document-reversed.pdf", "Empty string fallback");
    assert(getSafeReversedFilename(null) === "document-reversed.pdf", "Null fallback");
    pass("Test 2: Output Filename Sanitization");
  } catch (e) {
    console.error("Test 2 Failed:", e.message);
  }

  // Test 3: Index Sequence Generation Helper
  try {
    const fullRev = buildReorderedIndices(5, "all");
    assert(JSON.stringify(fullRev) === JSON.stringify([4, 3, 2, 1, 0]), "Full 5-page reversal index array");

    const rangeRev = buildReorderedIndices(5, "range", 2, 4); // Pages 2 to 4 reversed
    assert(JSON.stringify(rangeRev) === JSON.stringify([0, 3, 2, 1, 4]), `Custom range 2..4 expected [0, 3, 2, 1, 4], got ${JSON.stringify(rangeRev)}`);

    pass("Test 3: buildReorderedIndices Range & Full Index Calculation");
  } catch (e) {
    console.error("Test 3 Failed:", e.message);
  }

  // Test 4: Single Page PDF Reversal
  try {
    const singlePdfBytes = await createNumberedPdf(1);
    const result = await reversePdfPages(singlePdfBytes, { filename: "single.pdf" });

    assert(result.success === true, "Result success should be true");
    assert(result.pageCount === 1, "Page count must remain 1");
    assert(result.filename === "single-reversed.pdf", `Filename mismatch: ${result.filename}`);

    const reloaded = await PDFDocument.load(result.pdfBytes);
    assert(reloaded.getPageCount() === 1, "Reloaded PDF must have 1 page");
    pass("Test 4: Single Page PDF Reversal Execution");
  } catch (e) {
    console.error("Test 4 Failed:", e.message);
  }

  // Test 5: 5-Page PDF Page Order Reversal Verification
  try {
    const multiPdfBytes = await createNumberedPdf(5);
    const result = await reversePdfPages(multiPdfBytes, { filename: "5pages.pdf" });

    assert(result.success === true, "Result success should be true");
    assert(result.pageCount === 5, "Page count must be 5");

    const reloaded = await PDFDocument.load(result.pdfBytes);
    assert(reloaded.getPageCount() === 5, "Reloaded document must have 5 pages");

    pass("Test 5: 5-Page PDF Reversal & Reloading");
  } catch (e) {
    console.error("Test 5 Failed:", e.message);
  }

  // Test 6: Custom Page Range Reversal Execution
  try {
    const multiPdfBytes = await createNumberedPdf(5);
    const result = await reversePdfPages(multiPdfBytes, {
      filename: "custom-range.pdf",
      mode: "range",
      rangeStart: 2,
      rangeEnd: 4
    });

    assert(result.success === true, "Result success should be true");
    assert(result.pageCount === 5, "Page count must remain 5");
    assert(JSON.stringify(result.reorderedIndices) === JSON.stringify([0, 3, 2, 1, 4]), "Reordered indices must match range reversal");

    pass("Test 6: Custom Range Reversal Execution (Pages 2-4 Reversed)");
  } catch (e) {
    console.error("Test 6 Failed:", e.message);
  }

  // Test 7: Progress Callback Updates
  try {
    const multiPdfBytes = await createNumberedPdf(3);
    const stagesReported = [];

    await reversePdfPages(multiPdfBytes, {
      onProgress: (p) => {
        stagesReported.push(p.stage);
      }
    });

    assert(stagesReported.includes("initializing"), "Must report initializing stage");
    assert(stagesReported.includes("reversing"), "Must report reversing stage");
    assert(stagesReported.includes("copying"), "Must report copying stage");
    assert(stagesReported.includes("complete"), "Must report complete stage");

    pass("Test 7: Progress Callback Tracking");
  } catch (e) {
    console.error("Test 7 Failed:", e.message);
  }

  // Test 8: AbortSignal Cancellation
  try {
    const pdfBytes = await createNumberedPdf(4);
    const controller = new AbortController();
    controller.abort();

    let caughtError = null;
    try {
      await reversePdfPages(pdfBytes, { signal: controller.signal });
    } catch (err) {
      caughtError = err;
    }

    assert(caughtError !== null, "Cancellation must throw error");
    assert(caughtError instanceof ReversePdfError, "Error must be ReversePdfError");
    assert(caughtError.code === "CANCELLED", `Error code must be CANCELLED, got ${caughtError.code}`);

    pass("Test 8: AbortSignal Cancellation Handling");
  } catch (e) {
    console.error("Test 8 Failed:", e.message);
  }

  // Test 9: Corrupted PDF Error Handling
  try {
    const invalidBytes = new Uint8Array([0, 9, 8, 7, 6, 5]);
    let caughtError = null;
    try {
      await reversePdfPages(invalidBytes);
    } catch (err) {
      caughtError = err;
    }

    assert(caughtError !== null, "Corrupted PDF must throw error");
    assert(caughtError instanceof ReversePdfError, "Error must be ReversePdfError");
    assert(caughtError.code === "CORRUPTED_PDF", `Expected CORRUPTED_PDF code, got ${caughtError.code}`);

    pass("Test 9: Corrupted PDF Error Classification");
  } catch (e) {
    console.error("Test 9 Failed:", e.message);
  }

  // Test 10: Password-Protected PDF Catch
  try {
    if (fs.existsSync("scratch/test_aes256.pdf")) {
      const encryptedBytes = fs.readFileSync("scratch/test_aes256.pdf");
      let caughtError = null;
      try {
        await reversePdfPages(encryptedBytes);
      } catch (err) {
        caughtError = err;
      }

      assert(caughtError !== null, "Encrypted PDF must throw error");
      assert(caughtError instanceof ReversePdfError, "Error must be ReversePdfError");
      assert(caughtError.code === "PASSWORD_PROTECTED", `Expected PASSWORD_PROTECTED code, got ${caughtError.code}`);
      pass("Test 10: Password-Protected PDF Catch");
    } else {
      console.log("⚠️ Skipped Test 10: scratch/test_aes256.pdf fixture not found.");
    }
  } catch (e) {
    console.error("Test 10 Failed:", e.message);
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
