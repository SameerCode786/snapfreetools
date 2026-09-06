import fs from "fs";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

async function testPdfJs() {
  console.log("==================================================");
  console.log("AUDITING pdfjs-dist DECRYPTION CAPABILITIES ON REAL TEST PDFs (disableWorker: true)");
  console.log("==================================================");

  const files = [
    { path: "scratch/test_unprotected.pdf", type: "Unprotected" },
    { path: "scratch/test_rc4.pdf", type: "RC4 128-bit", correctPass: "secret123" },
    { path: "scratch/test_aes128.pdf", type: "AES-128", correctPass: "secret123" },
    { path: "scratch/test_aes256.pdf", type: "AES-256 (Revision 6)", correctPass: "secret123" },
    { path: "scratch/test_corrupted.pdf", type: "Corrupted" }
  ];

  for (const item of files) {
    console.log(`\n--- TESTING FILE WITH pdfjs-dist: ${item.path} (${item.type}) ---`);
    const buffer = fs.readFileSync(item.path);
    const data = new Uint8Array(buffer);

    // 1. Loading without password
    try {
      const doc = await pdfjs.getDocument({ data: data.slice(0), disableWorker: true }).promise;
      console.log(`[NO PASSWORD] Result: SUCCESS (Unprotected) | Pages: ${doc.numPages}`);
    } catch (err) {
      console.log(`[NO PASSWORD] Result: THREW ERROR | Name: ${err.name} | Code: ${err.code} | Message: "${err.message}"`);
    }

    if (item.correctPass) {
      // 2. Loading with CORRECT password
      try {
        const docPass = await pdfjs.getDocument({ data: data.slice(0), password: item.correctPass, disableWorker: true }).promise;
        console.log(`[CORRECT PASSWORD: '${item.correctPass}'] Result: SUCCESS AUTHENTICATED! Pages: ${docPass.numPages}`);
      } catch (err) {
        console.log(`[CORRECT PASSWORD: '${item.correctPass}'] Result: FAILED! | Name: ${err.name} | Code: ${err.code} | Message: "${err.message}"`);
      }

      // 3. Loading with WRONG password
      try {
        const docWrong = await pdfjs.getDocument({ data: data.slice(0), password: "wrongpassword999", disableWorker: true }).promise;
        console.log(`[WRONG PASSWORD: 'wrongpassword999'] Result: UNEXPECTED SUCCESS!`);
      } catch (err) {
        console.log(`[WRONG PASSWORD: 'wrongpassword999'] Result: THREW ERROR | Name: ${err.name} | Code: ${err.code} | Message: "${err.message}"`);
      }
    }
  }
}

testPdfJs();
