import fs from "fs";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

async function testPdfJsSaveDocument() {
  console.log("=== Testing pdfjs-dist doc.saveDocument() ===");

  const buffer = fs.readFileSync("scratch/test_aes256.pdf");
  const data = new Uint8Array(buffer);

  const doc = await pdfjs.getDocument({ data, password: "secret123", disableWorker: true }).promise;
  console.log(`Authenticated AES-256 PDF with secret123! Pages: ${doc.numPages}`);

  try {
    if (typeof doc.saveDocument === "function") {
      const savedBytes = await doc.saveDocument();
      console.log(`saveDocument() returned ${savedBytes.length} bytes!`);
      fs.writeFileSync("scratch/test_aes256_saved.pdf", savedBytes);
    } else {
      console.log("saveDocument() method not available on PDFDocumentProxy instance.");
    }
  } catch (err) {
    console.log(`saveDocument() error: ${err.message}`);
  }
}

testPdfJsSaveDocument();
