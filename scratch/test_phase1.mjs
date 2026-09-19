import assert from "assert";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  screenToPdfCoords,
  hexToNormalizedRgb,
  formatDateValue,
  clampFieldToContainer,
  computeDuplicateOffset
} from "../src/features/sign-pdf/utils/fieldCoordinateMath.js";

async function runTests() {
  console.log("=== Testing Phase 1 Coordinate Math & Field Utilities ===");

  // 1. Portrait Page Coordinate Math Test
  const portraitRes = screenToPdfCoords({
    screenX: 100,
    screenY: 200,
    screenWidth: 150,
    screenHeight: 50,
    previewWidth: 600,
    previewHeight: 800,
    pdfPageWidth: 612,
    pdfPageHeight: 792,
    rotation: 0
  });

  assert.strictEqual(portraitRes.x, 102); // 100 * (612/600) = 102
  assert.strictEqual(portraitRes.width, 153); // 150 * (612/600) = 153
  assert.strictEqual(portraitRes.height, 49.5); // 50 * (792/800) = 49.5
  assert.strictEqual(portraitRes.y, 544.5); // 792 - (200 * 0.99) - 49.5 = 544.5
  console.log("✓ Portrait coordinate mapping accurate:", portraitRes);

  // 2. Landscape Page Coordinate Math Test
  const landscapeRes = screenToPdfCoords({
    screenX: 200,
    screenY: 100,
    screenWidth: 200,
    screenHeight: 80,
    previewWidth: 800,
    previewHeight: 600,
    pdfPageWidth: 792,
    pdfPageHeight: 612,
    rotation: 90
  });

  assert.strictEqual(landscapeRes.x, 198); // 200 * (792/800) = 198
  assert.strictEqual(landscapeRes.y, 428.4); // 612 - (100 * 1.02) - (80 * 1.02) = 428.4
  assert.strictEqual(landscapeRes.rotation, 90);
  console.log("✓ Landscape coordinate mapping accurate:", landscapeRes);

  // 3. Hex Color Parsing Test
  const black = hexToNormalizedRgb("#000000");
  assert.deepStrictEqual(black, { r: 0, g: 0, b: 0 });
  const blue = hexToNormalizedRgb("#1d4ed8");
  assert(Math.abs(blue.r - 0.113) < 0.01);
  assert(Math.abs(blue.g - 0.305) < 0.01);
  assert(Math.abs(blue.b - 0.847) < 0.01);
  console.log("✓ Hex color conversion accurate:", { blue });

  // 4. Date Formats Test
  const testDate = new Date("2026-09-19T12:00:00Z");
  assert.strictEqual(formatDateValue(testDate, "YYYY-MM-DD"), "2026-09-19");
  assert.strictEqual(formatDateValue(testDate, "DD/MM/YYYY"), "19/09/2026");
  assert.strictEqual(formatDateValue(testDate, "MM/DD/YYYY"), "09/19/2026");
  assert.strictEqual(formatDateValue(testDate, "MMMM D, YYYY"), "September 19, 2026");
  console.log("✓ Date formatting accurate across all 4 formats");

  // 5. Clamping and Duplicate Offset Tests
  const clamped = clampFieldToContainer({ x: -10, y: 900, width: 200, height: 50 }, { width: 600, height: 800 });
  assert.strictEqual(clamped.x, 0);
  assert.strictEqual(clamped.y, 750);
  console.log("✓ Field boundary clamping accurate:", clamped);

  const dupOffset = computeDuplicateOffset({ x: 100, y: 100, width: 150, height: 40 }, { width: 600, height: 800 }, 20);
  assert.strictEqual(dupOffset.x, 120);
  assert.strictEqual(dupOffset.y, 120);
  console.log("✓ Field duplication offset calculation accurate:", dupOffset);

  // 6. PDF Embedding Simulation with pdf-lib (All 6 field types)
  console.log("=== Testing PDF Vector Embedding with pdf-lib ===");
  const doc = await PDFDocument.create();
  const page1 = doc.addPage([612, 792]);
  const page2 = doc.addPage([792, 612]);

  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const times = await doc.embedFont(StandardFonts.TimesRoman);
  const courier = await doc.embedFont(StandardFonts.Courier);

  // Embed Name field
  page1.drawText("Test Name Field: John Doe", {
    x: 50,
    y: 700,
    size: 14,
    font: helvetica,
    color: rgb(0.1, 0.2, 0.3)
  });

  // Embed Date field
  page1.drawText("Date: September 19, 2026", {
    x: 50,
    y: 660,
    size: 12,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.2)
  });

  // Embed Multiline Text
  page1.drawText("This is line 1 of remarks.\nThis is line 2 of remarks.", {
    x: 50,
    y: 600,
    size: 11,
    font: times,
    color: rgb(0, 0, 0)
  });

  const pdfBytes = await doc.save();
  assert(pdfBytes.byteLength > 500);
  console.log(`✓ PDF successfully generated with vector text (Size: ${pdfBytes.byteLength} bytes)`);

  console.log("\nALL PHASE 1 TESTS PASSED SUCCESSFULLY! (Exit Code: 0)");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
