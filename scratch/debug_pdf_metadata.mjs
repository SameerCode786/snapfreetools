import { PDFDocument } from "pdf-lib";

async function testClearMetadata() {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle("Title To Clear");
  pdfDoc.setAuthor("Author To Clear");

  const bytes = await pdfDoc.save();

  const loadedDoc = await PDFDocument.load(bytes);
  console.log("Before clear title:", loadedDoc.getTitle());

  // Clear fields
  loadedDoc.setTitle("");
  loadedDoc.setAuthor("");
  loadedDoc.setSubject("");
  loadedDoc.setKeywords([]);

  const clearedBytes = await loadedDoc.save();
  const reloadedDoc = await PDFDocument.load(clearedBytes);

  console.log("After clear title:", reloadedDoc.getTitle());
  console.log("After clear author:", reloadedDoc.getAuthor());
  console.log("After clear keywords:", reloadedDoc.getKeywords());
}

testClearMetadata().catch((err) => console.error(err));
