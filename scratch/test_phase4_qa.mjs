import { extractPdfPages, parsePageSelection, readPdfInfo } from "../src/features/extract-pdf-pages/engine/extractPdfEngine.js";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

async function createSamplePdf(pageCount) {
  const pdfDoc = await PDFDocument.create();
  for (let i = 1; i <= pageCount; i++) {
    const page = pdfDoc.addPage([400, 600]);
    page.drawText(`Sample Document Page ${i}`, { x: 50, y: 500, size: 20 });
  }
  return await pdfDoc.save();
}

async function runPhase4QA() {
  console.log("=================================================");
  console.log("   STARTING PHASE 4 END-TO-END REAL PDF QA      ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, message = "") {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} - ${message}`);
      failed++;
    }
  }

  try {
    // 1. Create test PDFs of varying sizes
    const pdf1Page = await createSamplePdf(1);
    const pdf5Page = await createSamplePdf(5);
    const pdf18Page = await createSamplePdf(18);

    // Test A: 1-Page PDF extraction
    const res1 = await extractPdfPages(pdf1Page, [1], { filename: "test1.pdf" });
    const docOut1 = await PDFDocument.load(res1.pdfBytes);
    assert(docOut1.getPageCount() === 1, "QA 1: 1-Page PDF Extraction", `Expected 1 page, got ${docOut1.getPageCount()}`);

    // Test B: Single Page Selection from Multi-Page PDF (Page 2)
    const resSinglePage = await extractPdfPages(pdf5Page, [2], { filename: "single.pdf" });
    const docOutSingle = await PDFDocument.load(resSinglePage.pdfBytes);
    assert(docOutSingle.getPageCount() === 1, "QA 2: Extract Single Page 2 from 5-Page PDF", `Expected 1 page, got ${docOutSingle.getPageCount()}`);

    // Test C: Non-consecutive Page Selection [1, 3, 5]
    const resNonConsecutive = await extractPdfPages(pdf5Page, [1, 3, 5], { filename: "non-consecutive.pdf" });
    const docOutNC = await PDFDocument.load(resNonConsecutive.pdfBytes);
    assert(docOutNC.getPageCount() === 3, "QA 3: Extract Pages [1, 3, 5]", `Expected 3 pages, got ${docOutNC.getPageCount()}`);
    assert(resNonConsecutive.selectedPages1Based.join(",") === "1,3,5", "QA 4: Extracted Page Sequence Match [1, 3, 5]");

    // Test D: Custom Order Extraction [5, 2, 4]
    const resCustomOrder = await extractPdfPages(pdf5Page, [5, 2, 4], { filename: "custom-order.pdf" });
    const docOutCustom = await PDFDocument.load(resCustomOrder.pdfBytes);
    assert(docOutCustom.getPageCount() === 3, "QA 5: Custom Order [5, 2, 4] Page Count", `Expected 3 pages, got ${docOutCustom.getPageCount()}`);
    assert(resCustomOrder.selectedPages1Based.join(",") === "5,2,4", "QA 6: Custom Order [5, 2, 4] Sequence Preserved");

    // Test E: Range String Selection '1-3, 5, 8' on 18-page PDF
    const parsedRange = parsePageSelection("1-3, 5, 8", 18);
    const resRange = await extractPdfPages(pdf18Page, parsedRange.pages1Based, { filename: "range.pdf" });
    const docOutRange = await PDFDocument.load(resRange.pdfBytes);
    assert(docOutRange.getPageCount() === 5, "QA 7: Range '1-3, 5, 8' Output Page Count (5 pages)", `Expected 5 pages, got ${docOutRange.getPageCount()}`);
    assert(resRange.selectedPages1Based.join(",") === "1,2,3,5,8", "QA 8: Range Output Sequence Match '1, 2, 3, 5, 8'");

    // Test F: Download Re-open & Non-corruption Validation
    assert(resRange.pdfBytes instanceof Uint8Array && resRange.pdfBytes.length > 0, "QA 9: Downloadable Uint8Array PDF Bytes Generated");
    assert(resRange.outputSize > 0, "QA 10: Output Size Is Non-Zero");

    // Test G: Out-of-bounds error handling
    let errorCaught = false;
    try {
      parsePageSelection("1-25", 18);
    } catch (err) {
      errorCaught = err.code === "OUT_OF_RANGE";
    }
    assert(errorCaught, "QA 11: Out-of-Bounds Range Handled Safely (OUT_OF_RANGE)");

    // Test H: Invalid Range Syntax Error
    let syntaxErrorCaught = false;
    try {
      parsePageSelection("5-2", 18);
    } catch (err) {
      syntaxErrorCaught = err.code === "INVALID_SELECTION";
    }
    assert(syntaxErrorCaught, "QA 12: Reverse Range Direction Handled Safely (INVALID_SELECTION)");

  } catch (globalErr) {
    console.error("Global QA error:", globalErr);
    failed++;
  }

  console.log("\n=================================================");
  console.log(`PHASE 4 REAL PDF QA SUITE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase4QA();
