import { Document, Paragraph, TextRun, Packer } from "docx";
import JSZip from "jszip";
import fs from "fs";

async function testFix() {
  const samplePages = [
    {
      pageNumber: 1,
      paragraphs: [
        { text: "Lorem Ipsum", type: "heading" },
        { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ac faucibus odio.", type: "paragraph" },
        { text: "• Maecenas non lorem quis tellus placerat varius.", type: "bullet" },
        { text: "• Nulla facilisi.", type: "bullet" },
        { text: "• Mauris id ex erat. Nunc vulputate neque vitae justo facilisis.", type: "bullet" },
        { text: "• Morbi viverra semper lorem nec molestie.", type: "bullet" }
      ]
    },
    {
      pageNumber: 2,
      paragraphs: [
        { text: "In non mauris justo. Duis vehicula mi vel mi pretium, a viverra erat efficitur.", type: "paragraph" },
        { text: "In eleifend velit vitae libero sollicitudin euismod.", type: "paragraph" }
      ]
    }
  ];

  // Build document with clean sections per page
  const sections = samplePages.map((page) => {
    const children = [];
    for (const item of page.paragraphs) {
      if (item.type === "heading") {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: item.text,
                bold: true,
                size: 28, // 14pt
                font: "Calibri",
                color: "111827"
              })
            ],
            spacing: { before: 240, after: 120, line: 276 }
          })
        );
      } else if (item.type === "bullet") {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: item.text,
                size: 24,
                font: "Calibri"
              })
            ],
            indent: { left: 360, hanging: 240 },
            spacing: { after: 100, line: 260 }
          })
        );
      } else {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: item.text,
                size: 24,
                font: "Calibri"
              })
            ],
            spacing: { after: 160, line: 276 }
          })
        );
      }
    }

    return {
      properties: {
        page: {
          size: {
            width: 11906, // A4 width in twips
            height: 16838 // A4 height in twips
          },
          margin: {
            top: 1440,
            right: 1440,
            bottom: 1440,
            left: 1440
          }
        }
      },
      children
    };
  });

  const doc = new Document({ sections });
  const rawBlob = await Packer.toBlob(doc);
  const arrayBuffer = await rawBlob.arrayBuffer();

  // Inject zoom: 100% and view: print into word/settings.xml to prevent Word from showing two pages side by side!
  const zip = await JSZip.loadAsync(arrayBuffer);
  let settingsXml = await zip.file("word/settings.xml")?.async("text");

  if (settingsXml && !settingsXml.includes("<w:view")) {
    settingsXml = settingsXml.replace(
      "</w:settings>",
      '<w:view w:val="print"/><w:zoom w:percent="100"/></w:settings>'
    );
    zip.file("word/settings.xml", settingsXml);
  }

  const finalBuffer = await zip.generateAsync({ type: "nodebuffer" });
  fs.writeFileSync("scratch/test_fixed_view.docx", finalBuffer);

  console.log("Successfully generated scratch/test_fixed_view.docx!");
  console.log("Settings contains 100% zoom:", settingsXml.includes('w:zoom w:percent="100"'));
  console.log("Settings contains print view:", settingsXml.includes('w:view w:val="print"'));
  console.log("Sections count:", sections.length);
}

testFix().catch(console.error);
