import fs from "fs";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

async function inspectDocx() {
  const docxPath = "C:/Users/SAMEER/Downloads/file-sample_1MB (6)-ocr-converted (1).docx";
  const data = fs.readFileSync(docxPath);
  const zip = await JSZip.loadAsync(data);
  const docXml = await zip.file("word/document.xml").async("text");

  console.log("=== DOCX XML INSPECTION ===");
  const pageBreaks = (docXml.match(/<w:br w:type="page"\/>/g) || []).length;
  console.log("Count of <w:br w:type=\"page\"/>:", pageBreaks);

  const paragraphs = docXml.match(/<w:p[\s>].*?<\/w:p>/g) || [];
  console.log("Total paragraphs in DOCX:", paragraphs.length);

  // Split by page break
  const pages = docXml.split(/<w:br w:type="page"\/>/);
  console.log("Pages separated by page break:", pages.length);
  pages.forEach((p, idx) => {
    // extract text from page
    const textMatches = p.match(/<w:t[\s>].*?<\/w:t>/g) || [];
    const text = textMatches.map(t => t.replace(/<.*?>/g, "")).join(" ");
    console.log(`\n--- PAGE ${idx + 1} (${text.length} chars) ---`);
    console.log(text.substring(0, 300) + (text.length > 300 ? "..." : ""));
  });
}

inspectDocx().catch(console.error);
