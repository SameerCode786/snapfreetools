import { Document, Paragraph, TextRun, Packer } from "docx";
import JSZip from "jszip";

async function inspectSettings() {
  const doc = new Document({
    sections: [{ children: [new Paragraph("Hello world")] }]
  });

  const buffer = await Packer.toBuffer(doc);
  const zip = await JSZip.loadAsync(buffer);
  const settingsXml = await zip.file("word/settings.xml")?.async("text");
  console.log("Existing word/settings.xml:\n", settingsXml);
}

inspectSettings().catch(console.error);
