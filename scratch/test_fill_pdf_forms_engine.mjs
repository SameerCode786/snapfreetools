import fs from "fs";
import { PDFDocument } from "pdf-lib";
import {
  readPdfFormInfo,
  fillPdfForms,
  getSafeFilledFilename,
  PdfFormFillError,
} from "../src/features/fill-pdf-forms/engine/pdfFormFiller.js";
import { ALL_TOOLS } from "../src/features/tools-hub/constants/allToolsRegistry.js";

console.log("=================================================");
console.log("   STARTING FILL PDF FORMS ENGINE TEST SUITE     ");
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

// Helper to build a sample PDF with AcroForm fields
async function createSamplePdf(withFields = true) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  if (withFields) {
    const form = pdfDoc.getForm();

    const tf = form.createTextField("applicant.fullName");
    tf.setText("Alice Smith");
    tf.addToPage(page, { x: 50, y: 700, width: 200, height: 30 });

    const cb = form.createCheckBox("applicant.agreedTerms");
    cb.check();
    cb.addToPage(page, { x: 50, y: 650, width: 20, height: 20 });

    const dd = form.createDropdown("applicant.country");
    dd.setOptions(["USA", "Canada", "UK"]);
    dd.select("Canada");
    dd.addToPage(page, { x: 50, y: 600, width: 150, height: 30 });

    const rg = form.createRadioGroup("applicant.gender");
    rg.addOptionToPage("Male", page, { x: 50, y: 550, width: 20, height: 20 });
    rg.addOptionToPage("Female", page, { x: 120, y: 550, width: 20, height: 20 });
    rg.select("Female");
  } else {
    page.drawText("Flat Non-Interactive PDF Content", { x: 50, y: 700 });
  }

  return await pdfDoc.save();
}

