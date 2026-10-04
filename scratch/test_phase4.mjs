import { DRAW_PDF_FAQS } from '../src/features/draw-on-pdf/content/faqs.js';
import { generatePageMetadata } from '../src/seo/metadata.js';

console.log("=== FAQS VALIDATION ===");
console.log("Total FAQs:", DRAW_PDF_FAQS.length);
DRAW_PDF_FAQS.forEach((faq, index) => {
  console.log(`[FAQ ${index + 1}] Q: ${faq.question}`);
  console.log(`         A: ${faq.answer}`);
});

console.log("\n=== METADATA VALIDATION ===");
const meta = generatePageMetadata("draw-on-pdf");
console.log("Title:", meta.title);
console.log("Description:", meta.description);
console.log("Canonical URL:", meta.alternates.canonical);
console.log("Open Graph Title:", meta.openGraph.title);
console.log("Twitter Card:", meta.twitter.card);
console.log("Robots:", meta.robots);
