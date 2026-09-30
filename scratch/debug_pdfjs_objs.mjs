import { PDFDocument } from "pdf-lib";

async function getPdfJsEngineNode() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  return pdfjs;
}

async function testPdfJsOps() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 400]);

  // Embed a 2x2 test PNG
  const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAVSURBVBhXY2A48v8/AwMRgABhBgYABjMD/4V1m0UAAAAASUVORK5CYII=";
  const pngBytes = Buffer.from(pngBase64, "base64");
  const img = await pdfDoc.embedPng(pngBytes);
  page.drawImage(img, { x: 50, y: 50, width: 100, height: 100 });

  const bytes = await pdfDoc.save();

  const pdfjs = await getPdfJsEngineNode();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(bytes) });
  const doc = await loadingTask.promise;
  console.log("PDF.js doc loaded, pages:", doc.numPages);

  const pdfjsPage = await doc.getPage(1);
  const opList = await pdfjsPage.getOperatorList();
  console.log("Operator list fnArray length:", opList.fnArray.length);

  for (let i = 0; i < opList.fnArray.length; i++) {
    const fn = opList.fnArray[i];
    const args = opList.argsArray[i];
    if (fn === pdfjs.OPS.paintImageXObject || fn === pdfjs.OPS.paintInlineImageXObject) {
      console.log("Found image op:", fn, args);
      const objName = args[0];
      if (typeof objName === "string") {
        await new Promise((resolve) => {
          pdfjsPage.objs.get(objName, (imgObj) => {
            console.log("Fetched imgObj from objs:", {
              width: imgObj.width,
              height: imgObj.height,
              kind: imgObj.kind,
              dataLen: imgObj.data ? imgObj.data.length : 0,
            });
            resolve();
          });
        });
      } else if (typeof objName === "object" && objName) {
        console.log("Inline image object:", {
          width: objName.width,
          height: objName.height,
          dataLen: objName.data ? objName.data.length : 0,
        });
      }
    }
  }
}

testPdfJsOps().catch((e) => console.error(e));
