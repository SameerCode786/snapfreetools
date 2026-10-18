import fs from "fs";
import JSZip from "jszip";

async function inspectSampleDocx() {
  const filePath = "C:/Users/SAMEER/Downloads/file-sample_1MB.docx";
  if (!fs.existsSync(filePath)) {
    console.log("Not found:", filePath);
    return;
  }
  const data = fs.readFileSync(filePath);
  const zip = await JSZip.loadAsync(data);
  const docXml = await zip.file("word/document.xml")?.async("text");
  if (!docXml) return;

  const textMatches = docXml.match(/<w:t[\s>].*?<\/w:t>/g) || [];
  const text = textMatches.map(t => t.replace(/<.*?>/g, "")).join(" ");
  console.log("file-sample_1MB.docx text length:", text.length);
  console.log("First 800 chars:\n", text.substring(0, 800));
}

inspectSampleDocx().catch(console.error);
