import { ALL_TOOLS } from "../src/features/tools-hub/constants/allToolsRegistry.js";
import * as LucideIcons from "lucide-react";

console.log("=================================================");
console.log("   STARTING PHASE 5A REGISTRY VERIFICATION TEST   ");
console.log("=================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (!condition) {
    failed++;
    console.error(`❌ FAIL: ${msg}`);
  } else {
    passed++;
    console.log(`✅ PASS: ${msg}`);
  }
}

const targetSlugs = [
  "pdf-to-png",
  "png-to-pdf",
  "pdf-to-ppt",
  "ppt-to-pdf",
  "html-to-pdf",
  "pdf-to-pdfa",
  "crop-pdf",
  "resize-pdf",
  "add-text-to-pdf",
  "highlight-pdf",
  "draw-on-pdf",
  "fill-pdf-forms",
  "pdf-to-grayscale",
  "extract-pdf-pages",
  "reverse-pdf-pages",
  "pdf-page-sorter",
  "redact-pdf",
  "remove-pdf-password",
  "flatten-pdf",
  "repair-pdf"
];

// 1. Verify all 20 slugs are present in registry
assert(targetSlugs.length === 20, "20 target slugs listed");

const registrySlugs = ALL_TOOLS.map(t => t.slug);
const missingSlugs = targetSlugs.filter(s => !registrySlugs.includes(s));
assert(missingSlugs.length === 0, `All 20 slugs present in registry (Missing: ${missingSlugs.join(", ")})`);

// 2. Check no duplicate slugs in ALL_TOOLS
const duplicates = registrySlugs.filter((item, index) => registrySlugs.indexOf(item) !== index);
assert(duplicates.length === 0, `No duplicate slugs in ALL_TOOLS (Duplicates: ${duplicates.join(", ")})`);

// 3. Verify status === 'coming_soon' and future === true for all 20 tools
targetSlugs.forEach(slug => {
  const tool = ALL_TOOLS.find(t => t.slug === slug);
  if (tool) {
    assert(tool.status === "coming_soon", `Tool '${slug}' status is 'coming_soon'`);
    assert(tool.future === true, `Tool '${slug}' future flag is true`);
    assert(Boolean(LucideIcons[tool.icon]), `Tool '${slug}' icon '${tool.icon}' is valid in Lucide Icons`);
  }
});

// 4. Verify getLiveTools logic excludes all 20 tools
const liveTools = ALL_TOOLS.filter(t => t.status === "live" && !t.future);
const liveSlugs = liveTools.map(t => t.slug);
const unexpectedLive = targetSlugs.filter(s => liveSlugs.includes(s));
assert(unexpectedLive.length === 0, `None of the 20 tools are in live tools (Unexpected Live: ${unexpectedLive.join(", ")})`);

// 5. Verify PDF Tools group contains all 20 tools
const pdfTools = ALL_TOOLS.filter(t => t.group === "PDF Tools");
const pdfToolSlugs = pdfTools.map(t => t.slug);
const missingInPdfHub = targetSlugs.filter(s => !pdfToolSlugs.includes(s));
assert(missingInPdfHub.length === 0, `PDF Tools list contains all 20 catalog entries`);

console.log("\n=================================================");
console.log(`  VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("=================================================");

if (failed > 0) {
  process.exit(1);
}
