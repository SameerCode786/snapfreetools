import fs from "fs";
import JSZip from "jszip";

async function run() {
  const buf = fs.readFileSync('C:/Users/SAMEER/Downloads/file-sample_1MB (6)-ocr-converted (1).docx');
  const zip = await JSZip.loadAsync(buf);
  const docXml = await zip.file('word/document.xml').async('text');
  const pRegex = /<w:p[\s>].*?<\/w:p>/gs;
  const paragraphs = docXml.match(pRegex) || [];
  paragraphs.forEach((p, i) => {
    const textMatches = p.match(/<w:t[\s>].*?<\/w:t>/g) || [];
    const text = textMatches.map(t => t.replace(/<.*?>/g, '')).join('');
    const hasBr = p.includes('<w:br w:type="page"/>');
    console.log(`[P${i}] (hasPageBreak=${hasBr}): "${text}"`);
  });
}

run().catch(console.error);
