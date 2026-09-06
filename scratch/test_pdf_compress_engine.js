import { PDFDocument, PDFName, PDFRawStream, PDFStream } from "pdf-lib";

async function testPdfImageExtraction() {
  console.log("=== Testing Image XObject Discovery in pdf-lib ===");

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([500, 500]);
  page.drawText("Hello World PDF Test", { x: 50, y: 450 });

  const rawBytes = await pdfDoc.save();
  const loadedDoc = await PDFDocument.load(rawBytes);

  let imageCount = 0;
  const indirectObjects = loadedDoc.context.enumerateIndirectObjects();
  for (const [ref, obj] of indirectObjects) {
    if (obj instanceof PDFRawStream || obj instanceof PDFStream) {
      const subtype = obj.dict.get(PDFName.of("Subtype"));
      if (subtype === PDFName.of("Image")) {
        imageCount++;
        const width = obj.dict.get(PDFName.of("Width"));
        const height = obj.dict.get(PDFName.of("Height"));
        const filter = obj.dict.get(PDFName.of("Filter"));
        console.log(`Image XObject found: ref=${ref}, width=${width}, height=${height}, filter=${filter}`);
      }
    }
  }

  console.log(`Total image XObjects found: ${imageCount}`);
}

testPdfImageExtraction();
