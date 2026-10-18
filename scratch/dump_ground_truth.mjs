import fs from "fs";
import JSZip from "jszip";

async function dumpOriginal() {
  const data = fs.readFileSync("C:/Users/SAMEER/Downloads/file-sample_1MB.docx");
  const zip = await JSZip.loadAsync(data);
  const docXml = await zip.file("word/document.xml").async("text");

  // Extract each paragraph <w:p>
  const pRegex = /<w:p[\s>].*?<\/w:p>/gs;
  const paragraphs = docXml.match(pRegex) || [];

  console.log(`=== GROUND TRUTH: file-sample_1MB.docx (${paragraphs.length} paragraphs) ===`);
  paragraphs.forEach((pXml, idx) => {
    const tMatches = pXml.match(/<w:t[\s>].*?<\/w:t>/g) || [];
    const text = tMatches.map(t => t.replace(/<.*?>/g, "")).join("");
    if (text.trim()) {
      console.log(`[${idx}]: "${text}"`);
    }
  });
}

dumpOriginal().catch(console.error);
