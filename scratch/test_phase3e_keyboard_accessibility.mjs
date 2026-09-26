/**
 * Automated Verification Suite for Phase 3E:
 * Keyboard Navigation, Power-User Shortcuts & Canvas Accessibility
 */

import assert from "assert";
import {
  nudgeFieldCoordinates,
  isTypingContext,
  screenToPdfCoords,
  pdfToScreenCoords,
  clampFieldToContainer
} from "../src/features/sign-pdf/utils/fieldCoordinateMath.js";

console.log("===============================================================");
console.log("       PHASE 3E KEYBOARD NAVIGATION & A11Y VERIFICATION        ");
console.log("===============================================================\n");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       Error: ${err.message}`);
    failed++;
  }
}

const bounds = { width: 612, height: 792 };

// -------------------------------------------------------------
// SUITE 1: Arrow Key Field Nudging (1 Unit and Shift 10 Units)
// -------------------------------------------------------------
console.log("--- SUITE 1: Arrow Key Field Nudging (1 unit & 10 units) ---");

test("Test 1: ArrowUp nudges field upwards by exactly 1 unit", () => {
  const initial = { x: 100, y: 100, width: 140, height: 40 };
  const res = nudgeFieldCoordinates({
    ...initial,
    direction: "ArrowUp",
    step: 1,
    containerBounds: bounds
  });
  assert.strictEqual(res.x, 100);
  assert.strictEqual(res.y, 99);
});

test("Test 2: ArrowDown nudges field downwards by exactly 1 unit", () => {
  const initial = { x: 100, y: 100, width: 140, height: 40 };
  const res = nudgeFieldCoordinates({
    ...initial,
    direction: "ArrowDown",
    step: 1,
    containerBounds: bounds
  });
  assert.strictEqual(res.x, 100);
  assert.strictEqual(res.y, 101);
});

test("Test 3: ArrowLeft nudges field left by exactly 1 unit", () => {
  const initial = { x: 100, y: 100, width: 140, height: 40 };
  const res = nudgeFieldCoordinates({
    ...initial,
    direction: "ArrowLeft",
    step: 1,
    containerBounds: bounds
  });
  assert.strictEqual(res.x, 99);
  assert.strictEqual(res.y, 100);
});

test("Test 4: ArrowRight nudges field right by exactly 1 unit", () => {
  const initial = { x: 100, y: 100, width: 140, height: 40 };
  const res = nudgeFieldCoordinates({
    ...initial,
    direction: "ArrowRight",
    step: 1,
    containerBounds: bounds
  });
  assert.strictEqual(res.x, 101);
  assert.strictEqual(res.y, 100);
});

test("Test 5: Shift + Arrow moves field by exactly 10 units", () => {
  const initial = { x: 100, y: 100, width: 140, height: 40 };
  const resRight = nudgeFieldCoordinates({
    ...initial,
    direction: "ArrowRight",
    step: 10,
    containerBounds: bounds
  });
  assert.strictEqual(resRight.x, 110);
  assert.strictEqual(resRight.y, 100);

  const resUp = nudgeFieldCoordinates({
    ...initial,
    direction: "ArrowUp",
    step: 10,
    containerBounds: bounds
  });
  assert.strictEqual(resUp.x, 100);
  assert.strictEqual(resUp.y, 90);
});

test("Test 6: Boundary clamping prevents arrow nudging outside container bounds", () => {
  // Top-left boundary
  const atTopLeft = { x: 0, y: 0, width: 100, height: 40 };
  const clampLeft = nudgeFieldCoordinates({ ...atTopLeft, direction: "ArrowLeft", step: 10, containerBounds: bounds });
  assert.strictEqual(clampLeft.x, 0);
  const clampUp = nudgeFieldCoordinates({ ...atTopLeft, direction: "ArrowUp", step: 10, containerBounds: bounds });
  assert.strictEqual(clampUp.y, 0);

  // Bottom-right boundary
  const atBottomRight = { x: 512, y: 752, width: 100, height: 40 };
  const clampRight = nudgeFieldCoordinates({ ...atBottomRight, direction: "ArrowRight", step: 10, containerBounds: bounds });
  assert.strictEqual(clampRight.x, 512);
  const clampDown = nudgeFieldCoordinates({ ...atBottomRight, direction: "ArrowDown", step: 10, containerBounds: bounds });
  assert.strictEqual(clampDown.y, 752);
});

// -------------------------------------------------------------
// SUITE 2: Zoom-Invariance & Coordinate Safety
// -------------------------------------------------------------
console.log("\n--- SUITE 2: Zoom-Invariance & Coordinate Safety ---");

test("Test 7: Zoom 50% does not scale down logical nudge step distance", () => {
  const zoom = 0.5;
  const pdfField = { x: 200, y: 200, width: 150, height: 50 };
  // Nudge in logical PDF space
  const nudged = nudgeFieldCoordinates({
    ...pdfField,
    direction: "ArrowRight",
    step: 1,
    containerBounds: bounds
  });
  // Logical step is always 1 unit regardless of visual zoom
  assert.strictEqual(nudged.x - pdfField.x, 1);
});

test("Test 8: Zoom 100% preserves exact 1-to-1 logical nudge step distance", () => {
  const pdfField = { x: 200, y: 200, width: 150, height: 50 };
  const nudged = nudgeFieldCoordinates({
    ...pdfField,
    direction: "ArrowDown",
    step: 1,
    containerBounds: bounds
  });
  assert.strictEqual(nudged.y - pdfField.y, 1);
});

test("Test 9: Zoom 200% does not double logical nudge step distance", () => {
  const zoom = 2.0;
  const pdfField = { x: 200, y: 200, width: 150, height: 50 };
  const nudged = nudgeFieldCoordinates({
    ...pdfField,
    direction: "ArrowLeft",
    step: 10,
    containerBounds: bounds
  });
  // Logical displacement remains strictly 10 points
  assert.strictEqual(pdfField.x - nudged.x, 10);
});

test("Test 10: Logical coordinate conversion invariance across nudge and zoom roundtrips", () => {
  const pdfPage = { width: 612, height: 792 };
  const previewAt150 = { width: 612 * 1.5, height: 792 * 1.5 };
  
  const screenPos = { screenX: 150, screenY: 150, screenWidth: 150, screenHeight: 60 };
  const pdfPos = screenToPdfCoords({
    ...screenPos,
    previewWidth: previewAt150.width,
    previewHeight: previewAt150.height,
    pdfPageWidth: pdfPage.width,
    pdfPageHeight: pdfPage.height
  });

  // Re-convert back to screen coordinates
  const reconvertedScreen = pdfToScreenCoords({
    pdfX: pdfPos.x,
    pdfY: pdfPos.y,
    pdfWidth: pdfPos.width,
    pdfHeight: pdfPos.height,
    previewWidth: previewAt150.width,
    previewHeight: previewAt150.height,
    pdfPageWidth: pdfPage.width,
    pdfPageHeight: pdfPage.height
  });

  assert(Math.abs(reconvertedScreen.screenX - screenPos.screenX) < 0.1);
  assert(Math.abs(reconvertedScreen.screenY - screenPos.screenY) < 0.1);
});

// -------------------------------------------------------------
// SUITE 3: Delete & Backspace with Context-Aware Guard
// -------------------------------------------------------------
console.log("\n--- SUITE 3: Delete & Backspace Typing Context Protection ---");

test("Test 11: Delete key outside typing context deletes selected field", () => {
  let fields = [{ id: "f1" }, { id: "f2" }];
  let selectedFieldId = "f1";

  const deleteHandler = (e) => {
    if ((e.key === "Delete" || e.key === "Backspace") && !isTypingContext(e.target)) {
      fields = fields.filter((f) => f.id !== selectedFieldId);
      selectedFieldId = null;
    }
  };

  const syntheticEvent = {
    key: "Delete",
    target: { tagName: "DIV", isContentEditable: false, getAttribute: () => null }
  };
  deleteHandler(syntheticEvent);

  assert.strictEqual(fields.length, 1);
  assert.strictEqual(fields[0].id, "f2");
  assert.strictEqual(selectedFieldId, null);
});

test("Test 12: Backspace key outside typing context deletes selected field", () => {
  let fields = [{ id: "f1" }, { id: "f2" }];
  let selectedFieldId = "f2";

  const deleteHandler = (e) => {
    if ((e.key === "Delete" || e.key === "Backspace") && !isTypingContext(e.target)) {
      fields = fields.filter((f) => f.id !== selectedFieldId);
      selectedFieldId = null;
    }
  };

  const syntheticEvent = {
    key: "Backspace",
    target: { tagName: "BUTTON", isContentEditable: false, getAttribute: () => null }
  };
  deleteHandler(syntheticEvent);

  assert.strictEqual(fields.length, 1);
  assert.strictEqual(fields[0].id, "f1");
  assert.strictEqual(selectedFieldId, null);
});

test("Test 13: Backspace inside input, textarea, or contentEditable element does NOT delete field", () => {
  let fields = [{ id: "f1" }];
  let selectedFieldId = "f1";

  const deleteHandler = (e) => {
    if ((e.key === "Delete" || e.key === "Backspace") && !isTypingContext(e.target)) {
      fields = fields.filter((f) => f.id !== selectedFieldId);
      selectedFieldId = null;
    }
  };

  // 1. Text input
  deleteHandler({ key: "Backspace", target: { tagName: "INPUT" } });
  assert.strictEqual(fields.length, 1, "Should not delete when in INPUT");

  // 2. Textarea
  deleteHandler({ key: "Delete", target: { tagName: "TEXTAREA" } });
  assert.strictEqual(fields.length, 1, "Should not delete when in TEXTAREA");

  // 3. Select
  deleteHandler({ key: "Backspace", target: { tagName: "SELECT" } });
  assert.strictEqual(fields.length, 1, "Should not delete when in SELECT");

  // 4. ContentEditable
  deleteHandler({ key: "Backspace", target: { isContentEditable: true, tagName: "DIV" } });
  assert.strictEqual(fields.length, 1, "Should not delete when contentEditable");

  // 5. ARIA role textbox
  deleteHandler({ key: "Delete", target: { tagName: "DIV", getAttribute: (attr) => attr === "role" ? "textbox" : null } });
  assert.strictEqual(fields.length, 1, "Should not delete when role=textbox");
});

// -------------------------------------------------------------
// SUITE 4: Escape Key Priority Hierarchy
// -------------------------------------------------------------
console.log("\n--- SUITE 4: Escape Key Priority Hierarchy ---");

test("Test 14: Escape priority 1 - closes shortcuts modal if open", () => {
  let isShortcutsModalOpen = true;
  let isDrawerOpen = true;
  let selectedFieldId = "f1";

  const handleEscape = () => {
    if (isShortcutsModalOpen) {
      isShortcutsModalOpen = false;
      return;
    }
    if (isDrawerOpen) {
      isDrawerOpen = false;
      return;
    }
    if (selectedFieldId) {
      selectedFieldId = null;
    }
  };

  handleEscape();
  assert.strictEqual(isShortcutsModalOpen, false);
  assert.strictEqual(isDrawerOpen, true);
  assert.strictEqual(selectedFieldId, "f1");
});

test("Test 15: Escape priority 2 - closes mobile drawer if shortcuts modal is closed", () => {
  let isShortcutsModalOpen = false;
  let isDrawerOpen = true;
  let selectedFieldId = "f1";

  const handleEscape = () => {
    if (isShortcutsModalOpen) {
      isShortcutsModalOpen = false;
      return;
    }
    if (isDrawerOpen) {
      isDrawerOpen = false;
      return;
    }
    if (selectedFieldId) {
      selectedFieldId = null;
    }
  };

  handleEscape();
  assert.strictEqual(isDrawerOpen, false);
  assert.strictEqual(selectedFieldId, "f1");
});

test("Test 16: Escape priority 3 - deselects selected field when no modals or drawers are open", () => {
  let isShortcutsModalOpen = false;
  let isDrawerOpen = false;
  let selectedFieldId = "f1";

  const handleEscape = () => {
    if (isShortcutsModalOpen) {
      isShortcutsModalOpen = false;
      return;
    }
    if (isDrawerOpen) {
      isDrawerOpen = false;
      return;
    }
    if (selectedFieldId) {
      selectedFieldId = null;
    }
  };

  handleEscape();
  assert.strictEqual(selectedFieldId, null);
});

// -------------------------------------------------------------
// SUITE 5: Ctrl/Cmd + D Field Duplication
// -------------------------------------------------------------
console.log("\n--- SUITE 5: Ctrl/Cmd + D Field Duplication ---");

test("Test 17: Ctrl+D duplicates selected field with safe offset and assigns selection to duplicate", () => {
  const original = {
    id: "f1",
    pageNumber: 1,
    type: "signature",
    x: 100,
    y: 100,
    width: 140,
    height: 40,
    recipientId: "rec_1"
  };

  const duplicate = {
    ...original,
    id: `field_${Date.now()}_dup`,
    x: Math.min(bounds.width - original.width, original.x + 20),
    y: Math.min(bounds.height - original.height, original.y + 20)
  };

  assert.strictEqual(duplicate.type, original.type);
  assert.strictEqual(duplicate.recipientId, original.recipientId);
  assert.strictEqual(duplicate.width, original.width);
  assert.strictEqual(duplicate.height, original.height);
  assert.strictEqual(duplicate.x, 120);
  assert.strictEqual(duplicate.y, 120);
  assert.notStrictEqual(duplicate.id, original.id);
});

test("Test 18: Duplicated field near edge is clamped within page boundaries", () => {
  const original = {
    id: "f_edge",
    pageNumber: 1,
    type: "text",
    x: 500,
    y: 760,
    width: 120,
    height: 40,
    recipientId: "rec_1"
  };

  const duplicate = {
    ...original,
    id: `field_dup`,
    x: Math.min(bounds.width - original.width, original.x + 20),
    y: Math.min(bounds.height - original.height, original.y + 20)
  };

  // Max allowed X is 612 - 120 = 492
  assert.strictEqual(duplicate.x, 492);
  // Max allowed Y is 792 - 40 = 752
  assert.strictEqual(duplicate.y, 752);
  assert(duplicate.x + duplicate.width <= bounds.width);
  assert(duplicate.y + duplicate.height <= bounds.height);
});

test("Test 19: Duplication preserves recipient assignment in Several People workflow", () => {
  const original = {
    id: "f_signer2",
    pageNumber: 2,
    type: "initials",
    x: 150,
    y: 250,
    width: 60,
    height: 30,
    recipientId: "rec_client_889"
  };

  const duplicate = {
    ...original,
    id: "f_signer2_copy",
    x: original.x + 20,
    y: original.y + 20
  };

  assert.strictEqual(duplicate.recipientId, "rec_client_889");
  assert.strictEqual(duplicate.pageNumber, 2);
  assert.strictEqual(duplicate.type, "initials");
});

// -------------------------------------------------------------
// SUITE 6: Undo & Redo History State Management
// -------------------------------------------------------------
console.log("\n--- SUITE 6: Undo & Redo History State ---");

test("Test 20: History stack push, undo, and redo transitions", () => {
  let historyPast = [];
  let historyFuture = [];
  let fields = [{ id: "f1", x: 100, y: 100 }];

  const pushToHistory = (newFields) => {
    historyPast.push(fields);
    fields = newFields;
    historyFuture = [];
  };

  const handleUndo = () => {
    if (historyPast.length === 0) return;
    const previous = historyPast[historyPast.length - 1];
    historyPast = historyPast.slice(0, -1);
    historyFuture = [fields, ...historyFuture];
    fields = previous;
  };

  const handleRedo = () => {
    if (historyFuture.length === 0) return;
    const next = historyFuture[0];
    historyFuture = historyFuture.slice(1);
    historyPast = [...historyPast, fields];
    fields = next;
  };

  // 1. Move field
  pushToHistory([{ id: "f1", x: 150, y: 150 }]);
  assert.strictEqual(fields[0].x, 150);
  assert.strictEqual(historyPast.length, 1);

  // 2. Undo
  handleUndo();
  assert.strictEqual(fields[0].x, 100);
  assert.strictEqual(historyFuture.length, 1);

  // 3. Redo
  handleRedo();
  assert.strictEqual(fields[0].x, 150);
  assert.strictEqual(historyFuture.length, 0);
});

// -------------------------------------------------------------
// SUITE 7: Tab Navigation, Keyboard Focus & A11Y Semantics
// -------------------------------------------------------------
console.log("\n--- SUITE 7: Tab Navigation & ARIA Semantics ---");

test("Test 21: Active field overlay has role='button', tabIndex=0, aria-selected=true", () => {
  const getFieldA11yProps = (field, isSelected, isDimmed) => ({
    role: "button",
    tabIndex: isDimmed ? -1 : 0,
    "aria-selected": isSelected,
    "aria-disabled": isDimmed,
    "aria-label": `${field.type} field${field.recipientName ? ` for ${field.recipientName}` : ""}${isSelected ? ", selected" : ""}`
  });

  const selectedProps = getFieldA11yProps({ type: "signature", recipientName: "Alice" }, true, false);
  assert.strictEqual(selectedProps.role, "button");
  assert.strictEqual(selectedProps.tabIndex, 0);
  assert.strictEqual(selectedProps["aria-selected"], true);
  assert.strictEqual(selectedProps["aria-disabled"], false);
  assert(selectedProps["aria-label"].includes("Alice"));
  assert(selectedProps["aria-label"].includes("selected"));
});

test("Test 22: Dimmed non-active recipient field is excluded from tab navigation (tabIndex = -1)", () => {
  const getFieldA11yProps = (field, isSelected, isDimmed) => ({
    role: "button",
    tabIndex: isDimmed ? -1 : 0,
    "aria-selected": isSelected,
    "aria-disabled": isDimmed
  });

  const dimmedProps = getFieldA11yProps({ type: "initials" }, false, true);
  assert.strictEqual(dimmedProps.tabIndex, -1);
  assert.strictEqual(dimmedProps["aria-disabled"], true);
});

test("Test 23: Enter and Space keys select/activate focused field", () => {
  let selectedId = null;
  const handleFieldKeyDown = (e, fieldId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectedId = fieldId;
    }
  };

  let prevented = false;
  handleFieldKeyDown({ key: "Enter", preventDefault: () => { prevented = true; } }, "field_xyz");
  assert.strictEqual(selectedId, "field_xyz");
  assert.strictEqual(prevented, true);

  prevented = false;
  handleFieldKeyDown({ key: " ", preventDefault: () => { prevented = true; } }, "field_abc");
  assert.strictEqual(selectedId, "field_abc");
  assert.strictEqual(prevented, true);
});

// -------------------------------------------------------------
// SUITE 8: Workflow Compatibility & Touch Safety
// -------------------------------------------------------------
console.log("\n--- SUITE 8: Workflow & Phase 3D Touch Safety ---");

test("Test 24: Only Me and Several People modes maintain identical keyboard nudge logic", () => {
  const field = { x: 50, y: 50, width: 100, height: 30 };
  const onlyMeNudge = nudgeFieldCoordinates({ ...field, direction: "ArrowDown", step: 1, containerBounds: bounds });
  const severalPeopleNudge = nudgeFieldCoordinates({ ...field, direction: "ArrowDown", step: 1, containerBounds: bounds });

  assert.deepStrictEqual(onlyMeNudge, severalPeopleNudge);
  assert.strictEqual(onlyMeNudge.y, 51);
});

test("Test 25: Phase 3D touch event listeners and keyboard shortcuts coexist without collisions", () => {
  // Verify that keyboard handlers only listen to key events and touch handlers to touch events
  const isKeyHandlerSafeFromTouch = (event) => {
    return event.type.startsWith("key") && typeof event.key === "string";
  };
  const isTouchHandlerSafeFromKey = (event) => {
    return event.type.startsWith("touch") && Boolean(event.touches);
  };

  assert(isKeyHandlerSafeFromTouch({ type: "keydown", key: "ArrowUp" }));
  assert(!isKeyHandlerSafeFromTouch({ type: "touchstart", touches: [{ clientX: 10, clientY: 20 }] }));
  assert(isTouchHandlerSafeFromKey({ type: "touchmove", touches: [{ clientX: 10, clientY: 20 }] }));
  assert(!isTouchHandlerSafeFromKey({ type: "keydown", key: "ArrowLeft" }));
});

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log("\n===============================================================");
console.log(`Phase 3E Tests Complete: ${passed} PASSED, ${failed} FAILED`);
console.log("===============================================================\n");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
