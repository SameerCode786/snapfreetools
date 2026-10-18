import fs from "fs";
import { PDFDocument } from "pdf-lib";

async function inspectPdfImages() {
  const filePath = "C:/Users/SAMEER/Downloads/file-sample_1MB (6).pdf";
  const pdfBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  console.log("Pages count:", pdfDoc.getPageCount());

  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();
    console.log(`Page ${i + 1}: width=${width}, height=${height}`);
  }
}

inspectPdfImages().catch(console.error);
