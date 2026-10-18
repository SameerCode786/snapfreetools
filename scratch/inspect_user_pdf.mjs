import fs from "fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

async function inspectSample() {
  const filePath = "C:/Users/SAMEER/Downloads/file-sample_1MB (6).pdf";
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await getDocument({ data }).promise;

  console.log("PDF numPages:", doc.numPages);

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });
    const textContent = await page.getTextContent();
    const str = textContent.items.map(it => it.str).join(" ").trim();
    console.log(`Page ${i}: width=${viewport.width}, height=${viewport.height}, textLength=${str.length}`);
    if (str.length > 0) {
      console.log(`Page ${i} preview: "${str.substring(0, 100)}"`);
    }
  }
}

inspectSample().catch(console.error);
