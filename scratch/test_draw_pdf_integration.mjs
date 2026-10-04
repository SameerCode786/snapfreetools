import fs from "fs";
import path from "path";

import { DRAW_PDF_FAQS } from "../src/features/draw-on-pdf/content/faqs.js";
import { parsePdfMetadata, exportAnnotationsToPdf } from "../src/features/draw-on-pdf/utils/drawPdfEngine.js";
import { screenToPdfPoint, pdfToScreenPoint } from "../src/features/draw-on-pdf/utils/drawingMath.js";

console.log("=================================================");
console.log("   STARTING DRAW ON PDF FULL FEATURE INTEGRATION  ");
console.log("=================================================\n");

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (!condition) {
    failedCount++;
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

function pass(testName) {
  passedCount++;
  console.log(`✅ PASS: ${testName}`);
}

async function runTests() {
  const featureDir = path.resolve("src/features/draw-on-pdf");
  const pageFile = path.resolve("app/draw-on-pdf/page.js");

  // --- TEST 1: Feature Orchestrator File Existence ---
  try {
    assert(fs.existsSync(path.join(featureDir, "index.js")), "src/features/draw-on-pdf/index.js must exist");
    assert(fs.existsSync(pageFile), "app/draw-on-pdf/page.js must exist");
    pass("Test 1: Feature Orchestrator and Route Files Exist");
  } catch (e) {
    console.error("Test 1 Failed:", e.message);
  }

  // --- TEST 2: Index Feature Imports Wiring ---
  try {
    const indexContent = fs.readFileSync(path.join(featureDir, "index.js"), "utf8");
    assert(indexContent.includes("UploadState"), "index.js must import UploadState");
    assert(indexContent.includes("DrawPdfWorkspace"), "index.js must import DrawPdfWorkspace");
    assert(indexContent.includes("ProcessingState"), "index.js must import ProcessingState");
    assert(indexContent.includes("DrawPdfSuccess"), "index.js must import DrawPdfSuccess");
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

  // --- TEST 4: Stage Machine State Transitions ---
  try {
    const indexContent = fs.readFileSync(path.join(featureDir, "index.js"), "utf8");
    const requiredStages = ["upload", "workspace", "processing", "success"];
    for (const st of requiredStages) {
      assert(indexContent.includes(`"${st}"`), `index.js must contain state transition for stage '${st}'`);
    }
    pass("Test 4: Stage Machine Lifecycle States (Upload -> Workspace -> Processing -> Success)");
  } catch (e) {
    console.error("Test 4 Failed:", e.message);
  }

  // --- TEST 5: Educational Content Exports ---
  try {
    assert(fs.existsSync(path.join(featureDir, "content/educationalContent.js")), "educationalContent.js must exist");
    const eduContent = fs.readFileSync(path.join(featureDir, "content/educationalContent.js"), "utf8");
    assert(eduContent.includes("3 simple steps") || eduContent.includes("How to Draw on a PDF Online"), "educationalContent.js must contain usage guide");
    assert(eduContent.includes("/sign-pdf"), "educationalContent.js must include internal link to /sign-pdf");
    pass("Test 5: Educational Content & Internal Linking Structure");
  } catch (e) {
    console.error("Test 5 Failed:", e.message);
  }

  // --- TEST 6: FAQ Array Consistency & Schema Parity ---
  try {
    assert(Array.isArray(DRAW_PDF_FAQS), "DRAW_PDF_FAQS must be an array");
    assert(DRAW_PDF_FAQS.length >= 8, `Expected at least 8 FAQs, got ${DRAW_PDF_FAQS.length}`);
    for (const f of DRAW_PDF_FAQS) {
      assert(f.question && f.answer, "Each FAQ item must have question and answer");
    }
    pass("Test 6: FAQ Array Consistency & Schema Parity");
  } catch (e) {
    console.error("Test 6 Failed:", e.message);
  }

  // --- TEST 7: Memory Clean & Reset Wiring ---
  try {
    const indexContent = fs.readFileSync(path.join(featureDir, "index.js"), "utf8");
    assert(indexContent.includes("URL.revokeObjectURL"), "Reset handler must revoke download Object URLs");
    pass("Test 7: Memory Cleanup & Object URL Revocation Wiring");
  } catch (e) {
    console.error("Test 7 Failed:", e.message);
  }

  // --- TEST 8: Error Catching Wiring ---
  try {
    const indexContent = fs.readFileSync(path.join(featureDir, "index.js"), "utf8");
    assert(indexContent.includes("PASSWORD_PROTECTED"), "Password-protected PDF error must be caught");
    assert(indexContent.includes("setFileError"), "User-friendly file error state must be set");
    pass("Test 8: Password Protection & Corruption Error Handling Wiring");
  } catch (e) {
    console.error("Test 8 Failed:", e.message);
  }

  // --- TEST 9: Phase 1 Engine Connectivity ---
  try {
    assert(typeof parsePdfMetadata === "function", "Engine parsePdfMetadata connected");
    assert(typeof exportAnnotationsToPdf === "function", "Engine exportAnnotationsToPdf connected");
    pass("Test 9: Phase 1 Engine Connection Verified");
  } catch (e) {
    console.error("Test 9 Failed:", e.message);
  }

  // --- TEST 10: Phase 1 Math Connectivity ---
  try {
    assert(typeof screenToPdfPoint === "function", "Math screenToPdfPoint connected");
    assert(typeof pdfToScreenPoint === "function", "Math pdfToScreenPoint connected");
    pass("Test 10: Phase 1 Math Connection Verified");
  } catch (e) {
    console.error("Test 10 Failed:", e.message);
  }

  // --- TEST 11: Registry Live Status Verification ---
  try {
    const registryContent = fs.readFileSync("src/features/tools-hub/constants/allToolsRegistry.js", "utf8");
    assert(registryContent.includes('id: "draw-on-pdf"'), "draw-on-pdf entry exists in tools registry");
    assert(registryContent.includes('status: "live"'), "draw-on-pdf registry status must be live in Phase 5");
    pass("Test 11: Verified Registry Activation (status is live)");
  } catch (e) {
    console.error("Test 11 Failed:", e.message);
  }

  // --- TEST 12: SEO Metadata Registry Configuration ---
  try {
    const metadataContent = fs.readFileSync("src/seo/metadata.js", "utf8");
    assert(metadataContent.includes('"draw-on-pdf"'), "src/seo/metadata.js must contain draw-on-pdf configuration");
    assert(metadataContent.includes("Draw on PDF Online Free"), "Metadata title matches target specification");
    pass("Test 12: SEO Metadata Entry Configuration Verified");
  } catch (e) {
    console.error("Test 12 Failed:", e.message);
  }

  console.log("\n=================================================");
  console.log(`FULL FEATURE INTEGRATION TESTS COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("=================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal Integration Test Runner Error:", err);
  process.exit(1);
});
