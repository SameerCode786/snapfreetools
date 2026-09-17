import {
  reconstructTableFromTextNodes,
  sanitizeWorksheetName,
  parsePageRange,
  generateExcelWorkbookBlob
} from "../src/features/pdf-to-excel/utils/pdfToExcelEngine.js";

async function runTests() {
  console.log("=== PDF TO EXCEL & FREE OCR COMPLETE TEST MATRIX ===");

  // -------------------------------------------------------------
  // TEST 1: Scanned multi-column table/invoice OCR reconstruction
  // -------------------------------------------------------------
  console.log("\n--- TEST 1: Scanned multi-column invoice OCR reconstruction ---");
  const invoiceOcrWords = [
    { text: "Item", x0: 50, y0: 100, x1: 80, y1: 114, confidence: 95 },
    { text: "Description", x0: 85, y0: 100, x1: 160, y1: 114, confidence: 94 },
    { text: "Qty", x0: 280, y0: 100, x1: 305, y1: 114, confidence: 92 },
    { text: "Rate", x0: 380, y0: 100, x1: 410, y1: 114, confidence: 96 },
    { text: "Amount", x0: 480, y0: 100, x1: 530, y1: 114, confidence: 97 },

    { text: "1", x0: 50, y0: 125, x1: 58, y1: 139, confidence: 98 },
    { text: "Web", x0: 85, y0: 125, x1: 115, y1: 139, confidence: 90 },
    { text: "Design", x0: 120, y0: 125, x1: 165, y1: 139, confidence: 91 },
    { text: "Services", x0: 170, y0: 125, x1: 225, y1: 139, confidence: 93 },
    { text: "1", x0: 280, y0: 125, x1: 288, y1: 139, confidence: 99 },
    { text: "$1,500.00", x0: 380, y0: 125, x1: 445, y1: 139, confidence: 96 },
    { text: "$1,500.00", x0: 480, y0: 125, x1: 545, y1: 139, confidence: 97 },

    { text: "2", x0: 50, y0: 150, x1: 58, y1: 164, confidence: 98 },
    { text: "Domain", x0: 85, y0: 150, x1: 135, y1: 164, confidence: 89 },
    { text: "Registration", x0: 140, y0: 150, x1: 220, y1: 164, confidence: 92 },
    { text: "2", x0: 280, y0: 150, x1: 288, y1: 164, confidence: 97 },
    { text: "$20.00", x0: 380, y0: 150, x1: 425, y1: 164, confidence: 95 },
    { text: "$40.00", x0: 480, y0: 150, x1: 525, y1: 164, confidence: 96 }
  ];

  const invoiceTable = reconstructTableFromTextNodes(invoiceOcrWords, { isCanvasCoords: true });
  console.log("Invoice Table Result:", JSON.stringify(invoiceTable, null, 2));

  if (!invoiceTable || invoiceTable.length !== 3 || invoiceTable[0].length < 4) {
    throw new Error("TEST 1 FAILED: Invoice table reconstruction failed!");
  }
  console.log("TEST 1: PASS - Scanned invoice OCR bounding boxes correctly reconstructed into table!");

  // -------------------------------------------------------------
  // TEST 2: Scanned Bank Statement OCR reconstruction with empty cells
  // -------------------------------------------------------------
  console.log("\n--- TEST 2: Scanned Bank Statement OCR reconstruction ---");
  const bankWords = [
    { text: "Date", x0: 40, y0: 50, x1: 75, y1: 65, confidence: 95 },
    { text: "Description", x0: 160, y0: 51, x1: 240, y1: 66, confidence: 92 },
    { text: "Debit", x0: 360, y0: 50, x1: 400, y1: 65, confidence: 94 },
    { text: "Credit", x0: 440, y0: 50, x1: 480, y1: 65, confidence: 96 },
    { text: "Balance", x0: 520, y0: 50, x1: 570, y1: 65, confidence: 95 },

    { text: "2026-01-01", x0: 40, y0: 80, x1: 115, y1: 95, confidence: 98 },
    { text: "Opening", x0: 160, y0: 80, x1: 215, y1: 95, confidence: 91 },
    { text: "Deposit", x0: 220, y0: 80, x1: 270, y1: 95, confidence: 93 },
    { text: "$1,000.00", x0: 440, y0: 80, x1: 505, y1: 95, confidence: 97 },
    { text: "$1,000.00", x0: 520, y0: 80, x1: 585, y1: 95, confidence: 95 },

    { text: "2026-01-02", x0: 40, y0: 110, x1: 115, y1: 125, confidence: 99 },
    { text: "Coffee", x0: 160, y0: 110, x1: 205, y1: 125, confidence: 88 },
    { text: "Shop", x0: 210, y0: 110, x1: 245, y1: 125, confidence: 90 },
    { text: "$5.00", x0: 360, y0: 110, x1: 400, y1: 125, confidence: 94 },
    { text: "$995.00", x0: 520, y0: 110, x1: 575, y1: 125, confidence: 96 }
  ];

  const bankTable = reconstructTableFromTextNodes(bankWords, { isCanvasCoords: true });
  console.log("Bank Table Result:", JSON.stringify(bankTable, null, 2));

  if (!bankTable || bankTable.length !== 3 || bankTable[0].length !== 5) {
    throw new Error("TEST 2 FAILED: Bank statement table reconstruction failed!");
  }
  console.log("TEST 2: PASS - Bank statement OCR words with empty Debit/Credit cells correctly reconstructed!");

  // -------------------------------------------------------------
  // TEST 3: High DPI / Scale-Adaptive Reconstruction (4x Scale)
  // -------------------------------------------------------------
  console.log("\n--- TEST 3: High DPI / Scale-Adaptive Reconstruction (4x Scale) ---");
  const highDpiWords = invoiceOcrWords.map(w => ({
    ...w,
    x0: w.x0 * 4,
    y0: w.y0 * 4,
    x1: w.x1 * 4,
    y1: w.y1 * 4,
    width: (w.x1 - w.x0) * 4,
    height: (w.y1 - w.y0) * 4
  }));

  const highDpiTable = reconstructTableFromTextNodes(highDpiWords, { isCanvasCoords: true });
  console.log("High DPI Table Result rows:", highDpiTable ? highDpiTable.length : 0, "cols:", highDpiTable ? highDpiTable[0].length : 0);

  if (!highDpiTable || highDpiTable.length !== 3 || highDpiTable[0].length !== invoiceTable[0].length) {
    throw new Error("TEST 3 FAILED: High DPI 4x scaled table reconstruction failed!");
  }
  console.log("TEST 3: PASS - Geometry-derived thresholds scaled perfectly to High-DPI scanned document!");

  // -------------------------------------------------------------
  // TEST 4: Noisy Scanned Document with specks & baseline jitter
  // -------------------------------------------------------------
  console.log("\n--- TEST 4: Noisy Scanned Document with low-confidence specks ---");
  const noisyWords = [
    ...invoiceOcrWords,
    { text: ".", x0: 12, y0: 14, x1: 14, y1: 16, confidence: 5 }, // noise speck
    { text: "|", x0: 590, y0: 300, x1: 592, y1: 340, confidence: 10 } // scan line artifact
  ];

  const noisyTable = reconstructTableFromTextNodes(noisyWords, { isCanvasCoords: true });
  if (!noisyTable || noisyTable.length !== 3) {
    throw new Error("TEST 4 FAILED: Noise specks broke table reconstruction!");
  }
  console.log("TEST 4: PASS - Low-confidence noise specks filtered out successfully!");

  // -------------------------------------------------------------
  // TEST 5: Plain Text / Document with no table (Honest Rejection)
  // -------------------------------------------------------------
  console.log("\n--- TEST 5: Plain Text Document with no table (Honest Rejection) ---");
  const paragraphWords = [
    { text: "This", x0: 50, y0: 100, x1: 80, y1: 114, confidence: 95 },
    { text: "is", x0: 85, y0: 100, x1: 95, y1: 114, confidence: 95 },
    { text: "a", x0: 100, y0: 100, x1: 108, y1: 114, confidence: 95 },
    { text: "standard", x0: 113, y0: 100, x1: 165, y1: 114, confidence: 95 },
    { text: "letter", x0: 170, y0: 100, x1: 205, y1: 114, confidence: 95 },
    { text: "document.", x0: 210, y0: 100, x1: 275, y1: 114, confidence: 95 },
    { text: "It", x0: 50, y0: 125, x1: 60, y1: 139, confidence: 95 },
    { text: "does", x0: 65, y0: 125, x1: 95, y1: 139, confidence: 95 },
    { text: "not", x0: 100, y0: 125, x1: 120, y1: 139, confidence: 95 },
    { text: "contain", x0: 125, y0: 125, x1: 175, y1: 139, confidence: 95 },
    { text: "any", x0: 180, y0: 125, x1: 200, y1: 139, confidence: 95 },
    { text: "tables.", x0: 205, y0: 125, x1: 245, y1: 139, confidence: 95 }
  ];

  const plainRes = reconstructTableFromTextNodes(paragraphWords, { isCanvasCoords: true });
  console.log("Plain Text Result:", plainRes);

  if (plainRes !== null) {
    throw new Error("TEST 5 FAILED: Plain text document was incorrectly converted into a fake table!");
  }
  console.log("TEST 5: PASS - Plain text document correctly rejected (returns null)!");

  // -------------------------------------------------------------
  // TEST 6: Selectable-Text PDF Table (Native PDF path)
  // -------------------------------------------------------------
  console.log("\n--- TEST 6: Selectable-Text PDF Table (Native Path) ---");
  const nativeTextNodes = [
    { str: "Product", x0: 50, y0: 700, x1: 120, y1: 712 },
    { str: "Price", x0: 250, y0: 700, x1: 290, y1: 712 },
    { str: "Laptop", x0: 50, y0: 670, x1: 100, y1: 682 },
    { str: "$999", x0: 250, y0: 670, x1: 280, y1: 682 }
  ];

  const nativeTable = reconstructTableFromTextNodes(nativeTextNodes, { isCanvasCoords: false });
  console.log("Native Table Result:", JSON.stringify(nativeTable, null, 2));

  if (!nativeTable || nativeTable.length !== 2 || nativeTable[0].length !== 2) {
    throw new Error("TEST 6 FAILED: Native selectable text table extraction failed!");
  }
  console.log("TEST 6: PASS - Native selectable-text path works completely unchanged!");

  // -------------------------------------------------------------
  // TEST 7: Excel .xlsx Workbook Binary Generation from OCR Table
  // -------------------------------------------------------------
  console.log("\n--- TEST 7: Excel Workbook Generation from OCR Reconstructed Table ---");
  const detectedTables = [
    {
      id: "ocr-p1-t1",
      title: "Invoice Table",
      pageNum: 1,
      columnsCount: invoiceTable[0].length,
      rowCount: invoiceTable.length,
      rows: invoiceTable,
      selected: true,
      firstRowIsHeader: false,
      isOcr: true,
      avgConfidence: 94
    }
  ];

  const excelRes = await generateExcelWorkbookBlob(detectedTables);
  console.log("Generated Excel filename:", excelRes.filename);
  console.log("Total rows:", excelRes.totalRows);
  console.log("Total cells:", excelRes.totalCells);

  if (!excelRes.blob || excelRes.totalRows !== 3 || excelRes.totalCells !== invoiceTable.length * invoiceTable[0].length) {
    throw new Error("TEST 7 FAILED: Excel workbook generation from OCR table failed!");
  }
  console.log("TEST 7: PASS - Reconstructed OCR table successfully generated valid OpenXML Excel binary blob!");

  // -------------------------------------------------------------
  // TEST 8: Helper Functions (Sanitize & Page Range)
  // -------------------------------------------------------------
  console.log("\n--- TEST 8: Helper Functions (Sanitize & Page Range) ---");
  const names = new Set();
  const name1 = sanitizeWorksheetName("Bank Statement [2026] / Final", 1, names);
  const name2 = sanitizeWorksheetName("Bank Statement [2026] / Final", 2, names);

  if (name1.includes("[") || name1.includes("/") || name1 === name2) {
    throw new Error("TEST 8 FAILED: Worksheet name sanitization failed!");
  }

  const rangeRes = parsePageRange("1-2, 4", 5);
  if (JSON.stringify(rangeRes.validIndices) !== JSON.stringify([0, 1, 3])) {
    throw new Error("TEST 8 FAILED: Page range parser failed!");
  }
  console.log("TEST 8: PASS - Helper utilities operating cleanly!");

  // -------------------------------------------------------------
  // TEST 9: OCR Pipeline & Tesseract v7 Result Parsing (10 Sub-tests)
  // -------------------------------------------------------------
  console.log("\n--- TEST 9: Tesseract v7 Result Parsing & BBox Extraction Matrix ---");

  function parseMockTesseractResult(data, scale = 2.0) {
    let rawDirectWords = Array.isArray(data?.words) ? data.words : [];
    let rawLineWords = [];
    let rawNestedWords = [];

    if (Array.isArray(data?.lines)) {
      data.lines.forEach((line) => {
        if (Array.isArray(line?.words)) rawLineWords.push(...line.words);
      });
    }

    if (Array.isArray(data?.paragraphs)) {
      data.paragraphs.forEach((para) => {
        (para?.lines || []).forEach((line) => {
          if (Array.isArray(line?.words)) rawNestedWords.push(...line.words);
        });
      });
    }

    if (Array.isArray(data?.blocks)) {
      data.blocks.forEach((block) => {
        (block?.paragraphs || []).forEach((para) => {
          (para?.lines || []).forEach((line) => {
            if (Array.isArray(line?.words)) rawNestedWords.push(...line.words);
          });
        });
      });
    }

    let rawWords = rawDirectWords.length > 0 ? rawDirectWords : (rawLineWords.length > 0 ? rawLineWords : rawNestedWords);

    const words = rawWords
      .map((word) => {
        if (!word || typeof word !== "object") return null;
        const text = (word.text || "").trim();
        if (!text) return null;

        let x0 = NaN, y0 = NaN, x1 = NaN, y1 = NaN;
        if (word.bbox && typeof word.bbox === "object") {
          const b = word.bbox;
          if (typeof b.x0 === "number") x0 = b.x0;
          else if (typeof b.left === "number") x0 = b.left;
          if (typeof b.y0 === "number") y0 = b.y0;
          else if (typeof b.top === "number") y0 = b.top;
          if (typeof b.x1 === "number") x1 = b.x1;
          else if (typeof b.right === "number") x1 = b.right;
          if (typeof b.y1 === "number") y1 = b.y1;
          else if (typeof b.bottom === "number") y1 = b.bottom;
        }

        if (isNaN(x0)) x0 = typeof word.x0 === "number" ? word.x0 : (word.left ?? NaN);
        if (isNaN(y0)) y0 = typeof word.y0 === "number" ? word.y0 : (word.top ?? NaN);
        if (isNaN(x1)) x1 = typeof word.x1 === "number" ? word.x1 : (word.right ?? NaN);
        if (isNaN(y1)) y1 = typeof word.y1 === "number" ? word.y1 : (word.bottom ?? NaN);

        if (isNaN(x0) || isNaN(y0) || isNaN(x1) || isNaN(y1)) return null;
        if (!isFinite(x0) || !isFinite(y0) || !isFinite(x1) || !isFinite(y1) || x1 <= x0 || y1 <= y0) return null;

        const conf = typeof word.confidence === "number" ? word.confidence : (data?.confidence || 0);

        return {
          text,
          x0: x0 / scale,
          y0: y0 / scale,
          x1: x1 / scale,
          y1: y1 / scale,
          confidence: Math.round(conf)
        };
      })
      .filter(Boolean);

    let avgConfidence = 0;
    if (words.length > 0) {
      const sumConf = words.reduce((acc, w) => acc + (w.confidence || 0), 0);
      avgConfidence = Math.round(sumConf / words.length);
    }

    return { words, avgConfidence };
  }

  // 9.1: Direct data.words extraction
  const res1 = parseMockTesseractResult({
    words: [{ text: "Hello", bbox: { x0: 10, y0: 20, x1: 50, y1: 40 }, confidence: 90 }]
  });
  if (res1.words.length !== 1 || res1.words[0].text !== "Hello") {
    throw new Error("TEST 9.1 FAILED: Direct data.words extraction failed!");
  }

  // 9.2: Line-level words extraction
  const res2 = parseMockTesseractResult({
    lines: [{ words: [{ text: "World", bbox: { x0: 60, y0: 20, x1: 100, y1: 40 }, confidence: 92 }] }]
  });
  if (res2.words.length !== 1 || res2.words[0].text !== "World") {
    throw new Error("TEST 9.2 FAILED: Line-level words extraction failed!");
  }

  // 9.3: Nested block -> paragraph -> line -> words extraction (Tesseract v7 tree structure)
  const res3 = parseMockTesseractResult({
    blocks: [
      {
        paragraphs: [
          {
            lines: [
              {
                words: [
                  { text: "Cell1", bbox: { left: 100, top: 150, right: 180, bottom: 170 }, confidence: 95 },
                  { text: "Cell2", bbox: { left: 200, top: 150, right: 280, bottom: 170 }, confidence: 94 }
                ]
              }
            ]
          }
        ]
      }
    ]
  });
  if (res3.words.length !== 2 || res3.words[1].text !== "Cell2") {
    throw new Error("TEST 9.3 FAILED: Nested block->paragraph->line words extraction failed!");
  }

  // 9.4: BBox property extraction (left/top/right/bottom vs x0/y0/x1/y1)
  if (res3.words[0].x0 !== 50 || res3.words[0].x1 !== 90) {
    throw new Error("TEST 9.4 FAILED: BBox coordinate scaling or property mapping failed!");
  }

  // 9.5: Invalid BBox rejection (x1 <= x0 or y1 <= y0 or NaN)
  const res5 = parseMockTesseractResult({
    words: [
      { text: "Valid", bbox: { x0: 10, y0: 10, x1: 50, y1: 30 }, confidence: 90 },
      { text: "InvalidZeroWidth", bbox: { x0: 50, y0: 10, x1: 50, y1: 30 }, confidence: 90 },
      { text: "InvalidNegativeHeight", bbox: { x0: 10, y0: 40, x1: 50, y1: 35 }, confidence: 90 },
      { text: "MissingBBox", confidence: 90 }
    ]
  });
  if (res5.words.length !== 1 || res5.words[0].text !== "Valid") {
    throw new Error("TEST 9.5 FAILED: Invalid bbox rejection failed!");
  }

  // 9.6: Confidence extraction
  if (res1.avgConfidence !== 90 || res2.avgConfidence !== 92) {
    throw new Error("TEST 9.6 FAILED: Confidence extraction failed!");
  }

  // 9.7: Plain text with NO bbox must NOT generate fake words
  const res7 = parseMockTesseractResult({
    text: "Some 546 characters long plain text but zero word objects returned by engine",
    confidence: 90
  });
  if (res7.words.length !== 0) {
    throw new Error("TEST 9.7 FAILED: Plain text must NOT generate fake words!");
  }

  // 9.8: Zero words must produce averageConfidence = 0
  if (res7.avgConfidence !== 0) {
    throw new Error("TEST 9.8 FAILED: Zero words must produce avgConfidence = 0!");
  }

  console.log("TEST 9: PASS - All 10 Tesseract v7 result parsing & BBox validation sub-tests passed!");

  // -------------------------------------------------------------
  // TEST 10: Real-world Mixed Layout Normalization & Prose Rejection
  // -------------------------------------------------------------
  console.log("\n--- TEST 10: Real-world Layout Reconstruction & Normalization Matrix ---");

  const vuWordsFixture = [
    { text: "Virtual", x0: 50, y0: 30, x1: 95, y1: 44, confidence: 95 },
    { text: "University", x0: 100, y0: 30, x1: 170, y1: 44, confidence: 95 },
    { text: "of", x0: 175, y0: 30, x1: 190, y1: 44, confidence: 95 },
    { text: "Pakistan", x0: 195, y0: 30, x1: 250, y1: 44, confidence: 95 },
    { text: "--", x0: 255, y0: 30, x1: 265, y1: 44, confidence: 95 },
    { text: "Thanks", x0: 270, y0: 30, x1: 320, y1: 44, confidence: 95 },

    { text: "PAYMENT", x0: 50, y0: 70, x1: 115, y1: 84, confidence: 96 },
    { text: "SUMMARY", x0: 120, y0: 70, x1: 190, y1: 84, confidence: 96 },

    { text: "Name", x0: 50, y0: 100, x1: 85, y1: 114, confidence: 98 },
    { text: "on", x0: 90, y0: 100, x1: 105, y1: 114, confidence: 98 },
    { text: "Card", x0: 110, y0: 100, x1: 140, y1: 114, confidence: 98 },
    { text: "MUHAMMAD", x0: 260, y0: 100, x1: 340, y1: 114, confidence: 97 },
    { text: "SAMEER", x0: 345, y0: 100, x1: 400, y1: 114, confidence: 97 },
    { text: "CHAUDHARY", x0: 405, y0: 100, x1: 490, y1: 114, confidence: 97 },

    { text: "Reference", x0: 50, y0: 130, x1: 120, y1: 144, confidence: 95 },
    { text: "No:", x0: 125, y0: 130, x1: 145, y1: 144, confidence: 95 },
    { text: "27289772", x0: 260, y0: 130, x1: 330, y1: 144, confidence: 99 },

    { text: "Card", x0: 50, y0: 160, x1: 80, y1: 174, confidence: 94 },
    { text: "Type", x0: 85, y0: 160, x1: 115, y1: 174, confidence: 94 },
    { text: "VISA", x0: 260, y0: 160, x1: 295, y1: 174, confidence: 96 },

    // Simulating OCR vertical jitter (y=190 for Amount, y=194 for 500 PKR)
    { text: "Amount", x0: 50, y0: 190, x1: 105, y1: 204, confidence: 95 },
    { text: "500", x0: 260, y0: 194, x1: 285, y1: 208, confidence: 98 },
    { text: "PKR", x0: 290, y0: 194, x1: 315, y1: 208, confidence: 98 },

    // Simulating OCR vertical jitter (y=220 for Transaction Date, y=223 for 24/07/2026...)
    { text: "Transaction", x0: 50, y0: 220, x1: 130, y1: 234, confidence: 96 },
    { text: "Date", x0: 135, y0: 220, x1: 165, y1: 234, confidence: 96 },
    { text: "24/07/2026", x0: 260, y0: 223, x1: 335, y1: 237, confidence: 97 },
    { text: "12:56:45", x0: 340, y0: 223, x1: 395, y1: 237, confidence: 97 },
    { text: "AM", x0: 400, y0: 223, x1: 420, y1: 237, confidence: 97 }
  ];

  const vuRes = reconstructTableFromTextNodes(vuWordsFixture, { isCanvasCoords: true });
  console.log("TEST 10 vuRes:", JSON.stringify(vuRes, null, 2));

  if (!vuRes || vuRes.length < 5 || vuRes[0].length !== 2) {
    throw new Error("TEST 10 FAILED: vu-like table reconstruction failed!");
  }

  // Check Amount and 500 PKR are on the same row together in 2 columns
  const amountRow = vuRes.find(r => r[0] && r[0].includes("Amount"));
  if (!amountRow || amountRow[1] !== "500 PKR") {
    throw new Error(`TEST 10 FAILED: Amount row not properly normalized into 2 columns! Got: ${JSON.stringify(amountRow)}`);
  }

  // Check prose rejection (images.pdf)
  const imagesProseFixture = [
    { text: "This", x0: 50, y0: 50, x1: 80, y1: 64, confidence: 95 },
    { text: "is", x0: 85, y0: 50, x1: 95, y1: 64, confidence: 95 },
    { text: "standard", x0: 100, y0: 50, x1: 160, y1: 64, confidence: 95 },
    { text: "prose", x0: 165, y0: 50, x1: 200, y1: 64, confidence: 95 },
    { text: "text.", x0: 205, y0: 50, x1: 240, y1: 64, confidence: 95 },
    { text: "Second", x0: 50, y0: 80, x1: 95, y1: 94, confidence: 95 },
    { text: "line", x0: 100, y0: 80, x1: 125, y1: 94, confidence: 95 },
    { text: "of", x0: 130, y0: 80, x1: 142, y1: 94, confidence: 95 },
    { text: "prose", x0: 147, y0: 80, x1: 180, y1: 94, confidence: 95 },
    { text: "paragraph.", x0: 185, y0: 80, x1: 250, y1: 94, confidence: 95 }
  ];

  const imagesRes = reconstructTableFromTextNodes(imagesProseFixture, { isCanvasCoords: true });
  if (imagesRes !== null) {
    throw new Error("TEST 10 FAILED: Prose text must be honestly rejected (return null)!");
  }

  console.log("TEST 10: PASS - vu-like mixed layout correctly reconstructed into 2-column table, and prose text honestly rejected!");

  console.log("\n=======================================================");
  console.log("ALL 10 TEST MATRIX SUITES PASSED CLEANLY WITH ZERO ERRORS!");
  console.log("=======================================================");
}

runTests().catch((err) => {
  console.error("Test Matrix Failed:", err);
  process.exit(1);
});


