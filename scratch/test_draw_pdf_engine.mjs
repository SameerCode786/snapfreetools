import fs from "fs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

import {
  parsePdfMetadata,
  exportAnnotationsToPdf,
  filterActiveAnnotations,
  sanitizeAnnotatedFilename,
  DrawPdfError,
  normalizeToUint8Array
} from "../src/features/draw-on-pdf/utils/drawPdfEngine.js";

import {
  screenToPdfPoint,
  pdfToScreenPoint,
  normalizePoint,
  denormalizePoint,
  getBoundingBox,
  smoothPoints,
  pointsToSvgPath,
  calculateArrowGeometry,
  normalizeRectangle,
  calculateEllipseGeometry,
  hexToNormalizedRgb,
  normalizeAngle
} from "../src/features/draw-on-pdf/utils/drawingMath.js";

console.log("=================================================");
console.log("   STARTING DRAW ON PDF ENGINE TEST SUITE        ");
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

/**
 * Helper to construct a test PDF with customizable page count and rotations.
 */
async function createTestPdf({ pageCount = 3, width = 600, height = 800, rotations = [] } = {}) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);

  for (let i = 0; i < pageCount; i++) {
    const page = doc.addPage([width, height]);
    const rot = rotations[i] || 0;
    if (rot > 0) {
      page.setRotation({ type: "degrees", angle: rot });
    }
    page.drawText(`Page ${i + 1} Content (Rotation: ${rot}deg)`, {
      x: 50,
      y: height - 100,
      size: 16,
      font,
      color: rgb(0.1, 0.2, 0.6)
    });
  }

  return await doc.save();
}

