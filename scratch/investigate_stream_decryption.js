import fs from "fs";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import { PDFDocument, PDFName, PDFRawStream } from "pdf-lib";

async function investigateStreams() {
  console.log("=== Investigating PDF Stream Encryption & Decryption ===");

  const fileBuffer = fs.readFileSync("scratch/test_aes128.pdf");
  const data = new Uint8Array(fileBuffer);

  // 1. Authenticate with pdfjs-dist
  const doc = await pdfjs.getDocument({ data: data.slice(0), password: "secret123", disableWorker: true }).promise;
  console.log(`Authenticated with pdfjs-dist! Pages: ${doc.numPages}`);

  // Inspect page 1 content stream from pdfjs-dist
  const page = await doc.getPage(1);
  const contentStream = await page.getContentStream();
  console.log("pdfjs-dist decrypted page content stream length:", contentStream.length);

  // Load in pdf-lib with ignoreEncryption: true
  const pdfLibDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const indirectObjects = pdfLibDoc.context.enumerateIndirectObjects();
  
  for (const [ref, obj] of indirectObjects) {
    if (obj instanceof PDFRawStream) {
      console.log(`pdf-lib stream ref ${ref} contents length: ${obj.contents.length}, dict: ${obj.dict.keys().map(k => k.toString()).join(", ")}`);
    }
  }
}

investigateStreams();
