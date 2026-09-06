import fs from "fs";
import { PDFDocument } from "pdf-lib";

async function verifySavedDocument() {
  console.log("=== Verifying Decrypted PDF Output ===");
  const savedBytes = fs.readFileSync("scratch/test_aes256_saved.pdf");
  
  try {
    const pdfDoc = await PDFDocument.load(savedBytes, { ignoreEncryption: false });
    console.log(`[PASS] Decrypted PDF opens cleanly WITHOUT password! Pages: ${pdfDoc.getPageCount()}`);
  } catch (err) {
    console.error(`[FAIL] Decrypted PDF threw error: ${err.message}`);
  }
}

verifySavedDocument();
