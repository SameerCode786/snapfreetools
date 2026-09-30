import fs from "fs";
import { PDFDocument } from "pdf-lib";
import {
  readPdfInfo,
  redactPdf,
  getSafeRedactedFilename,
  PdfRedactError,
} from "../src/features/redact-pdf/engine/pdfRedactor.js";
import { ALL_TOOLS } from "../src/features/tools-hub/constants/allToolsRegistry.js";

console.log("=================================================");
console.log("     STARTING REDACT PDF ENGINE TEST SUITE       ");
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

// Helper to build a sample PDF with text
async function createSamplePdf(pageCount = 2) {
  const pdfDoc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.addPage([500, 700]);
    page.drawText(`CONFIDENTIAL TEXT PAGE ${i + 1}`, { x: 50, y: 650, size: 16 });
    page.drawText(`SSN: 123-45-678${i}`, { x: 50, y: 600, size: 14 });
  }
  return await pdfDoc.save();
}

async function runRedactTests() {
  // Test 1: Valid PDF info reading
  try {
    const bytes = await createSamplePdf(3);
    const info = await readPdfInfo(bytes);
    assert(info.pageCount === 3, `Expected 3 pages, got ${info.pageCount}`);
    assert(info.pages.length === 3, "Pages array length must be 3");
    assert(info.pages[0].width === 500, "Page 0 width should be 500");
    pass("Test 1: Valid PDF info reading");
  } catch (e) {
    console.error(e);
  }

  // Test 2: Single redaction box execution
  try {
    const bytes = await createSamplePdf(2);
    const redactions = [
      { pageIndex: 0, x: 50, y: 590, width: 150, height: 30, color: "#000000" },
    ];
    const res = await redactPdf(bytes, redactions);
    assert(res.success === true, "Result should indicate success");
    assert(res.redactionsAppliedCount === 1, `Expected 1 redaction applied, got ${res.redactionsAppliedCount}`);
    assert(res.pdfBytes instanceof Uint8Array, "Result must be Uint8Array");
    pass("Test 2: Single redaction box execution");
  } catch (e) {
    console.error(e);
  }

  // Test 3: Multiple redaction boxes across pages
  try {
    const bytes = await createSamplePdf(3);
    const redactions = [
      { pageIndex: 0, x: 50, y: 640, width: 200, height: 30, color: "#000000" },
      { pageIndex: 0, x: 50, y: 590, width: 150, height: 30, color: "#000000" },
      { pageIndex: 1, x: 50, y: 640, width: 200, height: 30, color: "#FFFFFF" },
    ];
    const res = await redactPdf(bytes, redactions);
    assert(res.success === true, "Result should indicate success");
    assert(res.redactionsAppliedCount === 3, `Expected 3 redactions applied, got ${res.redactionsAppliedCount}`);
    pass("Test 3: Multiple redaction boxes across pages");
  } catch (e) {
    console.error(e);
  }

  // Test 4: Reloading redacted binary in pdf-lib
  try {
    const bytes = await createSamplePdf(2);
    const redactions = [
      { pageIndex: 0, x: 50, y: 600, width: 150, height: 30, color: "#000000" },
    ];
    const res = await redactPdf(bytes, redactions);
    const reloaded = await PDFDocument.load(res.pdfBytes);
    assert(reloaded.getPageCount() === 2, "Reloaded document should maintain 2 pages");
    pass("Test 4: Reloading redacted binary validity");
  } catch (e) {
    console.error(e);
  }

  // Test 5: Original page count and dimensions preservation
  try {
    const bytes = await createSamplePdf(4);
    const redactions = [
      { pageIndex: 2, x: 50, y: 500, width: 100, height: 40, color: "#000000" },
    ];
    const res = await redactPdf(bytes, redactions);
    const reloaded = await PDFDocument.load(res.pdfBytes);
    assert(reloaded.getPageCount() === 4, "Page count must equal 4");
    const page2 = reloaded.getPage(2);
    assert(page2.getWidth() === 500, "Page width must be preserved (500)");
    assert(page2.getHeight() === 700, "Page height must be preserved (700)");
    pass("Test 5: Original page count and dimensions preservation");
  } catch (e) {
    console.error(e);
  }

  // Test 6: Password-Protected PDF Classification
  try {
    let errorCaught = false;
    try {
      const encBytes = fs.readFileSync("scratch/test_aes256.pdf");
      await readPdfInfo(encBytes);
    } catch (err) {
      errorCaught = true;
      assert(err.code === "PASSWORD_PROTECTED", `Expected PASSWORD_PROTECTED, got ${err.code}`);
    }
    assert(errorCaught, "Encrypted PDF should throw PASSWORD_PROTECTED error");
    pass("Test 6: Password-Protected PDF Classification");
  } catch (e) {
    console.error(e);
  }

  // Test 7: Corrupted PDF Classification
  try {
    let errorCaught = false;
    try {
      const corruptBytes = new Uint8Array([10, 20, 30, 40, 50]);
      await readPdfInfo(corruptBytes);
    } catch (err) {
      errorCaught = true;
      assert(err.code === "CORRUPTED_PDF", `Expected CORRUPTED_PDF, got ${err.code}`);
    }
    assert(errorCaught, "Corrupted bytes should throw CORRUPTED_PDF error");
    pass("Test 7: Corrupted PDF Classification");
  } catch (e) {
    console.error(e);
  }

  // Test 8: Safe Redacted Filename Generation
  try {
    const fn1 = getSafeRedactedFilename("Confidential Contract 2026.pdf");
    assert(fn1 === "confidential-contract-2026-redacted.pdf", `Expected safe filename, got ${fn1}`);
    const fn2 = getSafeRedactedFilename(null);
    assert(fn2 === "redacted-document.pdf", `Expected default filename, got ${fn2}`);
    pass("Test 8: Safe Redacted Filename Generation");
  } catch (e) {
    console.error(e);
  }

  // Test 9: Registry Integration Validation
  try {
    const entry = ALL_TOOLS.find((t) => t.slug === "redact-pdf");
    assert(Boolean(entry), "redact-pdf must exist in allToolsRegistry.js");
    assert(entry.status === "live", `Status must be 'live', got '${entry.status}'`);
    assert(entry.future === false, `Future must be false, got ${entry.future}`);
    assert(entry.group === "PDF Tools", "Group must be 'PDF Tools'");
    assert(entry.category === "Security & Access", "Category must be 'Security & Access'");
    pass("Test 9: Registry Integration Validation (Live & Not Future)");
  } catch (e) {
    console.error(e);
  }

  // Test 10: Live PDF Tools Count Balance
  try {
    const pdfTools = ALL_TOOLS.filter((t) => t.group === "PDF Tools");
    const livePdfTools = pdfTools.filter((t) => t.status === "live" && !t.future);
    const comingSoonPdfTools = pdfTools.filter((t) => t.status === "coming_soon");
    assert(livePdfTools.length >= 21, `Expected at least 21 live PDF tools, got ${livePdfTools.length}`);
    assert(comingSoonPdfTools.length <= 18, `Expected at most 18 coming soon PDF tools, got ${comingSoonPdfTools.length}`);
    pass("Test 10: Live PDF Tools Count Balance");
  } catch (e) {
    console.error(e);
  }

  console.log("\n=================================================");
  console.log(`  REDACT PDF TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("=================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runRedactTests().catch((err) => {
  console.error("Unhandled test runner error:", err);
  process.exit(1);
});
