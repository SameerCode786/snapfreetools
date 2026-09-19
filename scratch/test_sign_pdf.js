import { PDFDocument, rgb } from "pdf-lib";
import {
  mapPreviewCoordsToPdfCoords,
  sanitizeSignedFilename,
  executePdfSigning
} from "../src/features/sign-pdf/utils/signPdfEngine.js";
import {
  generateTypedSignatureDataUrl,
  SIGNATURE_FONTS
} from "../src/features/sign-pdf/utils/signatureCanvasUtils.js";

async function runSignPdfTests() {
  console.log("=== SIGN PDF ENGINE UNIT & INTEGRATION TESTS ===");

  // TEST 1: Coordinate Mapping for Portrait Page
  console.log("\n--- TEST 1: Coordinate Mapping (Portrait A4 Page) ---");
  const portraitPdfWidth = 595.28;
  const portraitPdfHeight = 841.89;
  const previewWidth = 600;
  const previewHeight = 848.74;

  // 1A. Top-Left Placement
  const topLeftMapped = mapPreviewCoordsToPdfCoords({
    previewWidth,
    previewHeight,
    pdfPageWidth: portraitPdfWidth,
    pdfPageHeight: portraitPdfHeight,
    sigX: 20,
    sigY: 30,
    sigWidth: 150,
    sigHeight: 50,
    rotation: 0
  });
  console.log("Top-Left mapped:", topLeftMapped);
  // In PDF, top-left Y should be near top of page (portraitPdfHeight - 30*scale - 50*scale)
  const expectedY = portraitPdfHeight - (30 * (portraitPdfHeight / previewHeight)) - (50 * (portraitPdfHeight / previewHeight));
  if (Math.abs(topLeftMapped.y - expectedY) > 1.0) {
    throw new Error(`Top-left Y mismatch: expected ~${expectedY}, got ${topLeftMapped.y}`);
  }
  console.log("TEST 1A: PASS - Top-left coordinate mapped accurately to PDF space!");

  // 1B. Center Placement
  const centerMapped = mapPreviewCoordsToPdfCoords({
    previewWidth,
    previewHeight,
    pdfPageWidth: portraitPdfWidth,
    pdfPageHeight: portraitPdfHeight,
    sigX: 225,
    sigY: 399,
    sigWidth: 150,
    sigHeight: 50,
    rotation: 90
  });
  console.log("Center mapped (with 90deg rotation):", centerMapped);
  if (centerMapped.rotation !== 90) {
    throw new Error("Rotation degrees not preserved");
  }
  console.log("TEST 1B: PASS - Center placement and rotation preserved!");

  // TEST 2: Coordinate Mapping for Landscape Page
  console.log("\n--- TEST 2: Coordinate Mapping (Landscape Page) ---");
  const landscapePdfWidth = 841.89;
  const landscapePdfHeight = 595.28;
  const landscapePreviewWidth = 848.74;
  const landscapePreviewHeight = 600;

  const landscapeMapped = mapPreviewCoordsToPdfCoords({
    previewWidth: landscapePreviewWidth,
    previewHeight: landscapePreviewHeight,
    pdfPageWidth: landscapePdfWidth,
    pdfPageHeight: landscapePdfHeight,
    sigX: 100,
    sigY: 200,
    sigWidth: 180,
    sigHeight: 60,
    rotation: 0
  });
  console.log("Landscape mapped:", landscapeMapped);
  if (landscapeMapped.x < 0 || landscapeMapped.y < 0) {
    throw new Error("Landscape coordinates out of bounds");
  }
  console.log("TEST 2: PASS - Landscape coordinates calculated correctly!");

  // TEST 3: Filename Sanitizer
  console.log("\n--- TEST 3: Filename Sanitizer ---");
  const fn1 = sanitizeSignedFilename("NDA Agreement (Draft #1).pdf");
  const fn2 = sanitizeSignedFilename("employment_contract.pdf");
  console.log("Filename 1:", fn1);
  console.log("Filename 2:", fn2);
  if (fn1 !== "NDA Agreement Draft 1-signed.pdf" || fn2 !== "employment_contract-signed.pdf") {
    throw new Error("Filename sanitization failed");
  }
  console.log("TEST 3: PASS - Signed filenames properly formatted!");

  // TEST 4: Full Multi-Page PDF Signing Execution via pdf-lib
  console.log("\n--- TEST 4: Multi-Page PDF Signing Execution ---");
  // 4A. Create a fresh 2-page PDF document in memory
  const testDoc = await PDFDocument.create();
  const page1 = testDoc.addPage([600, 800]);
  page1.drawText("Page 1: Non-Disclosure Agreement Text Content", { x: 50, y: 750, size: 14 });

  const page2 = testDoc.addPage([600, 800]);
  page2.drawText("Page 2: Terms and Signature Page", { x: 50, y: 750, size: 14 });

  const testPdfBytes = await testDoc.save();

  // 4B. Generate 1x1 transparent PNG data URL for testing signature embedding
  // Transparent 1x1 PNG base64
  const testPngDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  const signaturesByPage = {
    1: [
      {
        id: "sig-p1-1",
        dataUrl: testPngDataUrl,
        x: 50,
        y: 650,
        width: 150,
        height: 50,
        previewWidth: 600,
        previewHeight: 800,
        rotation: 0,
        opacity: 1.0,
        includeDate: true,
        dateString: "2026-09-17",
        includeSignerName: true,
        signerName: "Alex Morgan"
      }
    ],
    2: [
      {
        id: "sig-p2-1",
        dataUrl: testPngDataUrl,
        x: 100,
        y: 600,
        width: 180,
        height: 60,
        previewWidth: 600,
        previewHeight: 800,
        rotation: 0,
        opacity: 0.9,
        includeDate: true,
        dateString: "2026-09-17"
      }
    ]
  };

  const dummyFile = {
    name: "Business_Contract.pdf",
    size: testPdfBytes.byteLength,
    arrayBuffer: async () => testPdfBytes.buffer
  };

  const result = await executePdfSigning({
    file: dummyFile,
    signaturesByPage,
    onProgress: (step) => console.log(`Progress: ${step}`)
  });

  console.log("Signed PDF Result:", {
    filename: result.filename,
    originalSize: result.originalSize,
    signedSize: result.signedSize,
    totalPages: result.totalPages,
    signedPageCount: result.signedPageCount,
    totalSignaturesPlaced: result.totalSignaturesPlaced
  });

  if (result.totalPages !== 2 || result.signedPageCount !== 2 || result.totalSignaturesPlaced !== 2) {
    throw new Error("Multi-page signing signature placement mismatch");
  }

  // 4C. Verify signed PDF can be reloaded and parsed
  const verifyDoc = await PDFDocument.load(new Uint8Array(await result.blob.arrayBuffer()));
  if (verifyDoc.getPageCount() !== 2) {
    throw new Error("Generated signed PDF corrupted page count");
  }
  console.log("TEST 4: PASS - Multi-page PDF successfully signed and verified with pdf-lib!");

  console.log("\n==========================================");
  console.log("ALL SIGN PDF TESTS PASSED WITH 100% SUCCESS!");
  console.log("==========================================");
}

runSignPdfTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
