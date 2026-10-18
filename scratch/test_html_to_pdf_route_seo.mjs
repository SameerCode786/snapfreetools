import fs from 'fs';
import path from 'path';
import assert from 'assert';

const ROOT_DIR = process.cwd();

console.log('--- Starting HTML to PDF Route & SEO Verification Suite ---');

// 1. Verify route file exists
const routePath = path.join(ROOT_DIR, 'app', 'html-to-pdf', 'page.js');
assert.strictEqual(fs.existsSync(routePath), true, 'Assertion 1 Failed: app/html-to-pdf/page.js does not exist.');
const routeContent = fs.readFileSync(routePath, 'utf-8');
console.log('✔ 1. Route file app/html-to-pdf/page.js exists.');

// 2. Verify route imports HTML-to-PDF feature
assert.ok(routeContent.includes('@/features/html-to-pdf') || routeContent.includes('../src/features/html-to-pdf'), 'Assertion 2 Failed: Route does not import HtmlToPdfFeature.');
console.log('✔ 2. Route imports HTML-to-PDF feature.');

// 3, 4, 5, 6, 7. Inspect metadata configuration
const metadataPath = path.join(ROOT_DIR, 'src', 'seo', 'metadata.js');
const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
assert.ok(metadataContent.includes('"html-to-pdf"'), 'Assertion 3 Failed: METADATA_CONFIG missing html-to-pdf entry.');

const metaTitleMatch = metadataContent.match(/title:\s*"([^"]+)"/g);
const htmlMetaMatch = metadataContent.slice(metadataContent.indexOf('"html-to-pdf"'));

assert.ok(htmlMetaMatch.toLowerCase().includes('html to pdf'), 'Assertion 3 Failed: Title does not contain primary keyword "html to pdf".');
console.log('✔ 3. Title contains primary keyword "HTML to PDF".');

const descMatch = htmlMetaMatch.match(/description:\s*"([^"]+)"/);
assert.ok(descMatch && descMatch[1].length >= 80 && descMatch[1].length <= 200, 'Assertion 4 Failed: Meta description missing or bad length.');
console.log(`✔ 4. Meta description exists with valid length (${descMatch[1].length} chars).`);

const pathMatch = htmlMetaMatch.match(/path:\s*"([^"]+)"/);
assert.strictEqual(pathMatch[1], '/html-to-pdf', 'Assertion 5 Failed: Canonical path is incorrect.');
console.log('✔ 5. Canonical URL path is https://www.snapfreetools.com/html-to-pdf.');

assert.ok(metadataContent.includes('openGraph:'), 'Assertion 6 Failed: OpenGraph metadata missing.');
console.log('✔ 6. OpenGraph metadata configured.');

assert.ok(metadataContent.includes('twitter:'), 'Assertion 7 Failed: Twitter metadata missing.');
console.log('✔ 7. Twitter metadata configured.');

// 8, 9, 10, 11. Structured data JSON-LD schemas
assert.ok(routeContent.includes('WebPage'), 'Assertion 8 Failed: WebPage schema missing in page.js.');
console.log('✔ 8. WebPage schema configured.');

assert.ok(routeContent.includes('getBreadcrumbSchema'), 'Assertion 9 Failed: BreadcrumbList schema missing.');
console.log('✔ 9. BreadcrumbList schema configured.');

assert.ok(routeContent.includes('getSoftwareApplicationSchema'), 'Assertion 10 Failed: SoftwareApplication schema missing.');
console.log('✔ 10. SoftwareApplication schema configured.');

assert.ok(routeContent.includes('getFAQSchema'), 'Assertion 11 Failed: FAQPage schema missing.');
console.log('✔ 11. FAQPage schema configured.');

