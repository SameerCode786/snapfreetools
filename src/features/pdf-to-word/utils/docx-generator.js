/**
 * DOCX Document Generator
 * Compiles structured text/OCR pages into a clean, editable Microsoft Word (.docx) document.
 * Preserves headings (bold & spaced), bullet points (indented), numbered lists, and paragraphs.
 */

export async function generateDocxFromPages(pages) {
  const docx = await import("docx");
  const { Document, Paragraph, TextRun, PageBreak, Packer } = docx;

  const docChildren = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    // Preserve page breaks between subsequent pages
    if (i > 0) {
      docChildren.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );
    }

    const paragraphs = Array.isArray(page.paragraphs) ? page.paragraphs : [];

    if (paragraphs.length === 0) {
      // Empty page placeholder
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "",
              size: 24, // 12pt
              font: "Calibri",
            }),
          ],
        })
      );
    } else {
      for (const item of paragraphs) {
        if (!item) continue;

        // Support both structured objects ({ text, type }) and legacy plain strings
        const text = typeof item === "string" ? item : (item.text || "");
        const type = typeof item === "object" && item.type ? item.type : "paragraph";

        if (!text || typeof text !== "string") continue;

        if (type === "heading") {
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text,
                  bold: true,
                  size: 28, // 14pt
                  font: "Calibri",
                  color: "111827",
                }),
              ],
              spacing: {
                before: 240, // 12pt top spacing before heading
                after: 120, // 6pt bottom spacing after heading
                line: 276,
              },
            })
          );
        } else if (type === "bullet") {
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text,
                  size: 24, // 12pt
                  font: "Calibri",
                }),
              ],
              indent: {
                left: 360,
                hanging: 240,
              },
              spacing: {
                after: 100,
                line: 260,
              },
            })
          );
        } else if (type === "numbered") {
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text,
                  size: 24, // 12pt
                  font: "Calibri",
                }),
              ],
              indent: {
                left: 360,
                hanging: 240,
              },
              spacing: {
                after: 100,
                line: 260,
              },
            })
          );
        } else {
          // Standard body paragraph
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text,
                  size: 24, // 12pt font
                  font: "Calibri",
                }),
              ],
              spacing: {
                after: 160, // 8pt padding after paragraph
                line: 276, // 1.15 line spacing
              },
            })
          );
        }
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch = 1440 twips
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
