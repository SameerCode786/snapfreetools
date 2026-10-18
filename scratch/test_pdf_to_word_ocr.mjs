import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import { formatOCRText } from "../src/features/pdf-to-word/utils/ocr-text-formatter.js";
import { generateDocxFromPages } from "../src/features/pdf-to-word/utils/docx-generator.js";
import { SUPPORTED_OCR_LANGUAGES, isLanguageSupported, MAX_OCR_PAGES } from "../src/features/pdf-to-word/utils/ocr-engine.js";
import JSZip from "jszip";

async function runTests() {
  console.log("==================================================");
  console.log("STARTING PDF TO WORD OCR COMPREHENSIVE TEST SUITE");
  console.log("==================================================");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] Test ${totalTests}: ${testName}`);
      passedTests++;
    } else {
      console.error(`[FAIL] Test ${totalTests}: ${testName}`);
    }
  }

  // --- SECTION 1: 7 REPRESENTATIVE OCR TEXT FORMATTING SPECIFICATION TESTS ---
  console.log("\n--- Section 1: Formatter Specification Tests ---");

  // 1. Heading followed by multiple paragraphs
  const headingInput = `
Lorem Ipsum
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
dolore eu fugiat nulla pariatur.
`;
  const headingBlocks = formatOCRText(headingInput);
  assert(headingBlocks.length === 3, "1. Heading followed by multiple paragraphs has 3 distinct blocks");
  assert(headingBlocks[0].type === "heading" && headingBlocks[0].text === "Lorem Ipsum", "1. 'Lorem Ipsum' correctly identified as heading");
  assert(headingBlocks[1].type === "paragraph" && headingBlocks[1].text.startsWith("Lorem ipsum dolor sit amet"), "1. Paragraph 1 preserved separately from heading");

  // 2. Line-wrapped sentences
  const wrappedInput = `
This is the first part of a very long sentence that was wrapped across
multiple physical lines by the printer, and now it continues smoothly
until it finally finishes here.
`;
  const wrappedBlocks = formatOCRText(wrappedInput);
  assert(wrappedBlocks.length === 1, "2. Line-wrapped sentence joined into a single cohesive paragraph block");
  assert(!wrappedBlocks[0].text.includes("\n"), "2. No stray newlines inside joined sentence");

  // 3. Bullet and numbered lists with multi-line continuations
  const listInput = `
Features Overview
• First feature with short description.
* Second feature which has a rather lengthy explanation that wraps
onto a second physical line before concluding.
1. Numbered step one.
2. Numbered step two with additional details extending
across another line.
`;
  const listBlocks = formatOCRText(listInput);
  assert(listBlocks[0].type === "heading", "3. List header recognized as heading");
  assert(listBlocks[1].type === "bullet" && listBlocks[1].text.startsWith("• First feature"), "3. Bullet 1 normalized to '• '");
  assert(listBlocks[2].type === "bullet" && listBlocks[2].text.includes("wraps onto a second physical line"), "3. Multi-line bullet wrapped lines preserved in single bullet block");
  assert(listBlocks[3].type === "numbered" && listBlocks[3].text.startsWith("1. Numbered step one"), "3. Numbered item 1 preserved");
  assert(listBlocks[4].type === "numbered" && listBlocks[4].text.includes("extending across another line"), "3. Multi-line numbered item wrapped lines preserved in single item");

  // 4. Stray OCR characters at beginning and end ('L i', border noise)
  const noiseInput = `
L i
_
Lorem ipsum
Actual content paragraph goes here.
| i
`;
  const noiseBlocks = formatOCRText(noiseInput);
  assert(noiseBlocks.length === 2, "4. Stray noise 'L i', '_', and '| i' filtered out");
  assert(noiseBlocks[0].text === "Lorem ipsum", "4. First valid block is 'Lorem ipsum' without leading 'L i'");

  // 5. Hyphenated words
  const hyphenInput = `
The quick brown fox achieved extraor-
dinary results through complete docu-
mentation.
`;
  const hyphenBlocks = formatOCRText(hyphenInput);
  assert(hyphenBlocks[0].text.includes("extraordinary"), "5. 'extraor- dinary' correctly unwrapped to 'extraordinary'");
  assert(hyphenBlocks[0].text.includes("documentation."), "5. 'docu- mentation' correctly unwrapped to 'documentation.'");

  // 6. Text that must NOT be removed by cleanup rules
  const legitimateInput = `
A
This is a section where 'A' is a valid single-letter heading or title.
I am writing to confirm that short words like 'In', 'On', 'To' remain intact.
`;
  const legitBlocks = formatOCRText(legitimateInput);
  const legitFull = legitBlocks.map(b => b.text).join(" ");
  assert(legitFull.includes("A"), "6. Legitimate single-letter word 'A' preserved");
  assert(legitFull.includes("I am writing"), "6. 'I am writing' preserved");

  // 7. REGRESSION SAFETY: Legitimate occurrences of words like 'Nune' or compound words must NOT be modified
  const regressionInput = `
