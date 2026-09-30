import { ALL_TOOLS } from "../src/features/tools-hub/constants/allToolsRegistry.js";

console.log("=================================================");
console.log("    STARTING PHASE 5B PDF HUB DISPLAY TEST       ");
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

const PDF_TOOLS = ALL_TOOLS
  .filter(tool => tool.group === "PDF Tools")
  .map(tool => ({
    ...tool,
    shortDescription: tool.description
  }));

const liveTools = PDF_TOOLS.filter((t) => t.status === "live");
const comingSoonTools = PDF_TOOLS.filter((t) => t.status === "coming_soon");

assert(liveTools.length === 19, `19 live PDF tools present (Got: ${liveTools.length})`);
assert(comingSoonTools.length === 20, `20 coming soon PDF tools present (Got: ${comingSoonTools.length})`);

const categories = [
  {
    title: "Manage & Organize PDFs",
    tools: PDF_TOOLS.filter((t) => t.category === "Manage PDFs" || t.slug === "compress-pdf")
  },
  {
    title: "Convert PDFs",
    tools: PDF_TOOLS.filter((t) => t.category === "Convert to PDF" || t.category === "Convert from PDF")
  },
  {
    title: "Edit & Annotate PDFs",
    tools: PDF_TOOLS.filter((t) => t.category === "Edit & Annotate")
  },
  {
    title: "PDF Security",
    tools: PDF_TOOLS.filter((t) => t.category === "Security & Access")
  },
  {
    title: "PDF Utilities",
    tools: PDF_TOOLS.filter((t) => t.category === "PDF Utilities")
  }
];

let totalCategorizedTools = 0;
categories.forEach(cat => {
  const liveCount = cat.tools.filter(t => t.status === "live").length;
  const soonCount = cat.tools.filter(t => t.status === "coming_soon").length;
  totalCategorizedTools += cat.tools.length;
  console.log(`📌 Category '${cat.title}': ${liveCount} Live, ${soonCount} Coming Soon (Total: ${cat.tools.length})`);
});

assert(totalCategorizedTools === PDF_TOOLS.length, `All ${PDF_TOOLS.length} PDF tools categorized cleanly (Total: ${totalCategorizedTools})`);

console.log("\n=================================================");
console.log(`  VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("=================================================");

if (failed > 0) process.exit(1);
