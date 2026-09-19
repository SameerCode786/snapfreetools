import assert from "assert";
import {
  createInitialRecipient,
  createNextRecipient,
  removeRecipientAndNormalize,
  getRecipientById,
  isValidEmail,
  validatePreparation,
  RECIPIENT_ROLES,
  RECIPIENT_COLORS
} from "../src/features/sign-pdf/utils/recipientUtils.js";
import {
  screenToPdfCoords,
  formatDateValue
} from "../src/features/sign-pdf/utils/fieldCoordinateMath.js";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { executePdfSigning } from "../src/features/sign-pdf/utils/signPdfEngine.js";

async function runPhase2Tests() {
  console.log("===============================================================");
  console.log("       PHASE 2 AUTOMATED TEST & REGRESSION SUITE              ");
  console.log("===============================================================\n");

  let passed = 0;
  let total = 0;

  function runTest(name, fn) {
    total++;
    try {
      fn();
      console.log(`[PASS] Test ${total}: ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] Test ${total}: ${name}`, err);
      throw err;
    }
  }

  async function runAsyncTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`[PASS] Test ${total}: ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] Test ${total}: ${name}`, err);
      throw err;
    }
  }

  // --- SUITE 1: RECIPIENT DATA MODEL & COLOR PALETTE ---
  console.log("--- SUITE 1: Recipient Management & Data Contract ---");

  runTest("Initial Recipient Creation (Order 1, Distinct Color)", () => {
    const r1 = createInitialRecipient(1);
    assert(r1.id.startsWith("rec-"));
    assert.strictEqual(r1.order, 1);
    assert.strictEqual(r1.role, "signer");
    assert.strictEqual(r1.color.id, "blue");
  });

  runTest("Sequential Recipient Creation (Distinct Color & Incrementing Order)", () => {
    const r1 = createInitialRecipient(1);
    const r2 = createNextRecipient([r1]);
    const r3 = createNextRecipient([r1, r2]);

    assert.strictEqual(r2.order, 2);
    assert.strictEqual(r3.order, 3);
    assert.notStrictEqual(r1.id, r2.id);
    assert.notStrictEqual(r2.id, r3.id);
    assert.strictEqual(r2.color.id, "emerald");
    assert.strictEqual(r3.color.id, "purple");
  });

  runTest("Recipient Removal & Order Normalization", () => {
    const r1 = createInitialRecipient(1);
    const r2 = createNextRecipient([r1]);
    const r3 = createNextRecipient([r1, r2]);
    const r4 = createNextRecipient([r1, r2, r3]);

    // Remove r2 (Order 2)
    const normalized = removeRecipientAndNormalize([r1, r2, r3, r4], r2.id);
    assert.strictEqual(normalized.length, 3);
    assert.strictEqual(normalized[0].id, r1.id);
    assert.strictEqual(normalized[0].order, 1);
    assert.strictEqual(normalized[1].id, r3.id);
    assert.strictEqual(normalized[1].order, 2); // r3 is now order 2
    assert.strictEqual(normalized[2].id, r4.id);
    assert.strictEqual(normalized[2].order, 3); // r4 is now order 3
  });

  runTest("Email Validation RFC Regex", () => {
    assert.strictEqual(isValidEmail("alice@example.com"), true);
    assert.strictEqual(isValidEmail("bob.smith+work@company.co.uk"), true);
    assert.strictEqual(isValidEmail("not-an-email"), false);
    assert.strictEqual(isValidEmail("user@.com"), false);
    assert.strictEqual(isValidEmail(""), false);
  });

  // --- SUITE 2: PREPARATION VALIDATION RULES ---
  console.log("\n--- SUITE 2: Multi-Recipient Preparation Validation ---");

  runTest("Reject Empty Recipient List", () => {
    const res = validatePreparation({ recipients: [], fieldsByPage: {} });
    assert.strictEqual(res.isValid, false);
    assert(res.errors.some((e) => e.includes("at least one recipient")));
  });

  runTest("Reject Invalid and Missing Recipient Fields", () => {
    const invalidRec = {
      id: "rec-1",
      name: "",
      email: "invalid-email",
      role: "signer",
      order: 1
    };
    const res = validatePreparation({ recipients: [invalidRec], fieldsByPage: {} });
    assert.strictEqual(res.isValid, false);
    assert(res.recipientErrors["rec-1"].some((e) => e.includes("requires a name")));
    assert(res.recipientErrors["rec-1"].some((e) => e.includes("invalid email format")));
  });

  runTest("Detect and Reject Duplicate Recipient Emails", () => {
    const rec1 = { id: "rec-1", name: "Alice", email: "alice@example.com", role: "signer", order: 1 };
    const rec2 = { id: "rec-2", name: "Alice Clone", email: "alice@example.com", role: "validator", order: 2 };

    const res = validatePreparation({ recipients: [rec1, rec2], fieldsByPage: {} });
    assert.strictEqual(res.isValid, false);
    assert(res.errors.some((e) => e.includes("Duplicate email")));
  });

  runTest("Detect and Reject Orphaned Field Recipient IDs", () => {
    const rec1 = { id: "rec-1", name: "Alice", email: "alice@example.com", role: "signer", order: 1 };
    const fieldsByPage = {
      1: [
        { id: "fld-1", type: "signature", recipientId: "rec-nonexistent", pageNumber: 1 }
      ]
    };

    const res = validatePreparation({ recipients: [rec1], fieldsByPage });
    assert.strictEqual(res.isValid, false);
    assert(res.errors.some((e) => e.includes("not assigned to a valid recipient")));
  });

  runTest("Accept Fully Valid Preparation State", () => {
    const rec1 = { id: "rec-1", name: "Ahmed", email: "ahmed@example.com", role: "signer", order: 1 };
    const rec2 = { id: "rec-2", name: "Sara", email: "sara@company.com", role: "validator", order: 2 };
    const fieldsByPage = {
      1: [
        { id: "fld-1", type: "signature", recipientId: "rec-1", pageNumber: 1, required: true },
        { id: "fld-2", type: "date", recipientId: "rec-1", pageNumber: 1, required: true }
      ],
      2: [
        { id: "fld-3", type: "text", recipientId: "rec-2", pageNumber: 2, required: false }
      ]
    };

    const res = validatePreparation({ recipients: [rec1, rec2], fieldsByPage, signingOrderMode: "sequential" });
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.errors.length, 0);
  });

  // --- SUITE 3: PHASE 1 REGRESSION VALIDATION ---
  console.log("\n--- SUITE 3: Phase 1 Regression Checks ---");

  await runAsyncTest("Phase 1 Only Me Client-Side PDF Generation Unaffected", async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([612, 792]);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    page.drawText("Clause 1: Confidential agreement.", { x: 50, y: 700, size: 12, font, color: rgb(0,0,0) });
    const bytes = await doc.save();

    const result = await executePdfSigning({
      file: {
        name: "test.pdf",
        size: bytes.byteLength,
        arrayBuffer: async () => bytes.buffer
      },
      fieldsByPage: {
        1: [
          {
            id: "fld-1",
            type: "name",
            value: "Only Me User",
            x: 50,
            y: 500,
            width: 150,
            height: 30,
            previewWidth: 600,
            previewHeight: 800,
            style: { fontFamily: "Helvetica", fontSize: 12, color: "#0f172a" }
          }
        ]
      }
    });

    assert(result.blob);
    assert.strictEqual(result.totalPages, 1);
    assert.strictEqual(result.totalFieldsPlaced, 1);
  });

  console.log("\n===============================================================");
  console.log(`  PHASE 2 VERIFICATION COMPLETE: ${passed}/${total} TESTS PASSED (100%)  `);
  console.log("===============================================================\n");
}

runPhase2Tests().catch((err) => {
  console.error("FATAL ERROR IN PHASE 2 TEST SUITE:", err);
  process.exit(1);
});
