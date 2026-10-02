import fs from "fs";
import { PDFDocument, rgb } from "pdf-lib";
import {
  readPdfInfo,
  extractPdfPages,
  parsePageSelection,
  getSafeExtractedFilename,
  normalizeToUint8Array,
  ExtractPdfError
} from "../src/features/extract-pdf-pages/engine/extractPdfEngine.js";

console.log("=================================================");
console.log("   STARTING EXTRACT PDF ENGINE TEST SUITE       ");
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
async function createNumberedPdf(pageCount = 6) {
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.addPage([500, 700]);
    page.drawText(`Page Content Index #${i + 1}`, {
      x: 50,
      y: 650,
      size: 16,
      color: rgb(0.1, 0.5, 0.2)
    });
  }

  return await pdfDoc.save();
}

async function runTests() {
  // Test 1: API Exports
  try {
    assert(typeof readPdfInfo === "function", "readPdfInfo must be a function");
    assert(typeof extractPdfPages === "function", "extractPdfPages must be a function");
    assert(typeof parsePageSelection === "function", "parsePageSelection must be a function");
    assert(typeof getSafeExtractedFilename === "function", "getSafeExtractedFilename must be a function");
    assert(typeof normalizeToUint8Array === "function", "normalizeToUint8Array must be a function");
    assert(typeof ExtractPdfError === "function", "ExtractPdfError must be a class");
    pass("Test 1: Core API & Module Structure Verification");
  } catch (e) {
    console.error("Test 1 Failed:", e.message);
  }

  // Test 2: Output Filename Sanitization
  try {
    assert(getSafeExtractedFilename("Report.pdf") === "report-extracted.pdf", "Basic filename sanitization");
    assert(getSafeExtractedFilename("My Document 2026!.PDF") === "my-document-2026-extracted.pdf", "Special chars & uppercase extension");
    assert(getSafeExtractedFilename("file.name.with.dots.pdf") === "file-name-with-dots-extracted.pdf", "Multiple extensions");
    assert(getSafeExtractedFilename("") === "document-extracted.pdf", "Empty string default fallback");
    assert(getSafeExtractedFilename(null) === "document-extracted.pdf", "Null default fallback");
    pass("Test 2: Filename Sanitization Rules");
  } catch (e) {
    console.error("Test 2 Failed:", e.message);
  }

  // Test 3: Range Parser - Range String "1-3, 5, 8"
  try {
    const parsed = parsePageSelection("1-3, 5, 8", 10);
    assert(JSON.stringify(parsed.pages1Based) === JSON.stringify([1, 2, 3, 5, 8]), `Range 1-3, 5, 8 1-based mismatch: ${JSON.stringify(parsed.pages1Based)}`);
    assert(JSON.stringify(parsed.indices0Based) === JSON.stringify([0, 1, 2, 4, 7]), `Range 1-3, 5, 8 0-based mismatch: ${JSON.stringify(parsed.indices0Based)}`);
    pass("Test 3: Range Parser Range String Parsing ('1-3, 5, 8')");
  } catch (e) {
    console.error("Test 3 Failed:", e.message);
  }

  // Test 4: Range Parser - Custom Order "6, 2, 4" & Array [6, 2, 4]
  try {
    const parsedStr = parsePageSelection("6, 2, 4", 6);
    assert(JSON.stringify(parsedStr.pages1Based) === JSON.stringify([6, 2, 4]), "Custom order string parsing");
    assert(JSON.stringify(parsedStr.indices0Based) === JSON.stringify([5, 1, 3]), "Custom order index parsing");

    const parsedArr = parsePageSelection([6, 2, 4], 6);
    assert(JSON.stringify(parsedArr.pages1Based) === JSON.stringify([6, 2, 4]), "Custom order array parsing");
    assert(JSON.stringify(parsedArr.indices0Based) === JSON.stringify([5, 1, 3]), "Custom order array index parsing");

    pass("Test 4: Range Parser Custom Order Preservation ([6, 2, 4])");
  } catch (e) {
    console.error("Test 4 Failed:", e.message);
  }

  // Test 5: Range Parser Validation - Page 0, Out of Range, Duplicates, Malformed
  try {
    // 5a. Page 0
    let err0 = null;
    try { parsePageSelection("0", 5); } catch (e) { err0 = e; }
    assert(err0 && err0.code === "OUT_OF_RANGE", "Page 0 should throw OUT_OF_RANGE");

    // 5b. Out of bounds (Page 10 in 5-page PDF)
    let errBound = null;
    try { parsePageSelection("10", 5); } catch (e) { errBound = e; }
    assert(errBound && errBound.code === "OUT_OF_RANGE", "Page 10 in 5-page PDF should throw OUT_OF_RANGE");

    // 5c. Duplicates ("2, 2, 4")
    let errDup = null;
    try { parsePageSelection("2, 2, 4", 5); } catch (e) { errDup = e; }
    assert(errDup && errDup.code === "INVALID_SELECTION", "Duplicate selection should throw INVALID_SELECTION");

    // 5d. Malformed Range ("1-5-9")
    let errMal = null;
    try { parsePageSelection("1-5-9", 10); } catch (e) { errMal = e; }
    assert(errMal && errMal.code === "INVALID_SELECTION", "Malformed range '1-5-9' should throw INVALID_SELECTION");

    // 5e. Range direction ("5-2")
    let errDir = null;
    try { parsePageSelection("5-2", 10); } catch (e) { errDir = e; }
    assert(errDir && errDir.code === "INVALID_SELECTION", "Invalid range direction '5-2' should throw INVALID_SELECTION");

    // 5f. Empty selection
    let errEmp = null;
    try { parsePageSelection("", 5); } catch (e) { errEmp = e; }
    assert(errEmp && errEmp.code === "EMPTY_SELECTION", "Empty selection should throw EMPTY_SELECTION");

    pass("Test 5: Comprehensive Range Parser Validation & Error Catches");
  } catch (e) {
    console.error("Test 5 Failed:", e.message);
  }

  // Test 6: Single-Page PDF Extraction
  try {
    const singlePdfBytes = await createNumberedPdf(1);
    const result = await extractPdfPages(singlePdfBytes, [1], { filename: "single.pdf" });

    assert(result.success === true, "Result success flag must be true");
    assert(result.originalPageCount === 1, "Original page count must be 1");
    assert(result.extractedPageCount === 1, "Extracted page count must be 1");
    assert(result.filename === "single-extracted.pdf", `Filename mismatch: ${result.filename}`);

    const reloaded = await PDFDocument.load(result.pdfBytes);
    assert(reloaded.getPageCount() === 1, "Reloaded PDF page count must be 1");

    pass("Test 6: Single-Page PDF Extraction & Reload Verification");
  } catch (e) {
    console.error("Test 6 Failed:", e.message);
  }

  // Test 7: Multi-Page Extraction - Extract Pages [1, 3, 5]
  try {
    const pdfBytes = await createNumberedPdf(6);
    const result = await extractPdfPages(pdfBytes, "1, 3, 5", { filename: "multi.pdf" });

    assert(result.success === true, "Result success flag must be true");
    assert(result.originalPageCount === 6, "Original page count must be 6");
    assert(result.extractedPageCount === 3, "Extracted page count must be 3");
    assert(JSON.stringify(result.selectedPages1Based) === JSON.stringify([1, 3, 5]), "Selected pages array mismatch");

    const reloaded = await PDFDocument.load(result.pdfBytes);
    assert(reloaded.getPageCount() === 3, "Reloaded PDF must have exactly 3 pages");

    pass("Test 7: Multi-Page Extraction Pages [1, 3, 5]");
  } catch (e) {
    console.error("Test 7 Failed:", e.message);
  }

  // Test 8: Extract Pages in Custom Order [5, 2, 4]
  try {
    const pdfBytes = await createNumberedPdf(6);
    const result = await extractPdfPages(pdfBytes, [5, 2, 4], { filename: "custom-order.pdf" });

    assert(result.success === true, "Result success flag must be true");
    assert(result.extractedPageCount === 3, "Extracted page count must be 3");
    assert(JSON.stringify(result.selectedPages1Based) === JSON.stringify([5, 2, 4]), "Sequence [5, 2, 4] must be preserved");

    const reloaded = await PDFDocument.load(result.pdfBytes);
    assert(reloaded.getPageCount() === 3, "Reloaded PDF must have 3 pages");

    pass("Test 8: Extract Pages in Custom Requested Order ([5, 2, 4])");
  } catch (e) {
    console.error("Test 8 Failed:", e.message);
  }

  // Test 9: Input Buffer Unaffected (Zero Mutation)
  try {
    const pdfBytes = await createNumberedPdf(6);
    const originalCopy = Uint8Array.from(pdfBytes);

    await extractPdfPages(pdfBytes, [1, 2]);

    assert(pdfBytes.length === originalCopy.length, "Buffer length must remain identical");
    let isEqual = true;
    for (let i = 0; i < pdfBytes.length; i += 100) {
      if (pdfBytes[i] !== originalCopy[i]) {
        isEqual = false;
        break;
      }
    }
    assert(isEqual, "Source PDF buffer must not be mutated");

    pass("Test 9: Input Buffer Immutability & Safety");
  } catch (e) {
    console.error("Test 9 Failed:", e.message);
  }

  // Test 10: Progress Callback Updates
  try {
    const pdfBytes = await createNumberedPdf(4);
    const reportedStages = [];

    await extractPdfPages(pdfBytes, [1, 2, 3], {
      onProgress: (p) => {
        reportedStages.push(p.stage);
      }
    });

    assert(reportedStages.includes("initializing"), "Must report initializing stage");
    assert(reportedStages.includes("parsing"), "Must report parsing stage");
    assert(reportedStages.includes("extracting"), "Must report extracting stage");
    assert(reportedStages.includes("assembling"), "Must report assembling stage");
    assert(reportedStages.includes("complete"), "Must report complete stage");

    pass("Test 10: Progress Callback Stage Updates");
  } catch (e) {
    console.error("Test 10 Failed:", e.message);
  }

  // Test 11: AbortSignal Cancellation
  try {
    const pdfBytes = await createNumberedPdf(4);
    const controller = new AbortController();
    controller.abort();

    let caughtError = null;
    try {
      await extractPdfPages(pdfBytes, [1, 2], { signal: controller.signal });
    } catch (err) {
      caughtError = err;
    }

    assert(caughtError !== null, "Cancellation must throw error");
    assert(caughtError instanceof ExtractPdfError, "Error must be ExtractPdfError");
    assert(caughtError.code === "CANCELLED", `Error code must be CANCELLED, got ${caughtError.code}`);

    pass("Test 11: AbortSignal Cancellation Handling");
  } catch (e) {
    console.error("Test 11 Failed:", e.message);
  }

  // Test 12: Corrupted PDF Error Handling
  try {
    const invalidBytes = new Uint8Array([0, 9, 8, 7, 6, 5]);
    let caughtError = null;
    try {
      await extractPdfPages(invalidBytes, [1]);
    } catch (err) {
      caughtError = err;
    }

    assert(caughtError !== null, "Corrupted PDF must throw error");
    assert(caughtError instanceof ExtractPdfError, "Error must be ExtractPdfError");
    assert(caughtError.code === "CORRUPTED_PDF", `Expected CORRUPTED_PDF code, got ${caughtError.code}`);

    pass("Test 12: Corrupted PDF Error Classification");
  } catch (e) {
    console.error("Test 12 Failed:", e.message);
  }

  // Test 13: Password-Protected PDF Catch
  try {
    if (fs.existsSync("scratch/test_aes256.pdf")) {
      const encryptedBytes = fs.readFileSync("scratch/test_aes256.pdf");
      let caughtError = null;
      try {
        await extractPdfPages(encryptedBytes, [1]);
      } catch (err) {
        caughtError = err;
      }

      assert(caughtError !== null, "Encrypted PDF must throw error");
      assert(caughtError instanceof ExtractPdfError, "Error must be ExtractPdfError");
      assert(caughtError.code === "PASSWORD_PROTECTED", `Expected PASSWORD_PROTECTED code, got ${caughtError.code}`);
      pass("Test 13: Password-Protected PDF Protection Catch");
    } else {
      console.log("⚠️ Skipped Test 13: scratch/test_aes256.pdf fixture not found.");
    }
  } catch (e) {
    console.error("Test 13 Failed:", e.message);
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
