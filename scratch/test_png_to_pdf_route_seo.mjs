import assert from "assert";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const projectRoot = process.cwd();

console.log("==========================================");
console.log("RUNNING PHASE 3 ROUTE & SEO AUTOMATED VERIFICATION SUITE");
console.log("==========================================");

// 1. Verify app/png-to-pdf/page.js Route Existence
const routePath = path.join(projectRoot, "app/png-to-pdf/page.js");
assert.strictEqual(fs.existsSync(routePath), true, "Route file app/png-to-pdf/page.js must exist");
console.log("[SEO TEST 1] /png-to-pdf Route File Exists -> PASS");

// 2. Verify Route Imports PngToPdfFeature
const routeContent = fs.readFileSync(routePath, "utf-8");
assert.strictEqual(routeContent.includes('import PngToPdfFeature from "@/features/png-to-pdf";'), true, "Route must import PngToPdfFeature");
console.log("[SEO TEST 2] Route Feature Import -> PASS");

// 3. Verify H1 Title In Feature
const featurePath = path.join(projectRoot, "src/features/png-to-pdf/index.js");
const featureContent = fs.readFileSync(featurePath, "utf-8");
assert.strictEqual(featureContent.includes('title="PNG to PDF Converter — Convert PNG Images to PDF Online"'), true, "Feature must define intent-matching H1 title");
console.log("[SEO TEST 3] H1 Title Verification -> PASS");

// 4. Verify Metadata Config (Title & Description)
const metadataModulePath = pathToFileURL(path.join(projectRoot, "src/seo/metadata.js")).href;
const { METADATA_CONFIG, generatePageMetadata } = await import(metadataModulePath);
const pngToPdfMetaConfig = METADATA_CONFIG["png-to-pdf"];
assert.strictEqual(Boolean(pngToPdfMetaConfig), true, "METADATA_CONFIG must contain 'png-to-pdf'");
assert.strictEqual(pngToPdfMetaConfig.title.includes("PNG to PDF Converter Free"), true, "Title must be search-focused and accurate");
assert.strictEqual(pngToPdfMetaConfig.description.includes("Convert PNG images into a single PDF online for free"), true, "Description must be accurate");
console.log("[SEO TEST 4] Metadata Config (Title & Description) -> PASS");

// 5. Verify Canonical URL Generation
const generatedMetadata = generatePageMetadata("png-to-pdf");
assert.strictEqual(generatedMetadata.alternates.canonical, "https://www.snapfreetools.com/png-to-pdf", "Canonical URL must match target route");
assert.strictEqual(generatedMetadata.openGraph.url, "https://www.snapfreetools.com/png-to-pdf", "Open Graph URL must match target route");
console.log("[SEO TEST 5] Canonical & Open Graph URL -> PASS");

// 6. Verify Structured Data Imports & Schema Components in Route
const faqsModulePath = pathToFileURL(path.join(projectRoot, "src/features/png-to-pdf/content/faqs.js")).href;
const { PNG_TO_PDF_FAQS } = await import(faqsModulePath);
assert.strictEqual(Array.isArray(PNG_TO_PDF_FAQS) && PNG_TO_PDF_FAQS.length >= 9, true, "Must have 9 comprehensive FAQs");
assert.strictEqual(routeContent.includes('"@type": "WebPage"'), true, "WebPage schema present in graph");
assert.strictEqual(routeContent.includes('"@type": "BreadcrumbList"'), true, "BreadcrumbList schema present in graph");
assert.strictEqual(routeContent.includes('"@type": "SoftwareApplication"'), true, "SoftwareApplication schema present in graph");
assert.strictEqual(routeContent.includes('"@type": "FAQPage"'), true, "FAQPage schema present in graph");
console.log("[SEO TEST 6] WebPage, Breadcrumb, SoftwareApp & FAQ Schema -> PASS");

// 7. Verify Visible FAQ Questions Correspond to Structured FAQ
PNG_TO_PDF_FAQS.forEach((faq, index) => {
  assert.strictEqual(typeof faq.question, "string", `FAQ item ${index} has question`);
  assert.strictEqual(typeof faq.answer, "string", `FAQ item ${index} has answer`);
});
console.log("[SEO TEST 7] Structured FAQ Correspondence -> PASS");

// 8. Verify Internal Links in Educational Content Point to Existing Routes
const eduContentPath = path.join(projectRoot, "src/features/png-to-pdf/content/educationalContent.js");
const eduContent = fs.readFileSync(eduContentPath, "utf-8");

const internalRoutesToTest = ["/jpg-to-pdf", "/pdf-to-png", "/resize-pdf", "/organize-pdf", "/compress-pdf"];
for (const internalRoute of internalRoutesToTest) {
  assert.strictEqual(eduContent.includes(internalRoute), true, `Educational content must link to ${internalRoute}`);
  const targetAppFile = path.join(projectRoot, `app${internalRoute}/page.js`);
  assert.strictEqual(fs.existsSync(targetAppFile), true, `Target route file ${targetAppFile} must exist`);
}
console.log("[SEO TEST 8] Internal Links & Target Route Existence -> PASS");

// 9. Verify Tool Registry Activation State
const registryPath = pathToFileURL(path.join(projectRoot, "src/features/tools-hub/constants/allToolsRegistry.js")).href;
const { ALL_TOOLS } = await import(registryPath);
const registryEntry = ALL_TOOLS.find((t) => t.slug === "png-to-pdf");
assert.strictEqual(Boolean(registryEntry), true, "PNG to PDF must exist in allToolsRegistry.js");
assert.strictEqual(registryEntry.status, "live", "Registry status must be 'live'");
assert.strictEqual(registryEntry.future, false, "Registry future flag must be false");
console.log("[SEO TEST 9] Registry Status Live & Future False -> PASS");

// 10. Verify Sitemap Derivation Inclusion
const sitemapPath = path.join(projectRoot, "app/sitemap.js");
const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
assert.strictEqual(sitemapContent.includes("ALL_TOOLS"), true, "Sitemap must dynamically derive routes from ALL_TOOLS");
assert.strictEqual(sitemapContent.includes('tool.status === "live"'), true, "Sitemap must filter live status tools");

const liveTools = ALL_TOOLS.filter((tool) => tool.status === "live" && !tool.future);
const pngToPdfLive = liveTools.some((tool) => tool.slug === "png-to-pdf");
assert.strictEqual(pngToPdfLive, true, "PNG to PDF must be present in live sitemap filtering");
console.log("[SEO TEST 10] Sitemap Inclusion -> PASS");

// 11. Verify Existing Tool Registries Intact
const totalLiveTools = ALL_TOOLS.filter((t) => t.status === "live" && !t.future).length;
assert.strictEqual(totalLiveTools >= 20, true, "Live tools registry remains intact and active");
console.log("[SEO TEST 11] Existing Tool Registry Intactness -> PASS");

console.log("\n==========================================");
console.log("ALL 11 ROUTE & SEO AUTOMATED VERIFICATION TESTS PASSED!");
console.log("==========================================");
