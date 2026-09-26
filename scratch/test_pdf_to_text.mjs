import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Dynamic import of pdfjs-dist
async function testExtraction() {
  console.log("=== RUNNING PDF TO TEXT ENGINE AUDIT ===");

  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  
  // 1. Test Selectable Text PDF (dummy.pdf)
  const dummyPath = path.join(rootDir, "dummy.pdf");
  if (fs.existsSync(dummyPath)) {
    const dummyBuffer = fs.readFileSync(dummyPath);
    const pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(dummyBuffer) }).promise;
    console.log(`[TEST 1] dummy.pdf parsed successfully. Pages: ${pdfDoc.numPages}`);
    
    let totalText = "";
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      totalText += pageText;
    }
    console.log(`[TEST 1] Extracted text length: ${totalText.length} chars`);
    console.log(`[TEST 1] Sample snippet: "${totalText.slice(0, 100)}..."`);
  }

  // 2. Test Scanned Image PDF (sample-scanned.pdf)
  const scannedPath = path.join(rootDir, "sample-scanned.pdf");
  if (fs.existsSync(scannedPath)) {
    const scannedBuffer = fs.readFileSync(scannedPath);
    const pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(scannedBuffer) }).promise;
    console.log(`[TEST 2] sample-scanned.pdf parsed successfully. Pages: ${pdfDoc.numPages}`);
    
    let totalText = "";
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      totalText += pageText;
    }
    const isScanned = totalText.trim().length < 10;
    console.log(`[TEST 2] Extracted text length: ${totalText.length} chars. Correctly flagged as scanned PDF: ${isScanned}`);
  }

  // 3. Test Invalid / Corrupt PDF Buffer
  try {
    const corruptBuffer = Buffer.from("NOT_A_PDF_DOCUMENT_CONTENT");
    await pdfjs.getDocument({ data: new Uint8Array(corruptBuffer) }).promise;
    console.error("[TEST 3] FAILED: Corrupt PDF did not throw exception!");
  } catch (err) {
    console.log(`[TEST 3] PASSED: Corrupt PDF caught exception: "${err.message}"`);
  }

  console.log("=== PDF TO TEXT ENGINE AUDIT COMPLETED SUCCESSFULLY ===");
}

testExtraction().catch(err => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
