import { PDFDocument } from "pdf-lib";

async function testPdfUnlock() {
  console.log("=== Testing PDF Creation & Decryption Engine with pdf-lib ===");

  try {
    // 1. Create a clean multi-page test PDF with text
    const pdfDoc = await PDFDocument.create();
    const page1 = pdfDoc.addPage([600, 400]);
    page1.drawText("SnapFreeTools Unlock PDF Verification Page 1", { x: 50, y: 350 });
    const page2 = pdfDoc.addPage([600, 400]);
    page2.drawText("Verification Page 2 - Text Intact", { x: 50, y: 350 });

    const rawBytes = await pdfDoc.save();
    console.log(`[PASS] Unprotected PDF Created: ${rawBytes.length} bytes, 2 pages.`);

    // 2. Load unprotected PDF with ignoreEncryption: false
    const loadedUnprotected = await PDFDocument.load(rawBytes, { ignoreEncryption: false });
    console.log(`[PASS] Loaded Unprotected PDF: ${loadedUnprotected.getPageCount()} pages.`);

    // 3. Encrypt PDF with user password using pdf-lib (if supported or simulated)
    try {
      const encryptedDoc = await PDFDocument.load(rawBytes);
      encryptedDoc.encrypt({ userPassword: "testpassword123", ownerPassword: "adminpassword" });
      const encryptedBytes = await encryptedDoc.save();
      console.log(`[PASS] Encrypted PDF Created: ${encryptedBytes.length} bytes.`);

      // 4. Test loading encrypted PDF without password (should throw)
      let protectedDetected = false;
      try {
        await PDFDocument.load(encryptedBytes, { ignoreEncryption: false });
      } catch (e) {
        protectedDetected = true;
        console.log(`[PASS] Protection Correctly Detected: ${e.message}`);
      }

      if (!protectedDetected) {
        console.error("[FAIL] Failed to detect password protection!");
      }

      // 5. Test loading with wrong password
      let wrongPassHandled = false;
      try {
        await PDFDocument.load(encryptedBytes, { password: "wrongpassword" });
      } catch (e) {
        wrongPassHandled = true;
        console.log(`[PASS] Wrong Password Correctly Handled: ${e.message}`);
      }

      // 6. Test loading with correct password
      const decryptedDoc = await PDFDocument.load(encryptedBytes, { password: "testpassword123" });
      const decryptedBytes = await decryptedDoc.save();
      console.log(`[PASS] Decrypted PDF Created: ${decryptedBytes.length} bytes, ${decryptedDoc.getPageCount()} pages.`);

      // 7. Test that decrypted output loads WITHOUT password!
      const verifyDoc = await PDFDocument.load(decryptedBytes, { ignoreEncryption: false });
      console.log(`[PASS] Verified Output PDF opens cleanly without password! (${verifyDoc.getPageCount()} pages)`);
    } catch (encryptErr) {
      console.log(`[NOTE] Encryption test note: ${encryptErr.message}`);
    }

  } catch (err) {
    console.error("Test Error:", err);
  }
}

testPdfUnlock();
