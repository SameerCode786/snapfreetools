import { ALL_TOOLS } from "../src/features/tools-hub/constants/allToolsRegistry.js";
import { EXTRACT_PDF_FAQS } from "../src/features/extract-pdf-pages/content/faqs.js";

async function runIntegrationTests() {
  console.log("=================================================");
  console.log("   STARTING EXTRACT PDF INTEGRATION TEST SUITE   ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, message = "") {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} - ${message}`);
      failed++;
    }
  }

  // 1. Verify Registry Status
  const toolEntry = ALL_TOOLS.find((t) => t.slug === "extract-pdf-pages");
  assert(
    toolEntry !== undefined,
    "Test 1: Tool Registry Entry Exists",
    "extract-pdf-pages not found in ALL_TOOLS registry."
  );
  assert(
    toolEntry?.status === "live",
    "Test 2: Tool Registry Status is 'live'",
    `Expected status 'live', got '${toolEntry?.status}'`
  );
  assert(
    toolEntry?.future === false,
    "Test 3: Tool Registry Future Flag is false",
    `Expected future false, got ${toolEntry?.future}`
  );

  // 2. Verify PDF Hub Listing
  const livePdfTools = ALL_TOOLS.filter((t) => t.group === "PDF Tools" && t.status === "live");
  const isListedInHub = livePdfTools.some((t) => t.slug === "extract-pdf-pages");
  assert(
    isListedInHub,
    "Test 4: Extract PDF Pages Appears in Live PDF Tools Hub Catalog",
    "Tool is not listed in live PDF tools catalog."
  );

  // 3. Verify FAQs content
  assert(
    Array.isArray(EXTRACT_PDF_FAQS) && EXTRACT_PDF_FAQS.length >= 6,
    "Test 5: FAQs Array is Populated with Real Questions",
    `Expected at least 6 FAQs, got ${EXTRACT_PDF_FAQS?.length}`
  );

  // 4. Verify Registry SEO titles
  assert(
    toolEntry?.seoTitle && toolEntry.seoTitle.includes("Extract PDF Pages"),
    "Test 6: Registry SEO Title Contains Tool Name",
    `seoTitle: ${toolEntry?.seoTitle}`
  );

  console.log("\n=================================================");
  console.log(`INTEGRATION TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runIntegrationTests();
