import fs from "fs";
import { PDFDocument } from "pdf-lib";
import {
  readPdfInfo,
  flattenPdf,
  getSafeFlattenedFilename,
  PdfFlattenError,
} from "../src/features/flatten-pdf/engine/pdfFlattener.js";
import { ALL_TOOLS } from "../src/features/tools-hub/constants/allToolsRegistry.js";

console.log("=================================================");
console.log("    STARTING FLATTEN PDF ENGINE TEST SUITE       ");
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

// Helper to build a sample PDF with pages & text
async function createSamplePdf(pageCount = 2, withFormFields = false) {
  const pdfDoc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.addPage([500, 700]);
    page.drawText(`Sample Flatten PDF Page ${i + 1}`, { x: 50, y: 650 });
  }

  if (withFormFields) {
    const form = pdfDoc.getForm();
    const textField = form.createTextField("user.fullName");
    textField.setText("Jane Doe");
    textField.addToPage(pdfDoc.getPage(0), { x: 50, y: 500, width: 200, height: 30 });

    const checkBox = form.createCheckBox("user.agreedTerms");
    checkBox.check();
    checkBox.addToPage(pdfDoc.getPage(0), { x: 50, y: 450, width: 20, height: 20 });
  }

  return await pdfDoc.save();
}

async function runFlattenTests() {
  // Test 1: Valid PDF loading & info reading without form fields
  try {
    const bytes = await createSamplePdf(3, false);
    const info = await readPdfInfo(bytes);
    assert(info.pageCount === 3, `Expected 3 pages, got ${info.pageCount}`);
    assert(info.fieldCount === 0, `Expected 0 fields, got ${info.fieldCount}`);
    assert(info.formHasFields === false, "formHasFields should be false");
    pass("Test 1: Valid PDF info reading (No fields)");
  } catch (e) {
    console.error(e);
  }

  // Test 2: PDF info reading with form fields
  try {
    const bytes = await createSamplePdf(2, true);
    const info = await readPdfInfo(bytes);
    assert(info.pageCount === 2, `Expected 2 pages, got ${info.pageCount}`);
    assert(info.fieldCount === 2, `Expected 2 form fields, got ${info.fieldCount}`);
    assert(info.formHasFields === true, "formHasFields should be true");
    pass("Test 2: Valid PDF info reading (With form fields)");
  } catch (e) {
    console.error(e);
  }

  // Test 3: Flatten PDF form fields execution
  try {
    const bytes = await createSamplePdf(2, true);
    const res = await flattenPdf(bytes);
    assert(res.success === true, "Result should indicate success");
    assert(res.initialFieldsCount === 2, `Expected 2 initial fields, got ${res.initialFieldsCount}`);
    assert(res.finalFieldsCount === 0, `Expected 0 final fields after flatten, got ${res.finalFieldsCount}`);
    assert(res.fieldsFlattenedCount === 2, `Expected 2 fields flattened, got ${res.fieldsFlattenedCount}`);
    assert(res.pdfBytes instanceof Uint8Array, "Result must be Uint8Array");
    pass("Test 3: Flatten PDF form fields execution");
  } catch (e) {
    console.error(e);
  }

  // Test 4: Reloading flattened binary in pdf-lib
  try {
    const bytes = await createSamplePdf(2, true);
    const res = await flattenPdf(bytes);
    const reloaded = await PDFDocument.load(res.pdfBytes);
    assert(reloaded.getPageCount() === 2, "Reloaded document should maintain 2 pages");
    assert(reloaded.getForm().getFields().length === 0, "Reloaded document should have 0 form fields");
    pass("Test 4: Reloading flattened binary validity");
  } catch (e) {
    console.error(e);
  }

  // Test 5: Original PDF page count & content geometry preservation
  try {
    const bytes = await createSamplePdf(4, true);
    const res = await flattenPdf(bytes);
    const reloaded = await PDFDocument.load(res.pdfBytes);
    assert(reloaded.getPageCount() === 4, "Page count must equal 4");
    const page0 = reloaded.getPage(0);
    assert(page0.getWidth() === 500, "Page width must be preserved (500)");
    assert(page0.getHeight() === 700, "Page height must be preserved (700)");
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

  // Test 8: Safe Filename Generation
  try {
    const fn1 = getSafeFlattenedFilename("My Invoice (2026) Final.pdf");
    assert(fn1 === "my-invoice-2026-final-flattened.pdf", `Expected safe filename, got ${fn1}`);
    const fn2 = getSafeFlattenedFilename(null);
    assert(fn2 === "flattened-document.pdf", `Expected default filename, got ${fn2}`);
    pass("Test 8: Safe Filename Generation");
  } catch (e) {
    console.error(e);
  }

  // Test 9: Registry Integration Validation
  try {
    const flattenEntry = ALL_TOOLS.find((t) => t.slug === "flatten-pdf");
    assert(Boolean(flattenEntry), "flatten-pdf must exist in allToolsRegistry.js");
    assert(flattenEntry.status === "live", `Status must be 'live', got '${flattenEntry.status}'`);
    assert(flattenEntry.future === false, `Future must be false, got ${flattenEntry.future}`);
    assert(flattenEntry.group === "PDF Tools", "Group must be 'PDF Tools'");
    assert(flattenEntry.category === "PDF Utilities", "Category must be 'PDF Utilities'");
    pass("Test 9: Registry Integration Validation (Live & Not Future)");
  } catch (e) {
    console.error(e);
  }

  // Test 10: Live PDF Tools Counts & Coming Soon Balance
  try {
    const pdfTools = ALL_TOOLS.filter((t) => t.group === "PDF Tools");
    const livePdfTools = pdfTools.filter((t) => t.status === "live" && !t.future);
    const comingSoonPdfTools = pdfTools.filter((t) => t.status === "coming_soon");
    assert(livePdfTools.length >= 20, `Expected at least 20 live PDF tools, got ${livePdfTools.length}`);
    assert(comingSoonPdfTools.length <= 19, `Expected at most 19 coming soon PDF tools, got ${comingSoonPdfTools.length}`);
    pass("Test 10: Live PDF Tools Count Balance");
  } catch (e) {
    console.error(e);
  }

  console.log("\n=================================================");
  console.log(`  FLATTEN PDF TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("=================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runFlattenTests().catch((err) => {
  console.error("Unhandled test runner error:", err);
  process.exit(1);
});
