import { PDFDocument, degrees } from "pdf-lib";

async function runTest() {
  console.log("Creating sample PDF bytes...");
  const pdfDoc = await PDFDocument.create();
  pdfDoc.addPage([600, 400]);
  pdfDoc.addPage([600, 400]);
  pdfDoc.addPage([600, 400]);
  const pdfBytes = await pdfDoc.save();

  console.log("Original pdfBytes byteLength:", pdfBytes.byteLength);

  // Simulate parsing metadata with slice(0)
  const metaSlice = new Uint8Array(pdfBytes.buffer.slice(0));
  const doc1 = await PDFDocument.load(metaSlice);
  console.log("Doc1 pages:", doc1.getPageCount());
  console.log("Original pdfBytes byteLength after doc1 load:", pdfBytes.byteLength);

  // Simulate rendering thumbnails with slice(0)
  const thumbSlice = new Uint8Array(pdfBytes.buffer.slice(0));
  const doc2 = await PDFDocument.load(thumbSlice);
  console.log("Doc2 pages:", doc2.getPageCount());
  console.log("Original pdfBytes byteLength after doc2 load:", pdfBytes.byteLength);

  // Simulate execution with slice(0)
  const execSlice = new Uint8Array(pdfBytes.buffer.slice(0));
  const doc3 = await PDFDocument.load(execSlice);
  const pages = doc3.getPages();
  pages[0].setRotation(degrees(90));
  const rotatedBytes = await doc3.save();
  console.log("Doc3 rotation complete. Output length:", rotatedBytes.byteLength);
  console.log("Original pdfBytes byteLength after doc3 rotation:", pdfBytes.byteLength);

  console.log("SUCCESS: Buffer isolation verified! No detached ArrayBuffer errors.");
}

runTest().catch(console.error);