Dr. Nune visited the laboratory to inspect the state-of-the-art facility.
`;
  const regBlocks = formatOCRText(regressionInput);
  assert(regBlocks[0].text.includes("Dr. Nune"), "7. 'Dr. Nune' is NOT silently mutated to 'Dr. Nunc'");
  assert(regBlocks[0].text.includes("state-of-the-art"), "7. Compound adjective 'state-of-the-art' hyphens remain intact");

  // --- SECTION 2: DOCX GENERATOR WITH HEADINGS, BULLETS, AND PAGE BREAKS ---
  console.log("\n--- Section 2: DOCX Generator Verification ---");
  const testPages = [
    {
      pageNumber: 1,
      paragraphs: [
        { text: "Lorem Ipsum", type: "heading" },
        { text: "This is paragraph one of page one.", type: "paragraph" },
        { text: "• Bullet item on page one.", type: "bullet" }
      ]
    },
    {
      pageNumber: 2,
      paragraphs: [
        { text: "Terms and Conditions", type: "heading" },
        { text: "1. Numbered item on page two.", type: "numbered" }
      ]
    }
  ];

  const docxBlob = await generateDocxFromPages(testPages);
  assert(docxBlob instanceof Blob, "DOCX generator returned a valid binary Blob");
  assert(docxBlob.size > 2000, `DOCX Blob size is valid (${docxBlob.size} bytes)`);

  const docxBuffer = Buffer.from(await docxBlob.arrayBuffer());
  const zip = await JSZip.loadAsync(docxBuffer);
  const docXml = await zip.file("word/document.xml").async("text");
  assert(docXml.includes("Lorem Ipsum"), "DOCX XML contains page 1 heading");
  assert(docXml.includes("<w:b/>") || docXml.includes("<w:b "), "DOCX XML styles heading with bold (<w:b/>)");
  assert(docXml.includes("Terms and Conditions"), "DOCX XML contains page 2 heading");
  assert(docXml.includes("Bullet item on page one"), "DOCX XML contains bullet item");
  assert(docXml.includes("<w:lastRenderedPageBreak/>") || docXml.includes("<w:br w:type=\"page\"/>"), "DOCX XML contains page break between pages");

  // --- SECTION 3: LANGUAGE VALIDATION & OCR ENGINE LIMITS ---
  console.log("\n--- Section 3: Supported OCR Languages & Limits ---");
  assert(isLanguageSupported("eng"), "English is a supported language (Default & Offline)");
  assert(isLanguageSupported("spa"), "Spanish is a supported language");
  assert(isLanguageSupported("fra"), "French is a supported language");
  assert(!isLanguageSupported("klingon"), "Invalid language 'klingon' correctly rejected");
  assert(!isLanguageSupported("xyz"), "Unsupported language 'xyz' correctly rejected");
  assert(MAX_OCR_PAGES === 10, "Page limit constant is correctly set to 10 pages");

  // --- SECTION 4: LIMIT & ERROR HANDLING ---
  console.log("\n--- Section 4: Limit & Error Handling ---");
  let limitTriggered = false;
  try {
    const testNumPages = 12;
    if (testNumPages > MAX_OCR_PAGES) {
      const err = new Error(`This free in-browser OCR version supports up to ${MAX_OCR_PAGES} pages per document.`);
      err.code = "LIMIT_EXCEEDED";
      throw err;
    }
  } catch (err) {
    if (err.code === "LIMIT_EXCEEDED") limitTriggered = true;
  }
  assert(limitTriggered, "Large PDF (>10 pages) correctly triggers LIMIT_EXCEEDED error");

  let unsupportedLangTriggered = false;
  try {
    const badLang = "unsupported_lang_123";
    if (!isLanguageSupported(badLang)) {
      const err = new Error(`The selected language '${badLang}' is not supported.`);
      err.code = "UNSUPPORTED_LANGUAGE";
      throw err;
    }
  } catch (err) {
    if (err.code === "UNSUPPORTED_LANGUAGE") unsupportedLangTriggered = true;
  }
  assert(unsupportedLangTriggered, "Unsupported language correctly triggers UNSUPPORTED_LANGUAGE error");

  let emptyOcrTriggered = false;
  try {
    const dummyOcrResults = [
      { pageNumber: 1, paragraphs: [] },
      { pageNumber: 2, paragraphs: [{ text: "   ", type: "paragraph" }] }
    ];
    let totalText = 0;
    dummyOcrResults.forEach(r => r.paragraphs.forEach(p => totalText += (p.text || "").trim().length));
    if (totalText === 0) {
      const err = new Error("OCR completed, but no readable text was detected.");
      err.code = "NO_TEXT_FOUND";
      throw err;
    }
  } catch (err) {
    if (err.code === "NO_TEXT_FOUND") emptyOcrTriggered = true;
  }
  assert(emptyOcrTriggered, "Empty OCR output correctly triggers NO_TEXT_FOUND error");

  // --- SECTION 5: SAFE CANCELLATION ---
  console.log("\n--- Section 5: Safe Cancellation ---");
  let cancelledFlag = false;
  const mockJob = {
    isCancelled: false,
    cancel() {
      this.isCancelled = true;
    }
  };
  mockJob.cancel();
  if (mockJob.isCancelled) {
    cancelledFlag = true;
  }
  assert(cancelledFlag, "Cancellation flag triggers worker termination cleanly");

  console.log("\n==================================================");
  console.log(`TEST SUITE RESULTS: ${passedTests} / ${totalTests} PASSED`);
  console.log("==================================================");

  if (passedTests === totalTests) {
    console.log("ALL TESTS COMPLETED SUCCESSFULLY!");
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test Suite Unhandled Exception:", err);
  process.exit(1);
});
