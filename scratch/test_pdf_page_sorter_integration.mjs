import fs from "fs";
import path from "path";

import { PDF_PAGE_SORTER_FAQS } from "../src/features/pdf-page-sorter/content/faqs.js";
import { parsePdfMetadata, executePdfPageSorter } from "../src/features/pdf-page-sorter/utils/pdfPageSorterEngine.js";

console.log("=================================================");
console.log("   STARTING PDF PAGE SORTER INTEGRATION TESTS   ");
console.log("=================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    failed++;
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

function pass(testName) {
  passed++;
  console.log(`✅ PASS: ${testName}`);
}

async function runTests() {
  const featureDir = path.resolve("src/features/pdf-page-sorter");
  const pageFile = path.resolve("app/pdf-page-sorter/page.js");

  // --- TEST 1: Feature Orchestrator File Existence ---
  try {
    assert(fs.existsSync(path.join(featureDir, "index.js")), "src/features/pdf-page-sorter/index.js must exist");
    assert(fs.existsSync(pageFile), "app/pdf-page-sorter/page.js must exist");
    pass("Test 1: Feature Orchestrator and Route Files Exist");
  } catch (e) {
    console.error("Test 1 Failed:", e.message);
  }

  // --- TEST 2: Feature Orchestrator UI & Engine Connections ---
  try {
    const indexContent = fs.readFileSync(path.join(featureDir, "index.js"), "utf8");
    assert(indexContent.includes("UploadState"), "index.js must import UploadState");
    assert(indexContent.includes("PageSorterWorkspace"), "index.js must import PageSorterWorkspace");
    assert(indexContent.includes("ProcessingState"), "index.js must import ProcessingState");
    assert(indexContent.includes("PageSorterSuccess"), "index.js must import PageSorterSuccess");
    assert(indexContent.includes("parsePdfMetadata"), "index.js must import parsePdfMetadata from engine");
    pass("Test 2: Feature Orchestrator UI & Engine Connections Verified");
  } catch (e) {
    console.error("Test 2 Failed:", e.message);
  }

  // --- TEST 3: Route SEO & Structured Data Wiring ---
  try {
    const pageContent = fs.readFileSync(pageFile, "utf8");
    assert(pageContent.includes("generatePageMetadata"), "page.js must call generatePageMetadata");
    assert(pageContent.includes("JsonLd"), "page.js must include JsonLd component");
    assert(pageContent.includes("SoftwareApplication"), "page.js must include SoftwareApplication schema");
    assert(pageContent.includes("BreadcrumbList"), "page.js must include BreadcrumbList schema");
    assert(pageContent.includes("FAQPage"), "page.js must include FAQPage schema");
    pass("Test 3: App Router Page SEO & JSON-LD Structured Data Wiring");
  } catch (e) {
    console.error("Test 3 Failed:", e.message);
  }

  // --- TEST 4: Educational Content & Internal Links ---
  try {
    const eduPath = path.join(featureDir, "content/educationalContent.js");
    assert(fs.existsSync(eduPath), "educationalContent.js must exist");
    const eduContent = fs.readFileSync(eduPath, "utf8");
    assert(eduContent.includes("3 simple steps") || eduContent.includes("How to Sort PDF Pages"), "educationalContent.js must contain 3-step guide");
    assert(eduContent.includes("/organize-pdf"), "educationalContent.js must include internal link to /organize-pdf");
    assert(eduContent.includes("/reverse-pdf-pages"), "educationalContent.js must include internal link to /reverse-pdf-pages");
    pass("Test 4: Educational Content & Internal Linking Structure");
  } catch (e) {
    console.error("Test 4 Failed:", e.message);
  }

  // --- TEST 5: FAQ Array Consistency ---
  try {
    assert(Array.isArray(PDF_PAGE_SORTER_FAQS), "PDF_PAGE_SORTER_FAQS must be an array");
    assert(PDF_PAGE_SORTER_FAQS.length >= 10, `Expected at least 10 FAQs, got ${PDF_PAGE_SORTER_FAQS.length}`);
    for (const f of PDF_PAGE_SORTER_FAQS) {
      assert(f.question && f.answer, "Each FAQ item must have question and answer");
    }
    pass("Test 5: FAQ Array Consistency & Schema Parity");
  } catch (e) {
    console.error("Test 5 Failed:", e.message);
  }

  // --- TEST 6: Memory Clean & Reset Wiring ---
  try {
    const indexContent = fs.readFileSync(path.join(featureDir, "index.js"), "utf8");
    assert(indexContent.includes("URL.revokeObjectURL"), "Reset handler must revoke download Object URLs");
    pass("Test 6: Memory Cleanup & Object URL Revocation Wiring");
  } catch (e) {
    console.error("Test 6 Failed:", e.message);
  }

  // --- TEST 7: Tools Registry Activation ---
  try {
    const registryContent = fs.readFileSync("src/features/tools-hub/constants/allToolsRegistry.js", "utf8");
    assert(registryContent.includes('id: "pdf-page-sorter"'), "pdf-page-sorter entry exists in tools registry");
    assert(registryContent.includes('status: "live"'), "pdf-page-sorter registry status must be live");
    pass("Test 7: Verified Registry Activation (status is live)");
  } catch (e) {
    console.error("Test 7 Failed:", e.message);
  }

  // --- TEST 8: SEO Metadata Registry Entry ---
  try {
    const metadataContent = fs.readFileSync("src/seo/metadata.js", "utf8");
    assert(metadataContent.includes('"pdf-page-sorter"'), "src/seo/metadata.js must contain pdf-page-sorter configuration");
    assert(metadataContent.includes("PDF Page Sorter Free"), "Metadata title matches target specification");
    pass("Test 8: SEO Metadata Entry Configuration Verified");
  } catch (e) {
    console.error("Test 8 Failed:", e.message);
  }

  console.log("\n=================================================");
  console.log(`INTEGRATION TESTS COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal Integration Test Error:", err);
  process.exit(1);
});