async function runFillTests() {
  // Test 1: Valid PDF form info reading (With fields)
  try {
    const bytes = await createSamplePdf(true);
    const info = await readPdfFormInfo(bytes);
    assert(info.pageCount === 1, `Expected 1 page, got ${info.pageCount}`);
    assert(info.fieldCount === 4, `Expected 4 fields, got ${info.fieldCount}`);
    assert(info.hasFormFields === true, "hasFormFields should be true");
    pass("Test 1: Valid PDF form info reading (With fields)");
  } catch (e) {
    console.error(e);
  }

  // Test 2: Form info reading (Non-interactive PDF)
  try {
    const bytes = await createSamplePdf(false);
    const info = await readPdfFormInfo(bytes);
    assert(info.fieldCount === 0, `Expected 0 fields, got ${info.fieldCount}`);
    assert(info.hasFormFields === false, "hasFormFields should be false");
    pass("Test 2: Form info reading (Non-interactive PDF)");
  } catch (e) {
    console.error(e);
  }

  // Test 3: Programmatic form field filling (Text, Checkbox, Dropdown, Radio)
  try {
    const bytes = await createSamplePdf(true);
    const newValues = {
      "applicant.fullName": "Robert Johnson",
      "applicant.agreedTerms": false,
      "applicant.country": "UK",
      "applicant.gender": "Male",
    };
    const res = await fillPdfForms(bytes, newValues);
    assert(res.success === true, "Result should indicate success");
    assert(res.fieldsFilledCount === 4, `Expected 4 fields filled, got ${res.fieldsFilledCount}`);
    assert(res.pdfBytes instanceof Uint8Array, "Result must be Uint8Array");
    pass("Test 3: Programmatic form field filling");
  } catch (e) {
    console.error(e);
  }

  // Test 4: Reloading filled binary in pdf-lib and verifying field values
  try {
    const bytes = await createSamplePdf(true);
    const newValues = {
      "applicant.fullName": "Emma Watson",
      "applicant.agreedTerms": true,
      "applicant.country": "USA",
    };
    const res = await fillPdfForms(bytes, newValues);
    const reloaded = await PDFDocument.load(res.pdfBytes);
    const form = reloaded.getForm();
    assert(form.getTextField("applicant.fullName").getText() === "Emma Watson", "Text field should match 'Emma Watson'");
    assert(form.getCheckBox("applicant.agreedTerms").isChecked() === true, "Checkbox should be checked");
    assert(form.getDropdown("applicant.country").getSelected()[0] === "USA", "Dropdown should equal 'USA'");
    pass("Test 4: Value persistence on reloaded binary");
  } catch (e) {
    console.error(e);
  }

  // Test 5: Original page count and dimensions preservation
  try {
    const bytes = await createSamplePdf(true);
    const res = await fillPdfForms(bytes, { "applicant.fullName": "Preserve Test" });
    const reloaded = await PDFDocument.load(res.pdfBytes);
    assert(reloaded.getPageCount() === 1, "Page count must equal 1");
    const page0 = reloaded.getPage(0);
    assert(page0.getWidth() === 600, "Page width must be preserved (600)");
    assert(page0.getHeight() === 800, "Page height must be preserved (800)");
    pass("Test 5: Original page count and dimensions preservation");
  } catch (e) {
    console.error(e);
  }

  // Test 6: Password-Protected PDF Classification
  try {
    let errorCaught = false;
    try {
      const encBytes = fs.readFileSync("scratch/test_aes256.pdf");
      await readPdfFormInfo(encBytes);
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
      await readPdfFormInfo(corruptBytes);
    } catch (err) {
      errorCaught = true;
      assert(err.code === "CORRUPTED_PDF", `Expected CORRUPTED_PDF, got ${err.code}`);
    }
    assert(errorCaught, "Corrupted bytes should throw CORRUPTED_PDF error");
    pass("Test 7: Corrupted PDF Classification");
  } catch (e) {
    console.error(e);
  }

  // Test 8: Safe Filled Filename Generation
  try {
    const fn1 = getSafeFilledFilename("Job Application (2026).pdf");
    assert(fn1 === "job-application-2026-filled.pdf", `Expected safe filename, got ${fn1}`);
    const fn2 = getSafeFilledFilename(null);
    assert(fn2 === "filled-form.pdf", `Expected default filename, got ${fn2}`);
    pass("Test 8: Safe Filled Filename Generation");
  } catch (e) {
    console.error(e);
  }

  // Test 9: Registry Integration Validation
  try {
    const entry = ALL_TOOLS.find((t) => t.slug === "fill-pdf-forms");
    assert(Boolean(entry), "fill-pdf-forms must exist in allToolsRegistry.js");
    assert(entry.status === "live", `Status must be 'live', got '${entry.status}'`);
    assert(entry.future === false, `Future must be false, got ${entry.future}`);
    assert(entry.group === "PDF Tools", "Group must be 'PDF Tools'");
    assert(entry.category === "Edit & Annotate", "Category must be 'Edit & Annotate'");
    pass("Test 9: Registry Integration Validation (Live & Not Future)");
  } catch (e) {
    console.error(e);
  }

  // Test 10: Live PDF Tools Count Balance (22 Live, 17 Coming Soon)
  try {
    const pdfTools = ALL_TOOLS.filter((t) => t.group === "PDF Tools");
    const livePdfTools = pdfTools.filter((t) => t.status === "live" && !t.future);
    const comingSoonPdfTools = pdfTools.filter((t) => t.status === "coming_soon");
    assert(livePdfTools.length === 22, `Expected 22 live PDF tools, got ${livePdfTools.length}`);
    assert(comingSoonPdfTools.length === 17, `Expected 17 coming soon PDF tools, got ${comingSoonPdfTools.length}`);
    pass("Test 10: Live PDF Tools Count Balance (22 Live, 17 Coming Soon)");
  } catch (e) {
    console.error(e);
  }

  console.log("\n=================================================");
  console.log(`  FILL PDF FORMS TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("=================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runFillTests().catch((err) => {
  console.error("Unhandled test runner error:", err);
  process.exit(1);
});
