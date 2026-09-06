import fs from "fs";
import { PDFDocument } from "pdf-lib";

async function auditEngine() {
  console.log("==================================================");
  console.log("AUDITING pdf-lib DECRYPTION CAPABILITIES ON REAL TEST PDFs");
  console.log("==================================================");

  const files = [
    { path: "scratch/test_unprotected.pdf", type: "Unprotected" },
    { path: "scratch/test_rc4.pdf", type: "RC4 128-bit", correctPass: "secret123" },
    { path: "scratch/test_aes128.pdf", type: "AES-128", correctPass: "secret123" },
    { path: "scratch/test_aes256.pdf", type: "AES-256 (Revision 6)", correctPass: "secret123" },
    { path: "scratch/test_corrupted.pdf", type: "Corrupted" }
  ];

  for (const item of files) {
    console.log(`\n--- TESTING FILE: ${item.path} (${item.type}) ---`);
    const buffer = fs.readFileSync(item.path);

    // Test 1: Load without password parameter
    try {
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: false });
      console.log(`[NO PASSWORD PARAM] Result: SUCCESS (Unprotected) | Pages: ${doc.getPageCount()}`);
    } catch (err) {
      console.log(`[NO PASSWORD PARAM] Result: THREW ERROR | Name: ${err.name} | Message: "${err.message}"`);
    }

    // Test 2: Load with CORRECT password (if encrypted)
    if (item.correctPass) {
      try {
        const docPass = await PDFDocument.load(buffer, { password: item.correctPass });
        const savedBytes = await docPass.save();
        
        // Verify decrypted output opens WITHOUT password!
        const verifyDoc = await PDFDocument.load(savedBytes, { ignoreEncryption: false });
        console.log(`[CORRECT PASSWORD: '${item.correctPass}'] Result: SUCCESS DECRYPTED! Output: ${savedBytes.length} bytes, ${verifyDoc.getPageCount()} pages.`);
      } catch (err) {
        console.log(`[CORRECT PASSWORD: '${item.correctPass}'] Result: FAILED TO DECRYPT! | Name: ${err.name} | Message: "${err.message}"`);
      }

      // Test 3: Load with WRONG password
      try {
        const docWrong = await PDFDocument.load(buffer, { password: "wrongpassword999" });
        console.log(`[WRONG PASSWORD: 'wrongpassword999'] Result: UNEXPECTED SUCCESS!`);
      } catch (err) {
        console.log(`[WRONG PASSWORD: 'wrongpassword999'] Result: THREW ERROR | Name: ${err.name} | Message: "${err.message}"`);
      }
    }
  }
}

auditEngine();
