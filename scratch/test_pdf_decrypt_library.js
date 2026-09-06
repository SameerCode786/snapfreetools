import fs from "fs";
import { decryptPDF, isEncrypted } from "@pdfsmaller/pdf-decrypt";
import { PDFDocument } from "pdf-lib";

async function testPdfDecryptPackage() {
  console.log("==================================================");
  console.log("TESTING @pdfsmaller/pdf-decrypt PACKAGE ON REAL TEST PDFs");
  console.log("==================================================");

  const files = [
    { name: "AES-256", path: "scratch/test_aes256.pdf", pass: "secret123" },
    { name: "AES-128", path: "scratch/test_aes128.pdf", pass: "secret123" },
    { name: "RC4 128-bit", path: "scratch/test_rc4.pdf", pass: "secret123" },
    { name: "Unprotected", path: "scratch/test_unprotected.pdf", pass: "secret123" },
    { name: "Corrupted", path: "scratch/test_corrupted.pdf", pass: "secret123" }
  ];

  for (const item of files) {
    console.log(`\n--- TESTING: ${item.name} (${item.path}) ---`);
    const buffer = fs.readFileSync(item.path);

    try {
      const encryptedStatus = await isEncrypted(buffer);
      console.log(`isEncrypted check: ${encryptedStatus}`);

      if (!encryptedStatus && item.name === "Unprotected") {
        console.log("[PASS] Unprotected PDF correctly identified as not encrypted.");
        continue;
      }

      // Test decryptPDF with CORRECT password
      const decryptedBytes = await decryptPDF(buffer, item.pass);
      console.log(`[DECRYPT SUCCESS] Output: ${decryptedBytes.length} bytes`);

      // Verify decrypted PDF opens in pdf-lib WITHOUT ignoreEncryption!
      const verifyDoc = await PDFDocument.load(decryptedBytes, { ignoreEncryption: false });
      console.log(`[VERIFICATION PASS] Decrypted PDF opens cleanly WITHOUT password! Pages: ${verifyDoc.getPageCount()}`);
      
      // Save decrypted PDF to disk for manual content inspection
      fs.writeFileSync(`scratch/unlocked_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`, decryptedBytes);
    } catch (err) {
      console.log(`[DECRYPT FAILED/HANDLED] Error: ${err.message || err}`);
    }

    // Test decryptPDF with WRONG password
    if (item.name !== "Unprotected" && item.name !== "Corrupted") {
      try {
        await decryptPDF(buffer, "wrongpassword999");
        console.log(`[WRONG PASSWORD] Unexpected success!`);
      } catch (err) {
        console.log(`[WRONG PASSWORD] Correctly threw: "${err.message || err}"`);
      }
    }
  }
}

testPdfDecryptPackage();
