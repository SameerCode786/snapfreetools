import { ALL_TOOLS } from "../src/features/tools-hub/constants/allToolsRegistry.js";

const pdfTools = ALL_TOOLS.filter((t) => t.group === "PDF Tools");
const livePdfTools = pdfTools.filter((t) => t.status === "live");
const soonPdfTools = pdfTools.filter((t) => t.status === "soon");

console.log("Total PDF Tools:", pdfTools.length);
console.log("Live PDF Tools count:", livePdfTools.length);
console.log("Coming Soon PDF Tools count:", soonPdfTools.length);

console.log("Live PDF Tools slugs:", livePdfTools.map(t => t.slug));
console.log("Coming Soon PDF Tools slugs:", soonPdfTools.map(t => t.slug));

// Check duplicates
const slugs = ALL_TOOLS.map(t => t.slug);
const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
console.log("Duplicate slugs:", duplicateSlugs);

if (livePdfTools.length === 15 && soonPdfTools.length === 4 && duplicateSlugs.length === 0) {
  console.log("REGISTRY VERIFICATION: PASS (15 Live, 4 Soon, 0 Duplicates)");
} else {
  console.error("REGISTRY VERIFICATION: FAIL");
  process.exit(1);
}
