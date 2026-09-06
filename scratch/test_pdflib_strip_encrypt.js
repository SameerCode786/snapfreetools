import fs from "fs";
import { PDFDocument, PDFName } from "pdf-lib";

async function testStripEncrypt() {
  console.log("=== Testing pdf-lib Encryption Dictionary Stripping ===");

  const files = [
    { name: "AES-256", path: "scratch/test_aes256.pdf" },
    { name: "AES-128", path: "scratch/test_aes128.pdf" },
    { name: "RC4", path: "scratch/test_rc4.pdf" }
  ];

  for (const item of files) {
    const buffer = fs.readFileSync(item.path);
    try {
      // 1. Load with ignoreEncryption: true
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      
      // 2. Strip /Encrypt dictionary from context trailer and catalog
      if (doc.context.trailerInfo) {
        delete doc.context.trailerInfo.Encrypt;
      }
      doc.catalog.delete(PDFName.of("Encrypt"));

      // 3. Save as unencrypted PDF
      const strippedBytes = await doc.save({ useObjectStreams: false });
      
      // 4. Test loading stripped bytes WITHOUT ignoreEncryption
      const testDoc = await PDFDocument.load(strippedBytes, { ignoreEncryption: false });
      console.log(`[PASS] ${item.name} stripped successfully! Saved ${strippedBytes.length} bytes. Verified: ${testDoc.getPageCount()} pages, no password required!`);
    } catch (err) {
      console.log(`[FAIL] ${item.name} strip failed: ${err.message}`);
    }
  }
}

testStripEncrypt();
