import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

import {
  parsePdfMetadata,
  sanitizeSortedFilename,
  executePdfPageSorter
} from "../src/features/pdf-page-sorter/utils/pdfPageSorterEngine.js";

console.log("=================================================");
console.log("   STARTING PDF PAGE SORTER ENGINE TEST SUITE   ");
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
  // --- TEST 1: Sanitize Filename ---
  try {
    assert(sanitizeSortedFilename("report.pdf") === "report-sorted.pdf", "Basic filename sanitization");
    assert(sanitizeSortedFilename("my.contract.final.pdf") === "my.contract.final-sorted.pdf", "Multiple dots sanitization");
    assert(sanitizeSortedFilename("") === "document-sorted.pdf", "Empty string fallback");
    pass("Test 1: Filename Sanitization Rules");
  } catch (e) {
    console.error("Test 1 Failed:", e.message);
  }

  // --- TEST 2: Create Mock Multi-Page PDF Bytes ---
  let samplePdfBuffer;
  try {
    const pdfDoc = await PDFDocument.create();
    for (let i = 1; i <= 5; i++) {
      const page = pdfDoc.addPage([400, 600]);
      page.drawText(`Page Number ${i}`, { x: 50, y: 500 });
    }
    const pdfBytes = await pdfDoc.save();
    samplePdfBuffer = pdfBytes.buffer;
    assert(pdfBytes.length > 0, "Created mock 5-page PDF document");
    pass("Test 2: Mock 5-Page PDF Creation");
  } catch (e) {
    console.error("Test 2 Failed:", e.message);
  }

  // --- TEST 3: Execute PDF Page Sorting with Custom Sequence (5, 3, 1, 2, 4) ---
  try {
    const mockFile = {
      name: "sample-doc.pdf",
      size: samplePdfBuffer.byteLength,
      arrayBuffer: async () => samplePdfBuffer
    };

    // Custom order: Original pages [4, 2, 0, 1, 3] -> (Page 5, Page 3, Page 1, Page 2, Page 4)
    const pageItems = [
      { id: "item-1", originalIndex: 4, originalPageNumber: 5, rotation: 0 },
      { id: "item-2", originalIndex: 2, originalPageNumber: 3, rotation: 90 },
      { id: "item-3", originalIndex: 0, originalPageNumber: 1, rotation: 0 },
      { id: "item-4", originalIndex: 1, originalPageNumber: 2, rotation: 0 },
      { id: "item-5", originalIndex: 3, originalPageNumber: 4, rotation: 0 }
    ];

    const result = await executePdfPageSorter({
      file: mockFile,
      pageItems,
      onProgress: (msg) => {}
    });

    assert(result.outputFilename === "sample-doc-sorted.pdf", "Result outputFilename matches");
    assert(result.originalPageCount === 5, "Original page count is 5");
    assert(result.sortedPageCount === 5, "Sorted page count is 5");
    assert(result.blob instanceof Blob, "Result returns Blob object");

    // Load reordered PDF to verify page count and page structure
    const resultBuffer = await result.blob.arrayBuffer();
    const verifiedDoc = await PDFDocument.load(resultBuffer);
    assert(verifiedDoc.getPageCount() === 5, "Re-parsed PDF contains exactly 5 pages");
    
    // Check rotation of second page (was original index 2 rotated 90deg)
    const page2 = verifiedDoc.getPage(1);
    assert(page2.getRotation().angle === 90, "Page 2 rotation applied successfully");

    pass("Test 3: PDF Page Sorting Execution & Structural Verification");
  } catch (e) {
    console.error("Test 3 Failed:", e.message);
  }

  // --- TEST 4: Empty Page Items Error Catch ---
  try {
    const mockFile = {
      name: "empty.pdf",
      arrayBuffer: async () => samplePdfBuffer
    };
    let threw = false;
    try {
      await executePdfPageSorter({ file: mockFile, pageItems: [] });
    } catch (err) {
      threw = true;
      assert(err.message.includes("No pages available"), "Throws error for empty pageItems");
    }
    assert(threw, "Empty pageItems rejected");
    pass("Test 4: Empty Page Items Rejection");
  } catch (e) {
    console.error("Test 4 Failed:", e.message);
  }

  console.log("\n=================================================");
  console.log(`TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal Test Suite Error:", err);
  process.exit(1);
});