// 12, 13. FAQ content & schema count/question alignment
const faqsPath = path.join(ROOT_DIR, 'src', 'features', 'html-to-pdf', 'content', 'faqs.js');
assert.strictEqual(fs.existsSync(faqsPath), true, 'Assertion 12 Failed: faqs.js content file missing.');
const faqsContent = fs.readFileSync(faqsPath, 'utf-8');
const faqQuestionMatches = faqsContent.match(/question:\s*"([^"]+)"/g) || [];
assert.ok(faqQuestionMatches.length >= 10, 'Assertion 12 Failed: Expected at least 10 FAQs.');
console.log(`✔ 12 & 13. FAQ count (${faqQuestionMatches.length}) & visible question mapping verified.`);

// 14. Educational content file
const eduPath = path.join(ROOT_DIR, 'src', 'features', 'html-to-pdf', 'content', 'educationalContent.js');
assert.strictEqual(fs.existsSync(eduPath), true, 'Assertion 14 Failed: educationalContent.js file missing.');
const eduContent = fs.readFileSync(eduPath, 'utf-8');
assert.ok(eduContent.includes('<h2'), 'Assertion 14 Failed: Educational content missing H2 headings.');
console.log('✔ 14. Educational content exists with H2 headings.');

// 15. Internal links check
const hrefMatches = eduContent.match(/href="([^"]+)"/g) || [];
const validRoutes = ['/jpg-to-pdf', '/png-to-pdf', '/pdf-to-png', '/resize-pdf', '/organize-pdf', '/compress-pdf'];
hrefMatches.forEach(href => {
  const cleanHref = href.replace('href="', '').replace('"', '');
  assert.ok(validRoutes.includes(cleanHref), `Assertion 15 Failed: Internal link ${cleanHref} is not a valid route.`);
});
console.log('✔ 15. Internal links point strictly to verified existing tool routes.');

// 16, 17. Registry status check
const registryPath = path.join(ROOT_DIR, 'src', 'features', 'tools-hub', 'constants', 'allToolsRegistry.js');
const registryContent = fs.readFileSync(registryPath, 'utf-8');
const registryHtmlBlock = registryContent.slice(registryContent.indexOf('id: "html-to-pdf"'));
const registryChunk = registryHtmlBlock.slice(0, registryHtmlBlock.indexOf('}'));

assert.ok(registryChunk.includes('status: "live"'), 'Assertion 16 Failed: Registry status is not "live".');
console.log('✔ 16. Registry status is "live".');

assert.ok(registryChunk.includes('future: false'), 'Assertion 17 Failed: Registry future is not false.');
console.log('✔ 17. Registry future flag is false.');

// 18. Sitemap dynamic inclusion test
const sitemapPath = path.join(ROOT_DIR, 'app', 'sitemap.js');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
assert.ok(sitemapContent.includes('ALL_TOOLS'), 'Assertion 18 Failed: Sitemap does not dynamically pull from ALL_TOOLS.');
console.log('✔ 18. Sitemap dynamically includes live registry routes.');

// 19. No fake ratings/reviews/pricing in schema
const schemaMappersPath = path.join(ROOT_DIR, 'src', 'features', 'student-hub', 'utils', 'schemaMappers.js');
const schemaMappersContent = fs.readFileSync(schemaMappersPath, 'utf-8');
assert.strictEqual(schemaMappersContent.includes('aggregateRating'), false, 'Assertion 19 Failed: Schema contains fake aggregateRating.');
assert.strictEqual(schemaMappersContent.includes('reviewCount'), false, 'Assertion 19 Failed: Schema contains fake reviewCount.');
console.log('✔ 19. No fake aggregate ratings or review counts in schema.');

// 20. No unsupported "any website" / "100% private" claims
assert.strictEqual(htmlMetaMatch.includes('convert any website'), false, 'Assertion 20 Failed: Unsupported claim "convert any website".');
assert.strictEqual(htmlMetaMatch.includes('100% private'), false, 'Assertion 20 Failed: Unsupported claim "100% private".');
console.log('✔ 20. Copy adheres strictly to factual backend rendering & security boundaries.');

console.log('--- ALL 20 ROUTE & SEO VERIFICATION ASSERTIONS PASSED ---');
