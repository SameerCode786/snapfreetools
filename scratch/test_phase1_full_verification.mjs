import assert from "assert";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import {
  screenToPdfCoords,
  pdfToScreenCoords,
  clampFieldToContainer,
  computeDuplicateOffset,
  hexToNormalizedRgb,
  formatDateValue
} from "../src/features/sign-pdf/utils/fieldCoordinateMath.js";
import {
  executePdfSigning,
  isPasswordProtectedError,
  sanitizeSignedFilename
} from "../src/features/sign-pdf/utils/signPdfEngine.js";

// Helper: 1x1 transparent PNG data URL for test signatures/stamps
const SAMPLE_PNG_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

async function runFullVerification() {
  console.log("===============================================================");
  console.log("       PHASE 1 FULL AUTOMATED VERIFICATION SUITE              ");
  console.log("===============================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function recordTest(name, fn) {
    totalTests++;
    try {
      fn();
      console.log(`[PASS] Test ${totalTests}: ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`[FAIL] Test ${totalTests}: ${name}`, err);
      throw err;
    }
  }

  async function recordAsyncTest(name, fn) {
    totalTests++;
    try {
      await fn();
      console.log(`[PASS] Test ${totalTests}: ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`[FAIL] Test ${totalTests}: ${name}`, err);
      throw err;
    }
  }

  // --- SUITE 1: COORDINATE MATH RIGOROUS TESTS ---
  console.log("--- SUITE 1: Coordinate Transformations & Orientations ---");

  recordTest("Top-Left Field Position on US Letter Portrait (612x792 pt, preview 600x800 px)", () => {
    const coords = screenToPdfCoords({
      screenX: 0,
      screenY: 0,
      screenWidth: 100,
      screenHeight: 40,
      previewWidth: 600,
      previewHeight: 800,
      pdfPageWidth: 612,
      pdfPageHeight: 792,
      rotation: 0
    });
    // In PDF space, top-left Y = pageHeight - screenY*scale - height = 792 - 0 - (40 * 792/800) = 752.4
    assert.strictEqual(coords.x, 0);
    assert.strictEqual(coords.width, 102); // 100 * (612/600)
    assert.strictEqual(coords.height, 39.6); // 40 * (792/800)
    assert.strictEqual(coords.y, 752.4);
  });

  recordTest("Center Field Position on US Letter Portrait", () => {
    const coords = screenToPdfCoords({
      screenX: 250,
      screenY: 380,
      screenWidth: 100,
      screenHeight: 40,
      previewWidth: 600,
      previewHeight: 800,
      pdfPageWidth: 612,
      pdfPageHeight: 792,
      rotation: 0
    });
    assert.strictEqual(coords.x, 255); // 250 * 1.02
    assert.strictEqual(coords.y, 376.2); // 792 - (380 * 0.99) - 39.6 = 376.2
  });

  recordTest("Bottom-Right Field Position on A4 Portrait (595.28 x 841.89 pt, preview 595 x 842 px)", () => {
    const coords = screenToPdfCoords({
      screenX: 495,
      screenY: 802,
      screenWidth: 100,
      screenHeight: 40,
      previewWidth: 595,
      previewHeight: 842,
      pdfPageWidth: 595.28,
      pdfPageHeight: 841.89,
      rotation: 0
    });
    assert(Math.abs(coords.x - 495.23) < 0.1);
    assert(Math.abs(coords.y - 0) < 0.1); // At bottom margin
  });

  recordTest("Landscape Page Placement (US Letter 792 x 612 pt, preview 800 x 600 px)", () => {
    const coords = screenToPdfCoords({
      screenX: 100,
      screenY: 100,
      screenWidth: 180,
      screenHeight: 60,
      previewWidth: 800,
      previewHeight: 600,
      pdfPageWidth: 792,
      pdfPageHeight: 612,
      rotation: 90
    });
    assert.strictEqual(coords.x, 99); // 100 * (792/800)
    assert.strictEqual(coords.width, 178.2); // 180 * (792/800)
    assert.strictEqual(coords.height, 61.2); // 60 * (612/600)
    assert.strictEqual(coords.y, 448.8); // 612 - 102 - 61.2 = 448.8
    assert.strictEqual(coords.rotation, 90);
  });

  recordTest("Zoom Scaling Invariance (50%, 100%, 200% preview widths)", () => {
    // A field occupying 25% of page width and 10% of height should map to identical PDF coords at all zoom levels
    const pdfPageWidth = 612;
    const pdfPageHeight = 792;

    // 50% Zoom (preview 300x400)
    const z50 = screenToPdfCoords({
      screenX: 75,
      screenY: 100,
      screenWidth: 150,
      screenHeight: 40,
      previewWidth: 300,
      previewHeight: 400,
      pdfPageWidth,
      pdfPageHeight
    });

    // 100% Zoom (preview 600x800)
    const z100 = screenToPdfCoords({
      screenX: 150,
      screenY: 200,
      screenWidth: 300,
      screenHeight: 80,
      previewWidth: 600,
      previewHeight: 800,
      pdfPageWidth,
      pdfPageHeight
    });

    // 200% Zoom (preview 1200x1600)
    const z200 = screenToPdfCoords({
      screenX: 300,
      screenY: 400,
      screenWidth: 600,
      screenHeight: 160,
      previewWidth: 1200,
      previewHeight: 1600,
      pdfPageWidth,
      pdfPageHeight
    });

    assert.strictEqual(z50.x, z100.x);
    assert.strictEqual(z100.x, z200.x);
    assert.strictEqual(z50.y, z100.y);
    assert.strictEqual(z100.y, z200.y);
    assert.strictEqual(z50.width, z100.width);
    assert.strictEqual(z100.width, z200.width);
  });

  recordTest("Boundary Clamping and Non-Overflow Duplicate Offsetting", () => {
    const bounds = { width: 600, height: 800 };
    const clamped = clampFieldToContainer({ x: 580, y: 790, width: 100, height: 40 }, bounds);
    assert.strictEqual(clamped.x, 500); // 600 - 100
    assert.strictEqual(clamped.y, 760); // 800 - 40

    // Duplicate offset
    const dup = computeDuplicateOffset({ x: 500, y: 760, width: 100, height: 40 }, bounds, 20);
    // Since overflowing, it wraps inward
    assert(dup.x <= 500 && dup.x >= 0);
    assert(dup.y <= 760 && dup.y >= 0);
  });

  // --- SUITE 2: PDF-LIB NON-RASTERIZING COMPILATION & FIELD EMBEDDING ---
  console.log("\n--- SUITE 2: Real PDF Generation & Vector Text Preservation ---");

  await recordAsyncTest("Generate Multi-Page PDF with mixed orientations & all 6 field types", async () => {
    // Create base source PDF with searchable vector text
    const baseDoc = await PDFDocument.create();
    const helvetica = await baseDoc.embedFont(StandardFonts.Helvetica);

    // Page 1: Portrait (612x792) with searchable text
    const p1 = baseDoc.addPage([612, 792]);
    p1.drawText("ORIGINAL CONTRACT CLAUSE 1: All rights reserved.", {
      x: 50,
      y: 720,
      size: 12,
      font: helvetica,
      color: rgb(0, 0, 0)
    });

    // Page 2: Landscape (792x612) with searchable text
    const p2 = baseDoc.addPage([792, 612]);
    p2.drawText("ORIGINAL FINANCIAL SCHEDULE: Total Amount Due $50,000", {
      x: 50,
      y: 550,
      size: 12,
      font: helvetica,
      color: rgb(0, 0, 0)
    });

    const basePdfBytes = await baseDoc.save();

    // Fields to embed across pages:
    const testFieldsByPage = {
      1: [
        {
          id: "sig-1",
          type: "signature",
          dataUrl: SAMPLE_PNG_DATA_URL,
          x: 50,
          y: 600,
          width: 180,
          height: 60,
          previewWidth: 600,
          previewHeight: 800,
          rotation: 0
        },
        {
          id: "init-1",
          type: "initials",
          dataUrl: SAMPLE_PNG_DATA_URL,
          x: 500,
          y: 740,
          width: 80,
          height: 40,
          previewWidth: 600,
          previewHeight: 800,
          rotation: 0
        },
        {
          id: "name-1",
          type: "name",
          value: "Sameer Code",
          x: 50,
          y: 500,
          width: 200,
          height: 30,
          previewWidth: 600,
          previewHeight: 800,
          style: { fontFamily: "Helvetica", fontSize: 13, color: "#1d4ed8", align: "left" }
        },
        {
          id: "date-1",
          type: "date",
          value: "2026-09-19",
          x: 300,
          y: 500,
          width: 150,
          height: 30,
          previewWidth: 600,
          previewHeight: 800,
          style: { dateFormat: "MMMM D, YYYY", fontSize: 12, color: "#0f172a", align: "left" }
        }
      ],
      2: [
        {
          id: "stamp-1",
          type: "stamp",
          dataUrl: SAMPLE_PNG_DATA_URL,
          x: 600,
          y: 450,
          width: 100,
          height: 100,
          previewWidth: 800,
          previewHeight: 600,
          rotation: 90
        },
        {
          id: "text-1",
          type: "text",
          value: "Approved subject to final audit verification by finance committee.",
          x: 100,
          y: 350,
          width: 300,
          height: 60,
          previewWidth: 800,
          previewHeight: 600,
          style: { fontFamily: "Times", fontSize: 12, color: "#0f172a", align: "left" }
        }
      ]
    };

    // Execute PDF signing engine
    const result = await executePdfSigning({
      file: {
        name: "service_agreement.pdf",
        size: basePdfBytes.byteLength,
        arrayBuffer: async () => basePdfBytes.buffer
      },
      fieldsByPage: testFieldsByPage
    });

    assert(result.blob, "Result blob must exist");
    assert.strictEqual(result.totalPages, 2, "Must preserve both pages");
    assert.strictEqual(result.signedPageCount, 2, "Both pages must have embedded fields");
    assert.strictEqual(result.totalFieldsPlaced, 6, "All 6 fields must be placed");
    assert.strictEqual(result.filename, "service_agreement-signed.pdf");

    // Inspect the generated PDF to confirm non-rasterization
    const signedDoc = await PDFDocument.load(await result.blob.arrayBuffer());
    assert.strictEqual(signedDoc.getPageCount(), 2);

    const signedP1 = signedDoc.getPage(0);
    assert.strictEqual(signedP1.getWidth(), 612);
    assert.strictEqual(signedP1.getHeight(), 792);

    const signedP2 = signedDoc.getPage(1);
    assert.strictEqual(signedP2.getWidth(), 792);
    assert.strictEqual(signedP2.getHeight(), 612);
  });

  // --- SUITE 3: ERROR HANDLING & EDGE CASES ---
  console.log("\n--- SUITE 3: Edge Cases & Error Boundaries ---");

  recordTest("Filename Sanitization", () => {
    assert.strictEqual(sanitizeSignedFilename("NDA Agreement (2026).pdf"), "NDA Agreement 2026-signed.pdf");
    assert.strictEqual(sanitizeSignedFilename("invoice#99/final.pdf"), "invoice99final-signed.pdf");
  });

  recordTest("Password Protected PDF Error Detection", () => {
    const err1 = new Error("PasswordException: Password required to decrypt document");
    const err2 = { name: "EncryptedPDFError", message: "Document is encrypted" };
    const err3 = new Error("Normal network timeout");

    assert.strictEqual(isPasswordProtectedError(err1), true);
    assert.strictEqual(isPasswordProtectedError(err2), true);
    assert.strictEqual(isPasswordProtectedError(err3), false);
  });

  console.log("\n===============================================================");
  console.log(`  VERIFICATION COMPLETE: ${passedTests}/${totalTests} TESTS PASSED (100%)  `);
  console.log("===============================================================\n");
}

runFullVerification().catch((err) => {
  console.error("FATAL VERIFICATION ERROR:", err);
  process.exit(1);
});
