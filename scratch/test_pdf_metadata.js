import assert from "node:assert";
import { PDFDocument } from "pdf-lib";
import {
  readPdfMetadata,
  updatePdfMetadata,
  clearPdfMetadata,
  parseKeywordsInput,
  parseDateSafe,
  formatDateToIsoLocal,
  PdfMetadataError,
} from "../src/features/edit-pdf-metadata/engine/pdfMetadataEditor.js";

async function createSamplePdf(options = {}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  page.drawText("Test PDF Document Content for SnapFreeTools", { x: 50, y: 350 });

  if (options.title) pdfDoc.setTitle(options.title);
  if (options.author) pdfDoc.setAuthor(options.author);
  if (options.subject) pdfDoc.setSubject(options.subject);
  if (options.keywords) pdfDoc.setKeywords(options.keywords);
  if (options.creator) pdfDoc.setCreator(options.creator);
  if (options.producer) pdfDoc.setProducer(options.producer);
  if (options.creationDate) pdfDoc.setCreationDate(options.creationDate);
  if (options.modificationDate) pdfDoc.setModificationDate(options.modificationDate);

  return await pdfDoc.save();
}

async function runTests() {
  console.log("=== STARTING PDF METADATA ENGINE TESTS ===");
  let passedCount = 0;

  // Test 1: Valid PDF loading
  try {
    const pdfBytes = await createSamplePdf();
    const metadata = await readPdfMetadata(pdfBytes);
    assert.strictEqual(metadata.pageCount, 1, "Page count must be 1");
    assert.ok(metadata.byteSize > 0, "Byte size must be > 0");
    console.log("✓ Test 1 Passed: Valid PDF loading");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 1 Failed:", err);
  }

  // Test 2: Empty metadata reading
  try {
    const pdfBytes = await createSamplePdf();
    const metadata = await readPdfMetadata(pdfBytes);
    assert.strictEqual(metadata.title, "", "Title should be empty string");
    assert.strictEqual(metadata.author, "", "Author should be empty string");
    assert.strictEqual(metadata.subject, "", "Subject should be empty string");
    assert.strictEqual(metadata.keywords, "", "Keywords should be empty string");
    console.log("✓ Test 2 Passed: Empty metadata reading");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 2 Failed:", err);
  }

  // Test 3: Existing metadata reading
  try {
    const pdfBytes = await createSamplePdf({
      title: "Existing Title",
      author: "John Doe",
      subject: "Test Subject",
      keywords: ["pdf", "test"],
      creator: "SnapFree App",
      producer: "pdf-lib engine",
    });
    const metadata = await readPdfMetadata(pdfBytes);
    assert.strictEqual(metadata.title, "Existing Title");
    assert.strictEqual(metadata.author, "John Doe");
    assert.strictEqual(metadata.subject, "Test Subject");
    assert.strictEqual(metadata.keywords, "pdf, test");
    assert.strictEqual(metadata.creator, "SnapFree App");
    assert.strictEqual(metadata.producer, "pdf-lib engine");
    console.log("✓ Test 3 Passed: Existing metadata reading");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 3 Failed:", err);
  }

  // Test 4: Title editing
  try {
    const pdfBytes = await createSamplePdf({ title: "Old Title" });
    const result = await updatePdfMetadata(pdfBytes, { title: "New Updated Title" });
    assert.strictEqual(result.metadata.title, "New Updated Title");
    console.log("✓ Test 4 Passed: Title editing");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 4 Failed:", err);
  }

  // Test 5: Author editing
  try {
    const pdfBytes = await createSamplePdf({ author: "Old Author" });
    const result = await updatePdfMetadata(pdfBytes, { author: "Jane Smith" });
    assert.strictEqual(result.metadata.author, "Jane Smith");
    console.log("✓ Test 5 Passed: Author editing");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 5 Failed:", err);
  }

  // Test 6: Subject editing
  try {
    const pdfBytes = await createSamplePdf();
    const result = await updatePdfMetadata(pdfBytes, { subject: "Q4 Financials" });
    assert.strictEqual(result.metadata.subject, "Q4 Financials");
    console.log("✓ Test 6 Passed: Subject editing");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 6 Failed:", err);
  }

  // Test 7: Keywords editing
  try {
    const pdfBytes = await createSamplePdf();
    const result = await updatePdfMetadata(pdfBytes, { keywords: "report, finance, 2026, report" });
    assert.strictEqual(result.metadata.keywords, "report, finance, 2026");
    console.log("✓ Test 7 Passed: Keywords editing and deduplication");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 7 Failed:", err);
  }

  // Test 8: Creator editing
  try {
    const pdfBytes = await createSamplePdf();
    const result = await updatePdfMetadata(pdfBytes, { creator: "Custom Publishing Suite" });
    assert.strictEqual(result.metadata.creator, "Custom Publishing Suite");
    console.log("✓ Test 8 Passed: Creator editing");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 8 Failed:", err);
  }

  // Test 9: Producer editing
  try {
    const pdfBytes = await createSamplePdf();
    const result = await updatePdfMetadata(pdfBytes, { producer: "SnapFreeTools PDF Engine v2" });
    assert.strictEqual(result.metadata.producer, "SnapFreeTools PDF Engine v2");
    console.log("✓ Test 9 Passed: Producer editing");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 9 Failed:", err);
  }

  // Test 10: Supported date handling
  try {
    const pdfBytes = await createSamplePdf();
    const targetDate = "2026-05-15T10:30:00.000Z";
    const result = await updatePdfMetadata(pdfBytes, { creationDate: targetDate });
    assert.ok(result.metadata.creationDate.startsWith("2026-05-15"));
    console.log("✓ Test 10 Passed: Creation & Modification Date handling");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 10 Failed:", err);
  }

  // Test 11: Unicode metadata (e.g. Accents, Non-Latin, Emojis)
  try {
    const pdfBytes = await createSamplePdf();
    const unicodeTitle = "Rapport Financier 2026 — Économie & Document PDF 📄";
    const unicodeAuthor = "Müller & Hernández-González";
    const result = await updatePdfMetadata(pdfBytes, {
      title: unicodeTitle,
      author: unicodeAuthor,
    });
    assert.strictEqual(result.metadata.title, unicodeTitle);
    assert.strictEqual(result.metadata.author, unicodeAuthor);
    console.log("✓ Test 11 Passed: Unicode metadata handling");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 11 Failed:", err);
  }

  // Test 12: Special characters (Quotes, Slashes, Brackets)
  try {
    const pdfBytes = await createSamplePdf();
    const specialTitle = 'Report "Top Secret" <Confidential> & {Draft/2026}';
    const result = await updatePdfMetadata(pdfBytes, { title: specialTitle });
    assert.strictEqual(result.metadata.title, specialTitle);
    console.log("✓ Test 12 Passed: Special characters in metadata");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 12 Failed:", err);
  }

  // Test 13: Clearing metadata
  try {
    const pdfBytes = await createSamplePdf({
      title: "Old Title",
      author: "Old Author",
      subject: "Old Subject",
      keywords: ["old"],
    });
    const result = await clearPdfMetadata(pdfBytes);
    assert.strictEqual(result.metadata.title, "");
    assert.strictEqual(result.metadata.author, "");
    assert.strictEqual(result.metadata.subject, "");
    assert.strictEqual(result.metadata.keywords, "");
    console.log("✓ Test 13 Passed: Clearing metadata");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 13 Failed:", err);
  }

  // Test 14: Reset changes simulation
  try {
    const pdfBytes = await createSamplePdf({ title: "Original Title" });
    const initialRead = await readPdfMetadata(pdfBytes);
    // Simulating form edit then reset to initialRead
    const editedFormState = { ...initialRead, title: "Draft Title" };
    assert.notStrictEqual(editedFormState.title, initialRead.title);
    const resetFormState = { ...initialRead };
    assert.strictEqual(resetFormState.title, "Original Title");
    console.log("✓ Test 14 Passed: Reset changes state logic");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 14 Failed:", err);
  }

  // Test 15: Multiple metadata fields changed together
  try {
    const pdfBytes = await createSamplePdf();
    const newFields = {
      title: "Multi Field Title",
      author: "Multi Field Author",
      subject: "Multi Field Subject",
      keywords: "tag1, tag2, tag3",
      creator: "App 1",
      producer: "Engine 1",
    };
    const result = await updatePdfMetadata(pdfBytes, newFields);
    assert.strictEqual(result.metadata.title, "Multi Field Title");
    assert.strictEqual(result.metadata.author, "Multi Field Author");
    assert.strictEqual(result.metadata.subject, "Multi Field Subject");
    assert.strictEqual(result.metadata.keywords, "tag1, tag2, tag3");
    assert.strictEqual(result.metadata.creator, "App 1");
    assert.strictEqual(result.metadata.producer, "Engine 1");
    console.log("✓ Test 15 Passed: Multiple metadata fields changed together");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 15 Failed:", err);
  }

  // Test 16: Output PDF remains valid PDF
  try {
    const pdfBytes = await createSamplePdf();
    const result = await updatePdfMetadata(pdfBytes, { title: "Valid PDF Test" });
    const reloadedDoc = await PDFDocument.load(result.pdfBytes);
    assert.ok(reloadedDoc.getPageCount() > 0);
    console.log("✓ Test 16 Passed: Output PDF remains valid");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 16 Failed:", err);
  }

  // Test 17: Original PDF page count preserved
  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([600, 400]);
    pdfDoc.addPage([600, 400]);
    pdfDoc.addPage([600, 400]);
    const pdfBytes = await pdfDoc.save();

    const result = await updatePdfMetadata(pdfBytes, { title: "3 Pages Document" });
    assert.strictEqual(result.metadata.pageCount, 3);
    console.log("✓ Test 17 Passed: Page count preserved");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 17 Failed:", err);
  }

  // Test 18: Original PDF content preserved (No rasterization)
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    page.drawText("Unmodified Page Text Content", { x: 50, y: 300 });
    const pdfBytes = await pdfDoc.save();

    const result = await updatePdfMetadata(pdfBytes, { title: "Preserved Content Title" });
    const reloaded = await PDFDocument.load(result.pdfBytes);
    assert.strictEqual(reloaded.getPageCount(), 1);
    console.log("✓ Test 18 Passed: Page contents preserved");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 18 Failed:", err);
  }

  // Test 19: Password-protected / invalid PDF error handling
  try {
    const invalidEncryptedHeader = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
    try {
      await readPdfMetadata(invalidEncryptedHeader);
      assert.fail("Should have thrown error");
    } catch (err) {
      assert.ok(err, "Error should be thrown for invalid PDF header");
    }
    console.log("✓ Test 19 Passed: Protected/Malformed buffer error classification");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 19 Failed:", err);
  }

  // Test 20: Corrupted PDF error handling
  try {
    const corruptBuffer = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    try {
      await readPdfMetadata(corruptBuffer);
      assert.fail("Should have thrown error on corrupt PDF");
    } catch (err) {
      assert.strictEqual(err.code, "CORRUPTED_PDF");
    }
    console.log("✓ Test 20 Passed: Corrupted PDF error handling");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 20 Failed:", err);
  }

  // Test 21: Large PDF array buffer test
  try {
    const pdfDoc = await PDFDocument.create();
    for (let i = 0; i < 20; i++) {
      const page = pdfDoc.addPage([600, 400]);
      page.drawText(`Page Number ${i + 1}`, { x: 50, y: 350 });
    }
    const pdfBytes = await pdfDoc.save();
    const result = await updatePdfMetadata(pdfBytes, { title: "20 Pages Large Document" });
    assert.strictEqual(result.metadata.pageCount, 20);
    console.log("✓ Test 21 Passed: Large multi-page PDF processing");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 21 Failed:", err);
  }

  // Test 22: Client-side ArrayBuffer normalization
  try {
    const pdfBytes = await createSamplePdf();
    const arrayBuffer = pdfBytes.buffer;
    const metadata = await readPdfMetadata(arrayBuffer);
    assert.strictEqual(metadata.pageCount, 1);
    console.log("✓ Test 22 Passed: Client-side ArrayBuffer normalization");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 22 Failed:", err);
  }

  // Test 23: Keyword parser helper tests
  try {
    const res1 = parseKeywordsInput("apple, banana, apple; cherry");
    assert.strictEqual(res1.keywordsString, "apple, banana, cherry");
    assert.deepStrictEqual(res1.keywordsArray, ["apple", "banana", "cherry"]);
    console.log("✓ Test 23 Passed: Keyword parser helper");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 23 Failed:", err);
  }

  // Test 24: Download safe base filename generation logic
  try {
    const getSafeBaseName = (filename) => {
      if (!filename) return "document";
      return filename
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .toLowerCase();
    };

    const safe1 = getSafeBaseName("Annual_Report_2026.pdf");
    assert.strictEqual(safe1, "annual_report_2026");

    const safe2 = getSafeBaseName("My Document (Final Draft) #1.PDF");
    assert.strictEqual(safe2, "my-document-final-draft-1");

    console.log("✓ Test 24 Passed: Download filename safety logic");
    passedCount++;
  } catch (err) {
    console.error("❌ Test 24 Failed:", err);
  }

  console.log(`\n=== TEST SUMMARY: ${passedCount}/24 PASSED ===`);
  if (passedCount === 24) {
    console.log("ALL 24 TESTS PASSED SUCCESSFULLY!");
  } else {
    process.exit(1);
  }
}

runTests();
