import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { executePdfPageSorter } from "../src/features/pdf-page-sorter/utils/pdfPageSorterEngine.js";

async function testGroundTruthExport() {
  console.log("=== RUNNING GROUND-TRUTH EXPORT TEST ===");
  
  // 1. Create a 3-page PDF with distinct text:
  // Page 1 = ALPHA, Page 2 = BETA, Page 3 = GAMMA
  const srcDoc = await PDFDocument.create();
  const font = await srcDoc.embedFont(StandardFonts.HelveticaBold);
  
  const page1 = srcDoc.addPage([400, 400]);
  page1.drawText("ALPHA", { x: 100, y: 200, size: 30, font, color: rgb(1, 0, 0) });
  
  const page2 = srcDoc.addPage([400, 400]);
  page2.drawText("BETA", { x: 100, y: 200, size: 30, font, color: rgb(0, 1, 0) });
  
  const page3 = srcDoc.addPage([400, 400]);
  page3.drawText("GAMMA", { x: 100, y: 200, size: 30, font, color: rgb(0, 0, 1) });
  
  const srcBytes = await srcDoc.save();
  
  const mockFile = {
    name: "greek-test.pdf",
    size: srcBytes.byteLength,
    arrayBuffer: async () => srcBytes.buffer
  };
  
  // 2. Reorder sequence: GAMMA (Page 3 / origIndex 2) -> ALPHA (Page 1 / origIndex 0) -> BETA (Page 2 / origIndex 1)
  const pageItems = [
    { id: "item-gamma", originalIndex: 2, originalPageNumber: 3, rotation: 0 },
    { id: "item-alpha", originalIndex: 0, originalPageNumber: 1, rotation: 0 },
    { id: "item-beta",  originalIndex: 1, originalPageNumber: 2, rotation: 90 } // test rotation on beta as well
  ];
  
  const result = await executePdfPageSorter({
    file: mockFile,
    pageItems,
    onProgress: () => {}
  });
  
  const outBytes = await result.blob.arrayBuffer();
  const outDoc = await PDFDocument.load(outBytes);
  
  console.log("Output Page Count:", outDoc.getPageCount());
  
  const outPage1 = outDoc.getPage(0);
  const outPage2 = outDoc.getPage(1);
  const outPage3 = outDoc.getPage(2);
  
  console.log("Page 1 Rotation:", outPage1.getRotation().angle);
  console.log("Page 2 Rotation:", outPage2.getRotation().angle);
  console.log("Page 3 Rotation (Beta rotated 90°):", outPage3.getRotation().angle);
  
  if (outDoc.getPageCount() === 3 && outPage3.getRotation().angle === 90) {
    console.log("✅ GROUND-TRUTH EXPORT TEST PASSED SUCCESSFULLY!");
  } else {
    console.error("❌ GROUND-TRUTH EXPORT TEST FAILED!");
    process.exit(1);
  }
}

testGroundTruthExport().catch(err => {
  console.error("Ground-Truth Test Error:", err);
  process.exit(1);
});
