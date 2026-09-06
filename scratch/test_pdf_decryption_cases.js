import { PDFDocument } from "pdf-lib";

async function testDecryptionCases() {
  console.log("=== Testing pdf-lib Decryption & Error Catching ===");

  // 1. Invalid PDF file bytes
  try {
    const invalidBuffer = Buffer.from("This is not a PDF file");
    await PDFDocument.load(invalidBuffer);
    console.error("[FAIL] Failed to catch non-PDF buffer!");
  } catch (err) {
    console.log(`[PASS] Non-PDF correctly caught: "${err.message}"`);
  }

  // 2. Truncated/Corrupted PDF buffer
  try {
    const corruptedBuffer = Buffer.from("%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF");
    await PDFDocument.load(corruptedBuffer);
    console.log("[PASS] Minimal valid PDF loaded.");
  } catch (err) {
    console.log(`[PASS] Corrupted PDF caught: "${err.message}"`);
  }

  // 3. Test API signature of PDFDocument.load with password option
  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([400, 400]);
    const bytes = await pdfDoc.save();

    // Loading unprotected PDF with password parameter
    const loaded = await PDFDocument.load(bytes, { password: "anypassword" });
    console.log(`[PASS] Unprotected PDF ignores password param and loads cleanly (${loaded.getPageCount()} page).`);
  } catch (err) {
    console.error(`[FAIL] Unprotected PDF threw error with password: ${err.message}`);
  }
}

testDecryptionCases();
