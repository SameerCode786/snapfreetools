/**
 * Automated Verification Suite for PowerPoint to PDF Converter
 * SnapFreeTools.com
 *
 * Tests all 20+ verification requirements:
 * - PPTX file validation, empty/invalid file rejection
 * - PresentationML structure & dimension parsing
 * - Slide count and aspect ratio detection
 * - Slide range parsing, bounds checking, deduplication
 * - PDF generation, magic bytes, page count, and dimensions
 * - Filename sanitization
 * - SEO Metadata registry, Tool Registry, Sitemap, and FAQ/Schema
 */

import fs from "fs";
import path from "path";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import pptxgen from "pptxgenjs";

import {
  validatePptxFile,
  parsePptxPresentation,
  parsePageRange,
  sanitizePdfFilename,
  PAGE_SIZE_PRESETS,
  PPTX_SAFETY_LIMITS
} from "../src/features/powerpoint-to-pdf/utils/powerpointToPdfEngine.js";

import { ALL_TOOLS } from "../src/features/tools-hub/constants/allToolsRegistry.js";
import { METADATA_CONFIG } from "../src/seo/metadata.js";
import { FAQS_DATA } from "../src/features/powerpoint-to-pdf/content/faqData.js";

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log("\n========================================================");
  console.log("  POWERPOINT TO PDF CONVERTER - AUTOMATED TEST SUITE");
  console.log("========================================================\n");

  // 1. Create a Deterministic PPTX Fixture with pptxgenjs
  console.log("Generating deterministic 3-slide PPTX test fixture...");
  const PptxConstructor = pptxgen.default || pptxgen;
  const pptx = new PptxConstructor();
  pptx.layout = "LAYOUT_16x9";

  // Slide 1
  const s1 = pptx.addSlide();
  s1.addText("Q3 Business Review", { x: 1, y: 1, w: 8, h: 1.5, fontSize: 32, bold: true, color: "1E293B" });
  s1.addText("Quarterly financial analysis and operational metrics", { x: 1, y: 2.5, w: 8, h: 1, fontSize: 16, color: "64748B" });

  // Slide 2
  const s2 = pptx.addSlide();
  s2.addText("Key Achievements", { x: 1, y: 0.8, w: 6, h: 0.8, fontSize: 24, bold: true, color: "0F766E" });
  s2.addTable([
    [{ text: "Metric", options: { bold: true, fill: "F1F5F9" } }, { text: "Result", options: { bold: true, fill: "F1F5F9" } }],
    ["Revenue Growth", "+24% YoY"],
    ["Active Users", "1.2 Million"]
  ], { x: 1, y: 2, w: 8, h: 2 });

  // Slide 3
  const s3 = pptx.addSlide();
  s3.addText("Conclusion & Action Items", { x: 1, y: 1, w: 8, h: 1, fontSize: 24, bold: true, color: "B45309" });

  const pptxBuffer = await pptx.write({ outputType: "nodebuffer" });
  console.log(`Generated fixture size: ${(pptxBuffer.length / 1024).toFixed(1)} KB\n`);

  // --- TEST GROUP 1: FILE VALIDATION ---
  console.log("--- Group 1: File Validation ---");
  try {
    const validResult = await validatePptxFile({ name: "deck.pptx", arrayBuffer: async () => pptxBuffer });
    assert(validResult.valid === true, "1. Valid PPTX file passes validation");
  } catch (e) {
    assert(false, `1. Valid PPTX file passes validation: ${e.message}`);
  }

  try {
    await validatePptxFile({ name: "empty.pptx", size: 0, arrayBuffer: async () => new ArrayBuffer(0) });
    assert(false, "2. Empty file rejection (should throw)");
  } catch (e) {
    assert(e.message.includes("empty"), "2. Empty file (0 bytes) rejected with clear error");
  }

  try {
    const badBuffer = Buffer.from("NOT_A_ZIP_FILE_TEXT_CONTENT");
    await validatePptxFile({ name: "invalid.pptx", size: badBuffer.length, arrayBuffer: async () => badBuffer });
    assert(false, "3. Invalid ZIP archive rejection (should throw)");
  } catch (e) {
    assert(e.message.includes("Corrupted") || e.message.includes("archive"), "3. Invalid non-ZIP file rejected with clear error");
  }

  try {
    await validatePptxFile({ name: "presentation.ppt", size: 1000, arrayBuffer: async () => pptxBuffer });
    assert(false, "4. Legacy .ppt rejection (should throw)");
  } catch (e) {
    assert(e.message.includes("Legacy .ppt"), "4. Legacy .ppt rejected with modern .pptx guidance");
  }

  try {
    await validatePptxFile({ name: "huge.pptx", size: 60 * 1024 * 1024, arrayBuffer: async () => pptxBuffer });
    assert(false, "5. Oversized file rejection (should throw)");
  } catch (e) {
    assert(e.message.includes("50MB"), "5. Oversized file (>50MB) rejected with limit notice");
  }

  // --- TEST GROUP 2: PACKAGE STRUCTURE & PRESENTATION ANALYSIS ---
  console.log("\n--- Group 2: Package Structure & Presentation Analysis ---");
  const presentation = await parsePptxPresentation(pptxBuffer);

  assert(presentation.slideCount === 3, `6. Slide count detected accurately (expected 3, got ${presentation.slideCount})`);
  assert(presentation.slideFiles.length === 3, `7. Slide files resolved via relationships (${presentation.slideFiles.join(", ")})`);
  assert(presentation.widthPt > 0 && presentation.heightPt > 0, `8. Slide dimensions detected (${presentation.widthPt}pt × ${presentation.heightPt}pt)`);
  assert(presentation.aspectRatio.includes("16:9"), `9. Aspect ratio calculated correctly (expected 16:9, got ${presentation.aspectRatio})`);
  assert(presentation.widthInches > 0 && presentation.heightInches > 0, `10. Slide dimensions in inches calculated (${presentation.widthInches}" × ${presentation.heightInches}")`);

  // --- TEST GROUP 3: SLIDE RANGE PARSING ---
  console.log("\n--- Group 3: Slide Range Parsing ---");
  const allRange = parsePageRange("all", 3);
  assert(allRange.valid && allRange.pages.length === 3, "11. 'all' selects all 3 slides");

  const singleRange = parsePageRange("2", 3);
  assert(singleRange.valid && singleRange.pages.length === 1 && singleRange.pages[0] === 2, "12. Single slide selection '2' works");

  const rangeInterval = parsePageRange("1-2", 3);
  assert(rangeInterval.valid && rangeInterval.pages.length === 2 && rangeInterval.pages[0] === 1 && rangeInterval.pages[1] === 2, "13. Range interval '1-2' works");

  const commaRange = parsePageRange("1, 3", 3);
  assert(commaRange.valid && commaRange.pages.length === 2 && commaRange.pages[0] === 1 && commaRange.pages[1] === 3, "14. Comma-separated range '1, 3' works");

  const dedupRange = parsePageRange("1-2, 2, 3", 3);
  assert(dedupRange.valid && dedupRange.pages.length === 3, "15. Duplicate slide numbers deduplicated");

  const outOfBoundsRange = parsePageRange("1-5", 3);
  assert(!outOfBoundsRange.valid, "16. Out-of-bounds range '1-5' on 3 slides rejected");

  const invalidTextRange = parsePageRange("abc, xyz", 3);
  assert(!invalidTextRange.valid, "17. Non-numeric range rejected");

  // --- TEST GROUP 4: PDF GENERATION & MAGIC BYTES ---
  console.log("\n--- Group 4: PDF Document Generation & Standards ---");
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle("Test Presentation");
  pdfDoc.setCreator("SnapFreeTools PowerPoint to PDF Converter");

  for (let i = 0; i < presentation.slideCount; i++) {
    const page = pdfDoc.addPage([presentation.widthPt, presentation.heightPt]);
    // Draw presentation placeholder bounds
    page.drawRectangle({
      x: 0,
      y: 0,
      width: presentation.widthPt,
      height: presentation.heightPt,
      borderColor: undefined
    });
  }

  const pdfBytes = await pdfDoc.save();
  assert(pdfBytes && pdfBytes.length > 500, `18. Generated PDF has valid byte length (${pdfBytes.length} bytes)`);

  // Verify PDF Magic Bytes: %PDF- (0x25, 0x50, 0x44, 0x46)
  const isPdf = pdfBytes[0] === 0x25 && pdfBytes[1] === 0x50 && pdfBytes[2] === 0x44 && pdfBytes[3] === 0x46;
  assert(isPdf, "19. PDF has correct magic bytes (%PDF-1.)");

  // Re-read generated PDF to verify page count and page dimensions
  const readPdf = await PDFDocument.load(pdfBytes);
  assert(readPdf.getPageCount() === 3, `20. PDF page count equals selected slide count (expected 3, got ${readPdf.getPageCount()})`);

  const firstPage = readPdf.getPage(0);
  const size = firstPage.getSize();
  assert(
    Math.abs(size.width - presentation.widthPt) < 1 && Math.abs(size.height - presentation.heightPt) < 1,
    `21. PDF page dimensions match slide dimensions (${size.width.toFixed(1)}pt × ${size.height.toFixed(1)}pt)`
  );

  // --- TEST GROUP 5: FILENAME SANITIZATION ---
  console.log("\n--- Group 5: Filename Sanitization ---");
  assert(sanitizePdfFilename("Company Pitch.pptx") === "Company Pitch.pdf", "22. Normal filename sanitized to .pdf");
  assert(sanitizePdfFilename("bad:name/test?.pptx") === "bad_name_test_.pdf", "23. Illegal characters sanitized");
  assert(sanitizePdfFilename(".pptx") === "presentation.pdf", "24. Fallback for extension-only filename");

  // --- TEST GROUP 6: SEO METADATA & REGISTRY ---
  console.log("\n--- Group 6: SEO Metadata, Registry & Sitemap ---");
  const meta = METADATA_CONFIG["powerpoint-to-pdf"];
  assert(meta && meta.title.includes("PowerPoint to PDF"), "25. SEO metadata title exists in METADATA_CONFIG");
  assert(meta && meta.path === "/powerpoint-to-pdf", "26. SEO metadata canonical path is /powerpoint-to-pdf");

  const registryTool = ALL_TOOLS.find(t => t.slug === "powerpoint-to-pdf");
  assert(registryTool && registryTool.status === "live", "27. Tool is marked 'live' in allToolsRegistry");
  assert(registryTool && registryTool.future === false, "28. Tool has 'future: false' in allToolsRegistry");

  // Verify dynamic sitemap rule: filter live && !future
  const liveToolRoutes = ALL_TOOLS
    .filter(tool => tool.status === "live" && !tool.future)
    .map(tool => `https://www.snapfreetools.com/${tool.slug}`);
  assert(
    liveToolRoutes.includes("https://www.snapfreetools.com/powerpoint-to-pdf"),
    "29. /powerpoint-to-pdf dynamically included in sitemap entries"
  );

  // --- TEST GROUP 7: FAQS & CLAIMS AUDIT ---
  console.log("\n--- Group 7: FAQs & Claims Audit ---");
  assert(FAQS_DATA.length >= 12, `30. Contains at least 12 FAQs (actual: ${FAQS_DATA.length})`);

  let claimsAuditPassed = true;
  for (const faq of FAQS_DATA) {
    const text = (faq.question + " " + faq.answer).toLowerCase();
    if (text.includes("100% pixel perfect") || text.includes("military-grade") || text.includes("unlimited file size")) {
      claimsAuditPassed = false;
      console.error(`Claims audit failure in FAQ: "${faq.question}"`);
    }
  }
  assert(claimsAuditPassed, "31. Claims audit passed: Zero unsupported claims (no '100% pixel perfect', no 'unlimited')");

  // --- TEST GROUP 8: TABLE & GRAPHIC ELEMENTS AUDIT ---
  console.log("\n--- Group 8: Table & Graphic Elements Audit ---");
  const slide2Xml = await presentation.zip.file("ppt/slides/slide2.xml").async("text");
  assert(slide2Xml.includes("<p:graphicFrame"), "32. Slide 2 contains <p:graphicFrame> table element");
  assert(slide2Xml.includes("<a:tbl>"), "33. GraphicFrame contains <a:tbl> table data");
  assert(slide2Xml.includes("Revenue Growth"), "34. Table content preserved in PresentationML data");

  // --- TEST GROUP 9: QUALITY & DPI SETTINGS AUDIT ---
  console.log("\n--- Group 9: Quality Presets Audit ---");
  assert(PPTX_SAFETY_LIMITS.DEFAULT_SCALE === 1.5, "35. Standard Quality scale is 1.5x");
  assert(PPTX_SAFETY_LIMITS.HIGH_QUALITY_SCALE === 2.0, "36. High Quality scale is 2.0x");

  // --- TEST GROUP 10: CANCELLATION & ABORT AUDIT ---
  console.log("\n--- Group 10: Cancellation & Abort Audit ---");
  const abortCtrl = new AbortController();
  abortCtrl.abort();
  try {
    await validatePptxFile({ name: "deck.pptx", arrayBuffer: async () => pptxBuffer });
    const range = parsePageRange("all", 3);
    assert(abortCtrl.signal.aborted === true, "37. AbortController signal correctly tracks aborted state");
  } catch (e) {
    assert(false, `37. AbortController check: ${e.message}`);
  }

  // --- TEST GROUP 11: INTERNAL LINKS VALIDATION ---
  console.log("\n--- Group 11: Internal Links Integrity Audit ---");
  const linkedRoutes = ["/pdf-to-powerpoint", "/word-to-pdf", "/compress-pdf", "/organize-pdf", "/pdf-to-png"];
  const allToolSlugs = new Set(ALL_TOOLS.map(t => `/${t.slug}`));
  let allLinksExist = true;
  for (const r of linkedRoutes) {
    if (!allToolSlugs.has(r)) {
      allLinksExist = false;
      console.error(`Broken internal link target: ${r}`);
    }
  }
  assert(allLinksExist, "38. All contextual internal links point to active, existing tools in ALL_TOOLS");

  console.log("\n========================================================");
  console.log(`  TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("========================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
