import { Document, Paragraph, Packer } from "docx";
import JSZip from "jszip";

async function testZoomSetting() {
  const doc = new Document({
    sections: [{ children: [new Paragraph("Test Page 1")] }]
  });

  const blob = await Packer.toBlob(doc);
  const zip = await JSZip.loadAsync(blob);
  
  let settingsXml = await zip.file("word/settings.xml").async("text");
  
  // Inject <w:view w:val="print"/><w:zoom w:percent="100"/> inside <w:settings>
  if (!settingsXml.includes("<w:view")) {
    settingsXml = settingsXml.replace(
      "</w:settings>",
      '<w:view w:val="print"/><w:zoom w:percent="100"/></w:settings>'
    );
    zip.file("word/settings.xml", settingsXml);
  }

  const updatedBlob = await zip.generateAsync({ type: "blob" });
  console.log("Updated blob size:", updatedBlob.size);
  
  const verifyZip = await JSZip.loadAsync(updatedBlob);
  const verifySettings = await verifyZip.file("word/settings.xml").async("text");
  console.log("Settings contains w:zoom w:percent=100:", verifySettings.includes('<w:zoom w:percent="100"/>'));
  console.log("Settings contains w:view w:val=print:", verifySettings.includes('<w:view w:val="print"/>'));
}

testZoomSetting().catch(console.error);