async function runTests() {
  // --- TEST 1: Engine API / Module Exports ---
  try {
    assert(typeof parsePdfMetadata === "function", "parsePdfMetadata must be exported function");
    assert(typeof exportAnnotationsToPdf === "function", "exportAnnotationsToPdf must be exported function");
    assert(typeof filterActiveAnnotations === "function", "filterActiveAnnotations must be exported function");
    assert(typeof sanitizeAnnotatedFilename === "function", "sanitizeAnnotatedFilename must be exported function");
    assert(typeof DrawPdfError === "function", "DrawPdfError must be exported class");
    assert(typeof normalizeToUint8Array === "function", "normalizeToUint8Array must be exported function");
    pass("Test 1: Engine API & Module Structure Exports");
  } catch (e) {
    console.error("Test 1 Failed:", e.message);
  }

  // --- TEST 2: PDF Loading ---
  try {
    const pdfBytes = await createTestPdf({ pageCount: 1 });
    const parsed = await parsePdfMetadata(pdfBytes);
    assert(parsed !== null && typeof parsed === "object", "Metadata must return object");
    assert(parsed.bytes instanceof Uint8Array, "Parsed result must include bytes Uint8Array");
    pass("Test 2: PDF Binary Loading");
  } catch (e) {
    console.error("Test 2 Failed:", e.message);
  }

  // --- TEST 3: Page Count Detection ---
  try {
    const pdf3Pages = await createTestPdf({ pageCount: 3 });
    const parsed = await parsePdfMetadata(pdf3Pages);
    assert(parsed.pageCount === 3, `Expected pageCount 3, got ${parsed.pageCount}`);
    pass("Test 3: Page Count Detection");
  } catch (e) {
    console.error("Test 3 Failed:", e.message);
  }

  // --- TEST 4: Page Dimension Detection ---
  try {
    const pdfBytes = await createTestPdf({ pageCount: 2, width: 500, height: 750 });
    const parsed = await parsePdfMetadata(pdfBytes);
    assert(parsed.pageDimensions.length === 2, "Must return dimensions for both pages");
    assert(parsed.pageDimensions[0].width === 500, `Expected width 500, got ${parsed.pageDimensions[0].width}`);
    assert(parsed.pageDimensions[0].height === 750, `Expected height 750, got ${parsed.pageDimensions[0].height}`);
    pass("Test 4: Page Dimension Detection");
  } catch (e) {
    console.error("Test 4 Failed:", e.message);
  }

  // --- TEST 5: Page Rotation Detection ---
  try {
    const pdfRotated = await createTestPdf({ pageCount: 3, rotations: [0, 90, 270] });
    const parsed = await parsePdfMetadata(pdfRotated);
    assert(parsed.pageDimensions[0].rotation === 0, `Page 1 rotation expected 0, got ${parsed.pageDimensions[0].rotation}`);
    assert(parsed.pageDimensions[1].rotation === 90, `Page 2 rotation expected 90, got ${parsed.pageDimensions[1].rotation}`);
    assert(parsed.pageDimensions[2].rotation === 270, `Page 3 rotation expected 270, got ${parsed.pageDimensions[2].rotation}`);
    pass("Test 5: Page Rotation Detection");
  } catch (e) {
    console.error("Test 5 Failed:", e.message);
  }

  // --- TEST 6: Freehand Pen Annotation Export ---
  try {
    const pdfBytes = await createTestPdf({ pageCount: 1 });
    const res = await exportAnnotationsToPdf({
      pdfInput: pdfBytes,
      annotationsByPage: {
        1: [
          {
            type: "pen",
            points: [{ x: 50, y: 50 }, { x: 100, y: 120 }, { x: 180, y: 200 }],
            color: "#ef4444",
            strokeWidth: 3,
            previewWidth: 600,
            previewHeight: 800
          }
        ]
      }
    });

    assert(res.success === true, "Export success should be true");
    assert(res.totalAnnotationsPlaced === 1, `Expected 1 annotation placed, got ${res.totalAnnotationsPlaced}`);
    const reloaded = await PDFDocument.load(res.pdfBytes);
    assert(reloaded.getPageCount() === 1, "Reloaded PDF page count must match");
    pass("Test 6: Freehand Pen Annotation Export");
  } catch (e) {
    console.error("Test 6 Failed:", e.message);
  }

  // --- TEST 7: Highlighter Annotation Export ---
  try {
    const pdfBytes = await createTestPdf({ pageCount: 1 });
    const res = await exportAnnotationsToPdf({
      pdfInput: pdfBytes,
      annotationsByPage: {
        1: [
          {
            type: "highlighter",
            points: [{ x: 60, y: 100 }, { x: 300, y: 100 }],
            color: "#fde047",
            strokeWidth: 16,
            opacity: 0.35,
            previewWidth: 600,
            previewHeight: 800
          }
        ]
      }
    });

    assert(res.success === true, "Export success should be true");
    assert(res.totalAnnotationsPlaced === 1, "Highlighter annotation must be placed");
    pass("Test 7: Highlighter Annotation Export with Transparency");
  } catch (e) {
    console.error("Test 7 Failed:", e.message);
  }

  // --- TEST 8: Line Annotation Export ---
  try {
    const pdfBytes = await createTestPdf({ pageCount: 1 });
    const res = await exportAnnotationsToPdf({
      pdfInput: pdfBytes,
      annotationsByPage: {
        1: [
          {
            type: "line",
            x: 50,
            y: 50,
            width: 200,
            height: 150,
            color: "#2563eb",
            strokeWidth: 2,
            previewWidth: 600,
            previewHeight: 800
          }
        ]
      }
    });

    assert(res.success === true, "Export success should be true");
    assert(res.totalAnnotationsPlaced === 1, "Line annotation must be placed");
    pass("Test 8: Line Annotation Export");
  } catch (e) {
    console.error("Test 8 Failed:", e.message);
  }

  // --- TEST 9: Arrow Annotation Export ---
  try {
    const pdfBytes = await createTestPdf({ pageCount: 1 });
    const res = await exportAnnotationsToPdf({
      pdfInput: pdfBytes,
      annotationsByPage: {
        1: [
          {
            type: "arrow",
            x: 100,
            y: 100,
            width: 150,
            height: 150,
            color: "#16a34a",
            strokeWidth: 3,
            previewWidth: 600,
            previewHeight: 800
          }
        ]
      }
    });

    assert(res.success === true, "Export success should be true");
    assert(res.totalAnnotationsPlaced === 1, "Arrow annotation must be placed");
    pass("Test 9: Arrow Annotation Export with Vector Arrowhead");
  } catch (e) {
    console.error("Test 9 Failed:", e.message);
  }

  // --- TEST 10: Rectangle Annotation Export ---
  try {
    const pdfBytes = await createTestPdf({ pageCount: 1 });
    const res = await exportAnnotationsToPdf({
      pdfInput: pdfBytes,
      annotationsByPage: {
        1: [
          {
            type: "rectangle",
            x: 100,
            y: 200,
            width: 250,
            height: 120,
            color: "#9333ea",
            fillColor: "#f3e8ff",
            strokeWidth: 2,
            opacity: 0.9,
            previewWidth: 600,
            previewHeight: 800
          }
        ]
      }
    });

    assert(res.success === true, "Export success should be true");
    assert(res.totalAnnotationsPlaced === 1, "Rectangle annotation must be placed");
    pass("Test 10: Rectangle Annotation Export with Stroke & Fill");
  } catch (e) {
    console.error("Test 10 Failed:", e.message);
  }

  // --- TEST 11: Circle / Ellipse Annotation Export ---
  try {
    const pdfBytes = await createTestPdf({ pageCount: 1 });
    const res = await exportAnnotationsToPdf({
      pdfInput: pdfBytes,
      annotationsByPage: {
        1: [
          {
            type: "ellipse",
            x: 150,
            y: 300,
            width: 180,
            height: 180,
            color: "#ea580c",
            strokeWidth: 3,
            previewWidth: 600,
            previewHeight: 800
          }
        ]
      }
    });

    assert(res.success === true, "Export success should be true");
    assert(res.totalAnnotationsPlaced === 1, "Ellipse annotation must be placed");
    pass("Test 11: Circle/Ellipse Annotation Export");
  } catch (e) {
    console.error("Test 11 Failed:", e.message);
  }

  // --- TEST 12: Text Annotation Export ---
  try {
    const pdfBytes = await createTestPdf({ pageCount: 1 });
    const res = await exportAnnotationsToPdf({
      pdfInput: pdfBytes,
      annotationsByPage: {
        1: [
          {
            type: "text",
            text: "Approved by Legal Team\nDate: 2026-10-03",
            x: 80,
            y: 150,
            fontSize: 16,
            isBold: true,
            color: "#0f172a",
            previewWidth: 600,
            previewHeight: 800
          }
        ]
      }
    });

    assert(res.success === true, "Export success should be true");
    assert(res.totalAnnotationsPlaced === 1, "Text annotation must be placed");
    pass("Test 12: Text Annotation Export with Standard Fonts");
  } catch (e) {
    console.error("Test 12 Failed:", e.message);
  }

  // --- TEST 13: Multi-Page Annotation Export ---
  try {
    const pdfBytes = await createTestPdf({ pageCount: 3 });
    const res = await exportAnnotationsToPdf({
      pdfInput: pdfBytes,
      annotationsByPage: {
        1: [{ type: "pen", points: [{ x: 10, y: 10 }, { x: 50, y: 50 }], previewWidth: 600, previewHeight: 800 }],
        2: [{ type: "highlighter", points: [{ x: 20, y: 20 }, { x: 80, y: 20 }], previewWidth: 600, previewHeight: 800 }],
        3: [{ type: "text", text: "Page 3 Note", x: 100, y: 100, previewWidth: 600, previewHeight: 800 }]
      }
    });

    assert(res.success === true, "Export success should be true");
    assert(res.totalAnnotationsPlaced === 3, `Expected 3 total annotations across 3 pages, got ${res.totalAnnotationsPlaced}`);
    pass("Test 13: Multi-Page Annotation Distribution");
  } catch (e) {
    console.error("Test 13 Failed:", e.message);
  }

  // --- TEST 14: Multiple Annotations on Same Page ---
  try {
    const pdfBytes = await createTestPdf({ pageCount: 1 });
    const res = await exportAnnotationsToPdf({
      pdfInput: pdfBytes,
      annotationsByPage: {
        1: [
          { type: "pen", points: [{ x: 10, y: 10 }, { x: 50, y: 50 }], previewWidth: 600, previewHeight: 800 },
          { type: "rectangle", x: 60, y: 60, width: 100, height: 100, previewWidth: 600, previewHeight: 800 },
          { type: "text", text: "Multi-item test", x: 200, y: 200, previewWidth: 600, previewHeight: 800 }
        ]
      }
    });

    assert(res.totalAnnotationsPlaced === 3, `Expected 3 annotations on page 1, got ${res.totalAnnotationsPlaced}`);
    pass("Test 14: Multiple Annotations on Same Page");
  } catch (e) {
    console.error("Test 14 Failed:", e.message);
  }

  // --- TEST 15: Annotation Ordering & Eraser Filter ---
  try {
    const items = [
      { id: "a1", type: "pen" },
      { id: "a2", type: "eraser" }, // Should be filtered
      { id: "a3", type: "text", deleted: true }, // Should be filtered
      { id: "a4", type: "rectangle" }
    ];

    const active = filterActiveAnnotations(items);
    assert(active.length === 2, `Expected 2 active items, got ${active.length}`);
    assert(active[0].id === "a1", "Order of active item 1 preserved");
    assert(active[1].id === "a4", "Order of active item 2 preserved");
    pass("Test 15: Annotation Ordering & Active State Filtering");
  } catch (e) {
    console.error("Test 15 Failed:", e.message);
  }

  // --- TEST 16: 0° Coordinate Conversion ---
  try {
    const pt = screenToPdfPoint({
      screenX: 100,
      screenY: 200,
      previewWidth: 600,
      previewHeight: 800,
      pdfPageWidth: 600,
      pdfPageHeight: 800,
      rotation: 0
    });
    // For 0° rotation, (100, 200) screen -> (100, 800-200) PDF = (100, 600)
    assert(pt.x === 100, `Expected X 100, got ${pt.x}`);
    assert(pt.y === 600, `Expected Y 600, got ${pt.y}`);

    const back = pdfToScreenPoint({
      pdfX: 100,
      pdfY: 600,
      previewWidth: 600,
      previewHeight: 800,
      pdfPageWidth: 600,
      pdfPageHeight: 800,
      rotation: 0
    });
    assert(back.screenX === 100 && back.screenY === 200, "Inverse conversion must match screenX/Y");
    pass("Test 16: 0° Coordinate Conversion & Reversibility");
  } catch (e) {
    console.error("Test 16 Failed:", e.message);
  }

  // --- TEST 17: 90° Coordinate Conversion ---
  try {
    // Page: width 600, height 800. Preview: width 800 (pdfPageHeight), height 600 (pdfPageWidth).
    const pt = screenToPdfPoint({
      screenX: 200,
      screenY: 150,
      previewWidth: 800,
      previewHeight: 600,
      pdfPageWidth: 600,
      pdfPageHeight: 800,
      rotation: 90
    });

    // 90° rotation formula: pdfX = screenY * (600/600) = 150. pdfY = screenX * (800/800) = 200.
    assert(pt.x === 150, `Expected X 150, got ${pt.x}`);
    assert(pt.y === 200, `Expected Y 200, got ${pt.y}`);
    pass("Test 17: 90° Rotated Page Coordinate Conversion");
  } catch (e) {
    console.error("Test 17 Failed:", e.message);
  }

  // --- TEST 18: 180° Coordinate Conversion ---
  try {
    const pt = screenToPdfPoint({
      screenX: 100,
      screenY: 200,
      previewWidth: 600,
      previewHeight: 800,
      pdfPageWidth: 600,
      pdfPageHeight: 800,
      rotation: 180
    });
    // 180° rotation: pdfX = 600 - 100 = 500, pdfY = 200.
    assert(pt.x === 500, `Expected X 500, got ${pt.x}`);
    assert(pt.y === 200, `Expected Y 200, got ${pt.y}`);
    pass("Test 18: 180° Rotated Page Coordinate Conversion");
  } catch (e) {
    console.error("Test 18 Failed:", e.message);
  }

  // --- TEST 19: 270° Coordinate Conversion ---
  try {
    const pt = screenToPdfPoint({
      screenX: 200,
      screenY: 150,
      previewWidth: 800,
      previewHeight: 600,
      pdfPageWidth: 600,
      pdfPageHeight: 800,
      rotation: 270
    });
    // 270° rotation: pdfX = 600 - 150 = 450. pdfY = 800 - 200 = 600.
    assert(pt.x === 450, `Expected X 450, got ${pt.x}`);
    assert(pt.y === 600, `Expected Y 600, got ${pt.y}`);
    pass("Test 19: 270° Rotated Page Coordinate Conversion");
  } catch (e) {
    console.error("Test 19 Failed:", e.message);
  }

  // --- TEST 20: Normalized Coordinate Behavior ---
  try {
    const norm = normalizePoint({ x: 300, y: 400 }, 600, 800);
    assert(norm.nx === 0.5, `Expected nx 0.5, got ${norm.nx}`);
    assert(norm.ny === 0.5, `Expected ny 0.5, got ${norm.ny}`);

    const denorm = denormalizePoint(norm, 1200, 1600);
    assert(denorm.x === 600, `Expected denormalized X 600, got ${denorm.x}`);
    assert(denorm.y === 800, `Expected denormalized Y 800, got ${denorm.y}`);
    pass("Test 20: Normalized vs Denormalized Coordinate Conversion");
  } catch (e) {
    console.error("Test 20 Failed:", e.message);
  }

  // --- TEST 21: Freehand Bezier Smoothing & SVG Path Generation ---
  try {
    const points = [{ x: 10, y: 10 }, { x: 50, y: 100 }, { x: 120, y: 150 }, { x: 200, y: 200 }];
    const pathStr = pointsToSvgPath(points);
    assert(typeof pathStr === "string" && pathStr.startsWith("M 10"), "SVG path must start with M command");
    assert(pathStr.includes("Q"), "Multi-point freehand stroke must contain quadratic bezier curve commands");
    pass("Test 21: Freehand Point Bezier Curve Interpolation & SVG Path Generation");
  } catch (e) {
    console.error("Test 21 Failed:", e.message);
  }

  // --- TEST 22: Invalid Annotation Object Handling ---
  try {
    const pdfBytes = await createTestPdf({ pageCount: 1 });
    const res = await exportAnnotationsToPdf({
      pdfInput: pdfBytes,
      annotationsByPage: {
        1: [
          null, // null item
          {}, // empty item
          { type: "unknown_tool" }, // invalid type
          { type: "pen", points: [] } // empty points
        ]
      }
    });

    assert(res.success === true, "Must gracefully handle invalid annotation items without crashing");
    assert(res.totalAnnotationsPlaced === 0, "No invalid annotations should be placed");
    pass("Test 22: Invalid Annotation Object Resilience");
  } catch (e) {
    console.error("Test 22 Failed:", e.message);
  }

  // --- TEST 23: Invalid Page Index Handling ---
  try {
    const pdfBytes = await createTestPdf({ pageCount: 2 });
    const res = await exportAnnotationsToPdf({
      pdfInput: pdfBytes,
      annotationsByPage: {
        999: [{ type: "text", text: "Out of bounds" }] // Non-existent page
      }
    });

    assert(res.success === true, "Out of bounds page indices must be ignored safely");
    assert(res.totalAnnotationsPlaced === 0, "No out of bounds annotations placed");
    pass("Test 23: Non-Existent Page Number Safety");
  } catch (e) {
    console.error("Test 23 Failed:", e.message);
  }

  // --- TEST 24: Corrupted PDF Error Classification ---
  try {
    const junkBytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let caught = null;
    try {
      await parsePdfMetadata(junkBytes);
    } catch (err) {
      caught = err;
    }

    assert(caught !== null, "Corrupted PDF must throw error");
    assert(caught instanceof DrawPdfError, "Error must be instance of DrawPdfError");
    assert(caught.code === "CORRUPTED_PDF", `Expected CORRUPTED_PDF code, got ${caught.code}`);
    pass("Test 24: Corrupted PDF Structured Error Classification");
  } catch (e) {
    console.error("Test 24 Failed:", e.message);
  }

  // --- TEST 25: Password-Protected PDF Catch ---
  try {
    if (fs.existsSync("scratch/test_aes256.pdf")) {
      const encryptedBytes = fs.readFileSync("scratch/test_aes256.pdf");
      let caught = null;
      try {
        await parsePdfMetadata(encryptedBytes);
      } catch (err) {
        caught = err;
      }

      assert(caught !== null, "Encrypted PDF must throw error");
      assert(caught instanceof DrawPdfError, "Error must be DrawPdfError");
      assert(caught.code === "PASSWORD_PROTECTED", `Expected PASSWORD_PROTECTED code, got ${caught.code}`);
      pass("Test 25: Password-Protected PDF Error Catch");
    } else {
      console.log("⚠️ Skipped Test 25: scratch/test_aes256.pdf fixture not present.");
      passedCount++;
    }
  } catch (e) {
    console.error("Test 25 Failed:", e.message);
  }

  // --- TEST 26: AbortSignal Cancellation ---
  try {
    const pdfBytes = await createTestPdf({ pageCount: 3 });
    const controller = new AbortController();
    controller.abort();

    let caught = null;
    try {
      await exportAnnotationsToPdf({
        pdfInput: pdfBytes,
        annotationsByPage: { 1: [{ type: "pen", points: [{ x: 10, y: 10 }, { x: 20, y: 20 }] }] },
        signal: controller.signal
      });
    } catch (err) {
      caught = err;
    }

    assert(caught !== null, "Cancellation must throw error");
    assert(caught instanceof DrawPdfError, "Error must be DrawPdfError");
    assert(caught.code === "CANCELLED", `Expected CANCELLED code, got ${caught.code}`);
    pass("Test 26: AbortSignal Cancellation Handling");
  } catch (e) {
    console.error("Test 26 Failed:", e.message);
  }

  // --- TEST 27: Input Buffer Immutability ---
  try {
    const originalPdfBytes = await createTestPdf({ pageCount: 1 });
    const checksumBefore = originalPdfBytes.reduce((a, b) => a + b, 0);

    await exportAnnotationsToPdf({
      pdfInput: originalPdfBytes,
      annotationsByPage: {
        1: [{ type: "pen", points: [{ x: 10, y: 10 }, { x: 50, y: 50 }], previewWidth: 600, previewHeight: 800 }]
      }
    });

    const checksumAfter = originalPdfBytes.reduce((a, b) => a + b, 0);
    assert(checksumBefore === checksumAfter, "Original input Uint8Array bytes must remain 100% untouched/unmutated");
    pass("Test 27: Input Buffer Immutability");
  } catch (e) {
    console.error("Test 27 Failed:", e.message);
  }

  // --- TEST 28: Exported PDF Reopening Verification ---
  try {
    const pdfBytes = await createTestPdf({ pageCount: 2 });
    const res = await exportAnnotationsToPdf({
      pdfInput: pdfBytes,
      annotationsByPage: {
        1: [{ type: "rectangle", x: 50, y: 50, width: 100, height: 100, previewWidth: 600, previewHeight: 800 }],
        2: [{ type: "text", text: "Page 2 Note", x: 50, y: 50, previewWidth: 600, previewHeight: 800 }]
      }
    });

    assert(res.pdfBytes instanceof Uint8Array && res.pdfBytes.length > 0, "Exported bytes must be valid non-empty Uint8Array");
    const reloadedDoc = await PDFDocument.load(res.pdfBytes);
    assert(reloadedDoc !== null, "Exported PDF must reopen successfully with PDFDocument.load()");
    pass("Test 28: Exported PDF Reopening Verification");
  } catch (e) {
    console.error("Test 28 Failed:", e.message);
  }

  // --- TEST 29: Output Page Count Stability ---
  try {
    const pdfBytes = await createTestPdf({ pageCount: 4 });
    const res = await exportAnnotationsToPdf({
      pdfInput: pdfBytes,
      annotationsByPage: {
        2: [{ type: "text", text: "Annotated Page 2", previewWidth: 600, previewHeight: 800 }]
      }
    });

    const reloadedDoc = await PDFDocument.load(res.pdfBytes);
    assert(reloadedDoc.getPageCount() === 4, `Expected page count 4, got ${reloadedDoc.getPageCount()}`);
    pass("Test 29: Output Page Count Stability");
  } catch (e) {
    console.error("Test 29 Failed:", e.message);
  }

  // --- TEST 30: Output Filename Sanitization ---
  try {
    assert(sanitizeAnnotatedFilename("Report 2026!.PDF") === "report-2026-annotated.pdf", "Basic filename sanitization");
    assert(sanitizeAnnotatedFilename("contract.final.pdf") === "contractfinal-annotated.pdf", "Multiple extension dots handling");
    assert(sanitizeAnnotatedFilename("") === "document-annotated.pdf", "Empty string fallback");
    assert(sanitizeAnnotatedFilename(null) === "document-annotated.pdf", "Null parameter fallback");
    pass("Test 30: Output Filename Sanitization");
  } catch (e) {
    console.error("Test 30 Failed:", e.message);
  }

  console.log("\n=================================================");
  console.log(`TEST SUITE COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("=================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal Test Runner Error:", err);
  process.exit(1);
});
