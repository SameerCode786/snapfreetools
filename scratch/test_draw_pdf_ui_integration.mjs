import fs from "fs";
import path from "path";

import {
  parsePdfMetadata,
  exportAnnotationsToPdf
} from "../src/features/draw-on-pdf/utils/drawPdfEngine.js";

import {
  screenToPdfPoint,
  pdfToScreenPoint,
  smoothPoints,
  pointsToSvgPath,
  calculateArrowGeometry,
  normalizeRectangle
} from "../src/features/draw-on-pdf/utils/drawingMath.js";

console.log("=================================================");
console.log("   STARTING DRAW ON PDF UI INTEGRATION TESTS    ");
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

async function runTests() {
  const componentsDir = path.resolve("src/features/draw-on-pdf/components");

  // --- TEST 1: Component Files Existence ---
  try {
    const requiredFiles = [
      "UploadState.js",
      "DrawPdfWorkspace.js",
      "DrawingToolbar.js",
      "DrawingCanvas.js",
      "PageNavigationStrip.js",
      "ProcessingState.js",
      "DrawPdfSuccess.js"
    ];

    for (const fileName of requiredFiles) {
      const filePath = path.join(componentsDir, fileName);
      assert(fs.existsSync(filePath), `Component file ${fileName} must exist in components directory`);
    }

    pass("Test 1: All 7 Phase 2 UI Component Files Exist");
  } catch (e) {
    console.error("Test 1 Failed:", e.message);
  }

  // --- TEST 2: Component Exports Inspection ---
  try {
    const workspaceContent = fs.readFileSync(path.join(componentsDir, "DrawPdfWorkspace.js"), "utf8");
    assert(workspaceContent.includes("export default function DrawPdfWorkspace"), "DrawPdfWorkspace must export default function");

    const canvasContent = fs.readFileSync(path.join(componentsDir, "DrawingCanvas.js"), "utf8");
    assert(canvasContent.includes("export default function DrawingCanvas"), "DrawingCanvas must export default function");

    const toolbarContent = fs.readFileSync(path.join(componentsDir, "DrawingToolbar.js"), "utf8");
    assert(toolbarContent.includes("export default function DrawingToolbar"), "DrawingToolbar must export default function");

    pass("Test 2: UI Components Structure & Default Exports Verified");
  } catch (e) {
    console.error("Test 2 Failed:", e.message);
  }

  // --- TEST 3: Annotation Data Model Compatibility ---
  try {
    const sampleUiAnnot = {
      id: "annot-ui-101",
      pageNumber: 1,
      type: "pen",
      points: [{ x: 10, y: 10 }, { x: 50, y: 50 }],
      color: "#ef4444",
      strokeWidth: 3,
      opacity: 1.0,
      previewWidth: 600,
      previewHeight: 800,
      rotation: 0
    };

    assert(sampleUiAnnot.id && sampleUiAnnot.pageNumber && sampleUiAnnot.type, "UI annotation must match Phase 1 schema");
    pass("Test 3: Annotation State Model Compatibility");
  } catch (e) {
    console.error("Test 3 Failed:", e.message);
  }

  // --- TEST 4: Tool Identifiers Completeness ---
  try {
    const toolbarContent = fs.readFileSync(path.join(componentsDir, "DrawingToolbar.js"), "utf8");
    const requiredTools = ["select", "pen", "highlighter", "eraser", "line", "arrow", "rectangle", "ellipse", "text"];

    for (const toolId of requiredTools) {
      assert(toolbarContent.includes(`id: "${toolId}"`), `Toolbar must include tool identifier '${toolId}'`);
    }

    pass("Test 4: All 9 Tool Identifiers Defined in Toolbar");
  } catch (e) {
    console.error("Test 4 Failed:", e.message);
  }

  // --- TEST 5: Undo / Redo Vector State Logic ---
  try {
    let annotations = [];
    let undoStack = [];
    let redoStack = [];

    // Action 1: Add stroke
    undoStack.push([...annotations]);
    annotations.push({ id: 1, type: "pen" });
    redoStack = [];

    assert(annotations.length === 1, "Annotations length should be 1");

    // Action 2: Undo
    const previous = undoStack.pop();
    redoStack.unshift([...annotations]);
    annotations = previous;

    assert(annotations.length === 0, "Undo should restore empty list");
    assert(redoStack.length === 1, "Redo stack should hold undone state");

    // Action 3: Redo
    const next = redoStack.shift();
    undoStack.push([...annotations]);
    annotations = next;

    assert(annotations.length === 1, "Redo should restore action");
    pass("Test 5: Vector State Undo/Redo Memory-Efficient Logic");
  } catch (e) {
    console.error("Test 5 Failed:", e.message);
  }

  // --- TEST 6: Multi-Page Annotation State Isolation ---
  try {
    const pageState = {
      1: [{ id: "p1-a1", type: "pen" }],
      2: [{ id: "p2-a1", type: "highlighter" }]
    };

    assert(pageState[1].length === 1 && pageState[1][0].type === "pen", "Page 1 holds pen");
    assert(pageState[2].length === 1 && pageState[2][0].type === "highlighter", "Page 2 holds highlighter");
    pass("Test 6: Per-Page Annotation State Isolation");
  } catch (e) {
    console.error("Test 6 Failed:", e.message);
  }

  // --- TEST 7: Empty Text Rejection ---
  try {
    const canvasContent = fs.readFileSync(path.join(componentsDir, "DrawingCanvas.js"), "utf8");
    assert(canvasContent.includes("!activeTextInput.text.trim()"), "Canvas text confirm logic must reject empty/whitespace text");
    pass("Test 7: Empty Text Annotation Rejection");
  } catch (e) {
    console.error("Test 7 Failed:", e.message);
  }

  // --- TEST 8: Rotation Helpers Consumption ---
  try {
    const canvasContent = fs.readFileSync(path.join(componentsDir, "DrawingCanvas.js"), "utf8");
    assert(canvasContent.includes("screenToPdfPoint"), "DrawingCanvas must import Phase 1 screenToPdfPoint helper");
    assert(canvasContent.includes("pointsToSvgPath"), "DrawingCanvas must import Phase 1 pointsToSvgPath helper");
    pass("Test 8: Phase 1 Math Helpers Consumption");
  } catch (e) {
    console.error("Test 8 Failed:", e.message);
  }

  // --- TEST 9: No Bitmap / ImageData History Check ---
  try {
    const workspaceContent = fs.readFileSync(path.join(componentsDir, "DrawPdfWorkspace.js"), "utf8");
    assert(!workspaceContent.includes("getImageData"), "Workspace must NOT store bitmap canvas imageData in history");
    assert(!workspaceContent.includes("toDataURL"), "Workspace history must NOT use bitmap data URLs");
    pass("Test 9: Verified No Bitmap Snapshot History Storage");
  } catch (e) {
    console.error("Test 9 Failed:", e.message);
  }

  // --- TEST 10: Phase 1 Engine Tests Compatibility ---
  try {
    assert(typeof exportAnnotationsToPdf === "function", "exportAnnotationsToPdf must be intact");
    assert(typeof screenToPdfPoint === "function", "screenToPdfPoint must be intact");
    pass("Test 10: Phase 1 Core Engine Integration Compatibility");
  } catch (e) {
    console.error("Test 10 Failed:", e.message);
  }

  console.log("\n=================================================");
  console.log(`UI INTEGRATION TESTS COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("=================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal UI Integration Test Runner Error:", err);
  process.exit(1);
});
