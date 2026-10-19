import assert from "assert";
import fs from "fs";
import path from "path";
import JSZip from "jszip";
import { pathToFileURL } from "url";

const projectRoot = process.cwd();

console.log("=================================================");
console.log("RUNNING END-TO-END PPTX GENERATION & XML INSPECTION");
console.log("=================================================\n");

const enginePath = pathToFileURL(path.join(projectRoot, "src/features/pdf-to-powerpoint/utils/pdfToPowerpointEngine.js")).href;
const {
  getPdfJsEngine,
  analyzePdfDocument,
  clusterTextItemsIntoBlocks,
  calculateSlideDimensions,
  sanitizePptxFilename
} = await import(enginePath);

const pptxgenModule = (await import("pptxgenjs")).default;

// 1. Test Text Clustering on dummy.pdf
const pdfBytes = fs.readFileSync(path.join(projectRoot, "dummy.pdf"));
const pdfjs = await getPdfJsEngine();
const pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(pdfBytes) }).promise;

const analysis = await analyzePdfDocument(pdfDoc);
console.log("Analysis Result:", {
  numPages: analysis.numPages,
  widthPt: analysis.widthPt,
  heightPt: analysis.heightPt,
  orientation: analysis.orientation,
  detectedContentType: analysis.detectedContentType
});

const page = await pdfDoc.getPage(1);
const viewport = page.getViewport({ scale: 1.0 });
const textContent = await page.getTextContent();
const blocks = clusterTextItemsIntoBlocks(textContent.items, viewport.height);

console.log(`Extracted ${blocks.length} text blocks:`);
blocks.forEach((b, idx) => {
  console.log(`Block ${idx + 1}: "${b.text}" (font: ${b.fontFace}, size: ${b.fontSizePt}pt, x: ${b.leftPt.toFixed(1)}pt, y: ${b.topPt.toFixed(1)}pt)`);
});

assert(blocks.length > 0, "At least one text block extracted");
assert(blocks[0].text.includes("Dummy PDF file"), "Text block contains expected text");

// 2. Generate PPTX with Reconstructed Text Boxes
const pres = new pptxgenModule();
const slideDim = calculateSlideDimensions("match", analysis.widthInches, analysis.heightInches);
pres.defineLayout({ name: "CUSTOM", width: slideDim.slideWidth, height: slideDim.slideHeight });
pres.layout = "CUSTOM";

const slide = pres.addSlide();
for (const block of blocks) {
  slide.addText(block.text, {
    x: block.leftPt / 72,
    y: block.topPt / 72,
    w: Math.max(0.6, block.widthPt / 72 + 0.1),
    h: Math.max(0.3, block.heightPt / 72 + 0.1),
    fontSize: block.fontSizePt,
    fontFace: block.fontFace,
    bold: block.bold,
    color: "0F172A"
  });
}

const pptxBuffer = await pres.write({ outputType: "nodebuffer" });
console.log(`Generated PPTX file size: ${pptxBuffer.length} bytes`);

// 3. Inspect the PPTX ZIP structure to confirm real editable PowerPoint text
const zip = await JSZip.loadAsync(pptxBuffer);
const fileList = Object.keys(zip.files);
console.log("PPTX ZIP entries count:", fileList.length);

assert(fileList.includes("[Content_Types].xml"), "[Content_Types].xml present");
assert(fileList.includes("ppt/presentation.xml"), "ppt/presentation.xml present");
assert(fileList.includes("ppt/slides/slide1.xml"), "ppt/slides/slide1.xml present");

const slide1Xml = await zip.file("ppt/slides/slide1.xml").async("text");
assert(slide1Xml.includes("Dummy PDF file"), "slide1.xml contains literal editable text '<a:t>Dummy PDF file</a:t>'!");
console.log("✅ Verified: slide1.xml contains authentic editable text element '<a:t>Dummy PDF file</a:t>'!");

// 4. Test Scanned Document Handling with sample-scanned.pdf
if (fs.existsSync(path.join(projectRoot, "sample-scanned.pdf"))) {
  const scannedBytes = fs.readFileSync(path.join(projectRoot, "sample-scanned.pdf"));
  const scannedDoc = await pdfjs.getDocument({ data: new Uint8Array(scannedBytes) }).promise;
  const scannedAnalysis = await analyzePdfDocument(scannedDoc);
  console.log("Scanned PDF Analysis:", {
    numPages: scannedAnalysis.numPages,
    isPurelyScanned: scannedAnalysis.isPurelyScanned,
    detectedContentType: scannedAnalysis.detectedContentType,
    recommendedMode: scannedAnalysis.recommendedMode
  });
  assert.strictEqual(scannedAnalysis.isPurelyScanned, true, "sample-scanned.pdf correctly identified as purely scanned");
  assert.strictEqual(scannedAnalysis.recommendedMode, "fidelity", "sample-scanned.pdf recommends high-fidelity mode");
  console.log("✅ Verified: Scanned PDF detection accurately flags image-only documents without false OCR claims!");
}

console.log("\n=================================================");
console.log("ALL END-TO-END VERIFICATION CHECKS PASSED!");
console.log("=================================================");
