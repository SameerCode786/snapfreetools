import fs from "fs";
import JSZip from "jszip";

async function inspectOriginalDocx() {
  const filePath = "C:/Users/SAMEER/Downloads/file-sample_1MB (6).docx";
  if (!fs.existsSync(filePath)) {
    console.log("Original docx not found at:", filePath);
    return;
  }

  const data = fs.readFileSync(filePath);
  const zip = await JSZip.loadAsync(data);
  const docXml = await zip.file("word/document.xml").async("text");

  console.log("=== ORIGINAL DOCX (BEFORE PDF) ===");
  const pMatches = docXml.match(/<w:p[\s>].*?<\/w:p>/g) || [];
  console.log("Total paragraphs in original docx:", pMatches.length);

  // Extract text from original docx
  const textMatches = docXml.match(/<w:t[\s>].*?<\/w:t>/g) || [];
  const text = textMatches.map(t => t.replace(/<.*?>/g, "")).join(" ");
  console.log("Total text length:", text.length);
  console.log("First 1000 chars of original docx:\n", text.substring(0, 1000));
}

inspectOriginalDocx().catch(console.error);
