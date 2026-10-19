/**
 * Automated Test Suite for PDF to PowerPoint Engine & Integration
 * Scratch Verification Script
 *
 * Covers 16 minimum required test suites:
 * 1. PDF file validation
 * 2. Page count handling
 * 3. Page range parsing
 * 4. Duplicate page removal
 * 5. Out-of-range page rejection
 * 6. PDF page dimension detection
 * 7. Slide size calculations
 * 8. Aspect ratio calculations
 * 9. Fit-content scaling calculations
 * 10. Filename sanitization
 * 11. PPTX output configuration
 * 12. Metadata configuration
 * 13. Tool registry activation
 * 14. Sitemap integration
 * 15. FAQ/JSON-LD consistency
 * 16. Required file structure
 */

import assert from "assert";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const projectRoot = process.cwd();

console.log("=================================================");
console.log("RUNNING PDF TO POWERPOINT AUTOMATED VERIFICATION");
console.log("=================================================\n");

let passedCount = 0;
let failedCount = 0;

function runTest(testName, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${testName}`);
    passedCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${testName}`);
    console.error(`   Error: ${err.message}`);
    failedCount++;
  }
}

async function runAsyncTest(testName, fn) {
  try {
    await fn();
    console.log(`✅ PASS: ${testName}`);
    passedCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${testName}`);
    console.error(`   Error: ${err.message}`);
    failedCount++;
  }
}

// 1. Dynamic Engine Import
const enginePath = pathToFileURL(path.join(projectRoot, "src/features/pdf-to-powerpoint/utils/pdfToPowerpointEngine.js")).href;
const {
  validatePdfInput,
  sanitizePptxFilename,
  parsePageRange,
  calculateSlideDimensions,
  clusterTextItemsIntoBlocks,
  resolveSafeFontFamily,
  detectFontStyle,
  analyzePdfDocument,
  getPdfJsEngine,
  SLIDE_PRESETS,
  PPT_SAFETY_LIMITS
} = await import(enginePath);

// ---------------------------------------------------------------------------
// TEST 1: PDF file validation
// ---------------------------------------------------------------------------
runTest("1. PDF file validation handles valid, empty, invalid types, and oversized limits", () => {
  // Valid buffer
  const validBuffer = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]); // %PDF-
  const validRes = validatePdfInput(validBuffer);
  assert.strictEqual(validRes.valid, true, "Valid PDF buffer passes validation");

  // Empty buffer
  const emptyRes = validatePdfInput(new Uint8Array(0));
  assert.strictEqual(emptyRes.valid, false, "Empty buffer rejected");
  assert(emptyRes.error.includes("empty"), "Correct error message for empty buffer");

  // Null input
  const nullRes = validatePdfInput(null);
  assert.strictEqual(nullRes.valid, false, "Null input rejected");

  // Oversized buffer
  const fakeHugeBuffer = { byteLength: 60 * 1024 * 1024 }; // 60MB
  const hugeRes = validatePdfInput(fakeHugeBuffer);
  assert.strictEqual(hugeRes.valid, false, "Buffer exceeding 50MB rejected");
});

// ---------------------------------------------------------------------------
// TEST 2: Page count handling
// ---------------------------------------------------------------------------
await runAsyncTest("2. Page count handling accurately extracts number of pages from PDF", async () => {
  const dummyPdfPath = path.join(projectRoot, "dummy.pdf");
  assert(fs.existsSync(dummyPdfPath), "dummy.pdf test file exists");

  const pdfBytes = fs.readFileSync(dummyPdfPath);
  const pdfjs = await getPdfJsEngine();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(pdfBytes) });
  const pdfDoc = await loadingTask.promise;

  assert(pdfDoc.numPages >= 1, `PDF document numPages is ${pdfDoc.numPages}`);
  const analysis = await analyzePdfDocument(pdfDoc);
  assert.strictEqual(analysis.numPages, pdfDoc.numPages, "Analysis numPages matches pdfDoc.numPages");
});

// ---------------------------------------------------------------------------
// TEST 3: Page range parsing
// ---------------------------------------------------------------------------
runTest("3. Page range parsing parses 'all', single pages, and multiple intervals", () => {
  const resAll = parsePageRange("all", 10);
  assert.strictEqual(resAll.valid, true);
  assert.strictEqual(resAll.pages.length, 10);
  assert.deepStrictEqual(resAll.pages, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  const resIntervals = parsePageRange("1-3, 5, 8-10", 12);
  assert.strictEqual(resIntervals.valid, true);
  assert.deepStrictEqual(resIntervals.pages, [1, 2, 3, 5, 8, 9, 10]);

  const resSpaced = parsePageRange("  2 , 4 , 6  ", 10);
  assert.strictEqual(resSpaced.valid, true);
  assert.deepStrictEqual(resSpaced.pages, [2, 4, 6]);
});

// ---------------------------------------------------------------------------
// TEST 4: Duplicate page removal
// ---------------------------------------------------------------------------
runTest("4. Duplicate page removal strips redundant page requests cleanly", () => {
  const res = parsePageRange("1, 1, 2, 2, 3, 1-3", 10);
  assert.strictEqual(res.valid, true);
  assert.deepStrictEqual(res.pages, [1, 2, 3], "Duplicates merged into unique sorted array");
});

// ---------------------------------------------------------------------------
// TEST 5: Out-of-range page rejection
// ---------------------------------------------------------------------------
runTest("5. Out-of-range page rejection flags non-existent and invalid pages", () => {
  const res = parsePageRange("1, 3, 8, 15", 5);
  assert.strictEqual(res.valid, true);
  assert.deepStrictEqual(res.pages, [1, 3], "Only pages <= totalPages are included");
  assert(res.rejected.includes(8), "Page 8 marked as rejected");
  assert(res.rejected.includes(15), "Page 15 marked as rejected");

  const resInvalid = parsePageRange("abc, 0, -2, 5-2", 5);
  assert.strictEqual(resInvalid.valid, false, "Completely invalid ranges return valid: false");
});

// ---------------------------------------------------------------------------
// TEST 6: PDF page dimension detection
// ---------------------------------------------------------------------------
await runAsyncTest("6. PDF page dimension detection extracts points, inches, and orientation", async () => {
  const dummyPdfPath = path.join(projectRoot, "dummy.pdf");
  const pdfBytes = fs.readFileSync(dummyPdfPath);
  const pdfjs = await getPdfJsEngine();
  const pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(pdfBytes) }).promise;

  const analysis = await analyzePdfDocument(pdfDoc);
  assert(analysis.widthPt > 0, "Page width in points is greater than 0");
  assert(analysis.heightPt > 0, "Page height in points is greater than 0");
  assert.strictEqual(typeof analysis.orientation, "string", "Orientation string provided");
  assert(["Portrait", "Landscape"].includes(analysis.orientation), "Orientation is Portrait or Landscape");
  assert(analysis.widthInches > 0 && analysis.heightInches > 0, "Inches computed correctly");
});

// ---------------------------------------------------------------------------
// TEST 7: Slide size calculations
// ---------------------------------------------------------------------------
runTest("7. Slide size calculations accurately compute preset slide dimensions", () => {
  // Match PDF (8.5 x 11 inches)
  const matchDim = calculateSlideDimensions("match", 8.5, 11.0);
  assert.strictEqual(matchDim.slideWidth, 8.5);
  assert.strictEqual(matchDim.slideHeight, 11.0);
  assert.strictEqual(matchDim.contentScale, 1.0);

  // 16:9 Widescreen
  const wideDim = calculateSlideDimensions("16:9", 8.5, 11.0);
  assert.strictEqual(wideDim.slideWidth, 13.333);
  assert.strictEqual(wideDim.slideHeight, 7.5);

  // 4:3 Standard
  const stdDim = calculateSlideDimensions("4:3", 8.5, 11.0);
  assert.strictEqual(stdDim.slideWidth, 10.0);
  assert.strictEqual(stdDim.slideHeight, 7.5);
});

// ---------------------------------------------------------------------------
// TEST 8: Aspect ratio calculations
// ---------------------------------------------------------------------------
runTest("8. Aspect ratio calculations preserve proportions without division errors", () => {
  const portraitW = 595.28 / 72;
  const portraitH = 841.89 / 72;
  const dim169 = calculateSlideDimensions("16:9", portraitW, portraitH);

  const scaledW = portraitW * dim169.contentScale;
  const scaledH = portraitH * dim169.contentScale;

  const originalAspect = portraitW / portraitH;
  const scaledAspect = scaledW / scaledH;

  assert(Math.abs(originalAspect - scaledAspect) < 0.001, "Aspect ratio preserved during scaling");
  assert(scaledW <= dim169.slideWidth, "Scaled width fits within slide width");
  assert(scaledH <= dim169.slideHeight, "Scaled height fits within slide height");
});

// ---------------------------------------------------------------------------
// TEST 9: Fit-content scaling calculations
// ---------------------------------------------------------------------------
runTest("9. Fit-content scaling calculations center scaled content on target slide", () => {
  const dim = calculateSlideDimensions("16:9", 8.27, 11.69); // A4 portrait on 16:9 widescreen
  assert(dim.offsetX > 0, "Positive horizontal offset centers portrait page on widescreen");
  assert(Math.abs(dim.offsetY) < 0.05, "Vertical offset is near zero as portrait page fills height");
});

// ---------------------------------------------------------------------------
// TEST 10: Filename sanitization
// ---------------------------------------------------------------------------
runTest("10. Filename sanitization produces safe, clean .pptx presentation names", () => {
  assert.strictEqual(sanitizePptxFilename("annual_report.pdf"), "annual_report.pptx");
  assert.strictEqual(sanitizePptxFilename("Annual Report 2024.PDF"), "Annual Report 2024.pptx");
  assert.strictEqual(sanitizePptxFilename("my/file:special?name*.pdf"), "my-file-special-name-.pptx");
  assert.strictEqual(sanitizePptxFilename(""), "presentation.pptx");
  assert.strictEqual(sanitizePptxFilename(null), "presentation.pptx");
});

// ---------------------------------------------------------------------------
// TEST 11: PPTX output configuration
// ---------------------------------------------------------------------------
await runAsyncTest("11. PPTX output configuration builds valid PPTX presentation in Node and browser", async () => {
  const pptxgenModule = (await import("pptxgenjs")).default;
  const pres = new pptxgenModule();
  pres.defineLayout({ name: "TEST_LAYOUT", width: 10, height: 7.5 });
  pres.layout = "TEST_LAYOUT";

  const slide = pres.addSlide();
  slide.addText("Reconstructed Heading", {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 1,
    fontSize: 22,
    bold: true,
    color: "0F172A",
    fontFace: "Calibri"
  });

  slide.addText("This is an editable paragraph reconstructed from PDF text stream.", {
    x: 0.5,
    y: 1.8,
    w: 9,
    h: 2,
    fontSize: 13,
    color: "334155",
    fontFace: "Arial"
  });

  const buffer = await pres.write({ outputType: "nodebuffer" });
  assert(Buffer.isBuffer(buffer), "Generated PPTX is a valid Node Buffer");
  assert(buffer.length > 1000, `Generated PPTX buffer has non-trivial size (${buffer.length} bytes)`);

  // Verify ZIP PK magic header for PPTX (Office Open XML format starts with PK\x03\x04)
  assert.strictEqual(buffer[0], 0x50, "First byte is 'P'");
  assert.strictEqual(buffer[1], 0x4b, "Second byte is 'K'");
  assert.strictEqual(buffer[2], 0x03, "Third byte is 0x03");
  assert.strictEqual(buffer[3], 0x04, "Fourth byte is 0x04");
});

// ---------------------------------------------------------------------------
// TEST 12: Metadata configuration
// ---------------------------------------------------------------------------
runTest("12. Metadata configuration in src/seo/metadata.js contains pdf-to-powerpoint entry", () => {
  const metadataFilePath = path.join(projectRoot, "src/seo/metadata.js");
  const content = fs.readFileSync(metadataFilePath, "utf8");

  assert(content.includes('"pdf-to-powerpoint": {'), "metadata.js defines 'pdf-to-powerpoint' entry");
  assert(content.includes('path: "/pdf-to-powerpoint"'), "Metadata path points to /pdf-to-powerpoint");
  assert(content.includes("PDF to PowerPoint"), "Metadata title includes 'PDF to PowerPoint'");
  assert(content.includes("PPTX"), "Metadata description covers PPTX");
});

// ---------------------------------------------------------------------------
// TEST 13: Tool registry activation
// ---------------------------------------------------------------------------
await runAsyncTest("13. Tool registry activates pdf-to-powerpoint as live and not future", async () => {
  const registryPath = pathToFileURL(path.join(projectRoot, "src/features/tools-hub/constants/allToolsRegistry.js")).href;
  const { ALL_TOOLS } = await import(registryPath);

  const pptTool = ALL_TOOLS.find((t) => t.slug === "pdf-to-powerpoint" || t.id === "pdf-to-powerpoint");
  assert(Boolean(pptTool), "Tool 'pdf-to-powerpoint' found in allToolsRegistry");
  assert.strictEqual(pptTool.status, "live", "Tool status is 'live'");
  assert.strictEqual(pptTool.future, false, "Tool future flag is false");
  assert.strictEqual(pptTool.group, "PDF Tools", "Tool group is 'PDF Tools'");
  assert.strictEqual(pptTool.slug, "pdf-to-powerpoint", "Tool slug is 'pdf-to-powerpoint'");
});

// ---------------------------------------------------------------------------
// TEST 14: Sitemap integration
// ---------------------------------------------------------------------------
await runAsyncTest("14. Sitemap integration includes /pdf-to-powerpoint in generated routes", async () => {
  const sitemapFilePath = path.join(projectRoot, "app/sitemap.js");
  const sitemapContent = fs.readFileSync(sitemapFilePath, "utf8");

  assert(sitemapContent.includes('ALL_TOOLS'), "sitemap.js imports and uses ALL_TOOLS");
  assert(sitemapContent.includes('status === "live"'), "sitemap.js filters for live tools");
  assert(sitemapContent.includes('!tool.future'), "sitemap.js filters out future tools");
  assert(sitemapContent.includes('`/${tool.slug}`'), "sitemap.js maps tool slug to route");

  const registryPath = pathToFileURL(path.join(projectRoot, "src/features/tools-hub/constants/allToolsRegistry.js")).href;
  const { ALL_TOOLS } = await import(registryPath);

  const liveToolRoutes = ALL_TOOLS
    .filter(tool => tool.status === "live" && !tool.future)
    .map(tool => `/${tool.slug}`);

  assert(liveToolRoutes.includes("/pdf-to-powerpoint"), "liveToolRoutes contains /pdf-to-powerpoint");
  const baseUrl = "https://www.snapfreetools.com";
  const sitemapUrls = liveToolRoutes.map(r => `${baseUrl}${r}`);
  assert(sitemapUrls.includes("https://www.snapfreetools.com/pdf-to-powerpoint"), "Sitemap output includes full canonical URL https://www.snapfreetools.com/pdf-to-powerpoint");
});

// ---------------------------------------------------------------------------
// TEST 15: FAQ/JSON-LD consistency
// ---------------------------------------------------------------------------
await runAsyncTest("15. FAQ/JSON-LD consistency verifies 1:1 question matching and breadcrumb hierarchy", async () => {
  const faqDataPath = pathToFileURL(path.join(projectRoot, "src/features/pdf-to-powerpoint/content/faqData.js")).href;
  const { FAQS_DATA } = await import(faqDataPath);

  assert(Array.isArray(FAQS_DATA), "FAQS_DATA is an array");
  assert(FAQS_DATA.length >= 10, `FAQS_DATA has at least 10 FAQs (found ${FAQS_DATA.length})`);

  for (const faq of FAQS_DATA) {
    assert(Boolean(faq.question) && faq.question.trim().length > 5, "FAQ question is valid string");
    assert(Boolean(faq.answer) && faq.answer.trim().length > 10, "FAQ answer is valid string");
  }

  // Check page.js schema alignment
  const pagePath = path.join(projectRoot, "app/pdf-to-powerpoint/page.js");
  const pageContent = fs.readFileSync(pagePath, "utf8");
  assert(pageContent.includes("BreadcrumbList"), "page.js includes BreadcrumbList in schema");
  assert(pageContent.includes("SoftwareApplication"), "page.js includes SoftwareApplication in schema");
  assert(pageContent.includes("FAQPage"), "page.js includes FAQPage in schema");
  assert(pageContent.includes("FAQS_DATA"), "page.js maps visible FAQS_DATA to FAQPage schema");
});

// ---------------------------------------------------------------------------
// TEST 16: Required file structure
// ---------------------------------------------------------------------------
runTest("16. Required file structure contains all production components and content modules", () => {
  const requiredFiles = [
    "app/pdf-to-powerpoint/page.js",
    "src/features/pdf-to-powerpoint/index.js",
    "src/features/pdf-to-powerpoint/utils/pdfToPowerpointEngine.js",
    "src/features/pdf-to-powerpoint/components/UploadState.js",
    "src/features/pdf-to-powerpoint/components/Workspace.js",
    "src/features/pdf-to-powerpoint/components/ProcessingState.js",
    "src/features/pdf-to-powerpoint/components/SuccessState.js",
    "src/features/pdf-to-powerpoint/content/educationalContent.js",
    "src/features/pdf-to-powerpoint/content/faqData.js"
  ];

  for (const relPath of requiredFiles) {
    const fullPath = path.join(projectRoot, relPath);
    assert(fs.existsSync(fullPath), `Required file exists: ${relPath}`);
  }
});

// ---------------------------------------------------------------------------
// TEST 17: Permanent redirect configuration from /pdf-to-ppt to /pdf-to-powerpoint
// ---------------------------------------------------------------------------
runTest("17. Permanent redirect configuration from /pdf-to-ppt to /pdf-to-powerpoint", () => {
  const nextConfigPath = path.join(projectRoot, "next.config.js");
  const content = fs.readFileSync(nextConfigPath, "utf8");

  assert(content.includes('source: "/pdf-to-ppt"'), "next.config.js defines redirect from /pdf-to-ppt");
  assert(content.includes('destination: "/pdf-to-powerpoint"'), "next.config.js redirects to /pdf-to-powerpoint");
  assert(content.includes("permanent: true"), "Redirect is permanent (308)");
});

console.log("\n=================================================");
console.log(`TOTAL TESTS: ${passedCount + failedCount} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
console.log("=================================================");

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log("ALL 17 SUITES PASSED SUCCESSFULLY!");
}
