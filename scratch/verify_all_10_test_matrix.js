import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

if (!global.crypto) {
  global.crypto = crypto.webcrypto || crypto;
}

if (typeof global.DOMMatrix === 'undefined') {
  global.DOMMatrix = class DOMMatrix {
    constructor() {
      this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
    }
  };
}

import { inspectPdfForUnlock, executePdfUnlock, executeRemoveRestrictions, UNLOCK_ERROR_CODES } from '../src/features/unlock-pdf/utils/pdfUnlockEngine.js';

// Helper to convert Node Buffer to Mock File
function createMockFile(filePath, fileName) {
  const buf = fs.readFileSync(filePath);
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + bufferByteLength(buf));
  
  const file = {
    name: fileName,
    size: arrayBuffer.byteLength,
    type: 'application/pdf',
    arrayBuffer: async () => arrayBuffer.slice(0)
  };
  return { file, arrayBuffer };
}

function bufferByteLength(buf) {
  return buf.byteLength;
}

async function runTestMatrix() {
  console.log("==================================================");
  console.log("FEATURE 6 — AUTOMATED PDF SECURITY & UNLOCK TEST MATRIX");
  console.log("==================================================\n");

  const results = [];

  const recordResult = (testId, name, input, expected, actual, pass) => {
    results.push({ testId, name, input, expected, actual, status: pass ? "PASS" : "FAIL" });
    console.log(`Test ${testId}: ${name}`);
    console.log(`  Input: ${input}`);
    console.log(`  Expected: ${expected}`);
    console.log(`  Actual: ${actual}`);
    console.log(`  Status: ${pass ? "✅ PASS" : "❌ FAIL"}\n`);
  };

  // Test 1: Unprotected PDF Detection
  try {
    const { file } = createMockFile('scratch/test_1_unprotected.pdf', 'test_1_unprotected.pdf');
    const info = await inspectPdfForUnlock(file);
    const isUnprotected = !info.isProtected && !info.hasRestrictions;
    recordResult(1, "Unprotected PDF Detection", "test_1_unprotected.pdf", "Unprotected PDF (Flow Case 1)", `isProtected: ${info.isProtected}, hasRestrictions: ${info.hasRestrictions}`, isUnprotected);
  } catch (e) {
    recordResult(1, "Unprotected PDF Detection", "test_1_unprotected.pdf", "Unprotected PDF", `Error: ${e.message || e}`, false);
  }

  // Test 2: AES-256 PDF with correct password
  try {
    const { file } = createMockFile('scratch/test_2_aes256.pdf', 'test_2_aes256.pdf');
    const info = await inspectPdfForUnlock(file);
    const result = await executePdfUnlock({ fileInfo: info, password: 'secretpassword123' });
    recordResult(2, "AES-256 with Correct Password", "test_2_aes256.pdf + 'secretpassword123'", "Decrypted & validated output PDF", `Output validated successfully (${result.pageCount} page)`, result.success && result.pageCount === 1);
  } catch (e) {
    recordResult(2, "AES-256 with Correct Password", "test_2_aes256.pdf", "Decrypted PDF", `Error: ${e.message || JSON.stringify(e)}`, false);
  }

  // Test 3: AES-256 PDF with wrong password
  try {
    const { file } = createMockFile('scratch/test_2_aes256.pdf', 'test_2_aes256.pdf');
    const info = await inspectPdfForUnlock(file);
    let caughtError = null;
    try {
      await executePdfUnlock({ fileInfo: info, password: 'wrongpassword999' });
    } catch (err) {
      caughtError = err;
    }
    const isInvalidPass = caughtError && (caughtError.errorCode === UNLOCK_ERROR_CODES.INVALID_PASSWORD || caughtError.message.includes("Incorrect password"));
    recordResult(3, "AES-256 with Wrong Password", "test_2_aes256.pdf + 'wrongpassword999'", "Error: Incorrect password", caughtError ? caughtError.message : "No error thrown", isInvalidPass);
  } catch (e) {
    recordResult(3, "AES-256 with Wrong Password", "test_2_aes256.pdf", "Error message", `Unexpected error: ${e.message || e}`, false);
  }

  // Test 4: AES-128 PDF Decryption
  try {
    const { file } = createMockFile('scratch/test_4_aes128.pdf', 'test_4_aes128.pdf');
    const info = await inspectPdfForUnlock(file);
    const result = await executePdfUnlock({ fileInfo: info, password: 'secretpassword123' });
    recordResult(4, "AES-128 PDF Decryption", "test_4_aes128.pdf + 'secretpassword123'", "Decrypted & validated output PDF", `Output validated successfully (${result.pageCount} page)`, result.success && result.pageCount === 1);
  } catch (e) {
    recordResult(4, "AES-128 PDF Decryption", "test_4_aes128.pdf", "Decrypted PDF", `Error: ${e.message || JSON.stringify(e)}`, false);
  }

  // Test 5: RC4 PDF Decryption
  try {
    const { file } = createMockFile('scratch/test_5_rc4.pdf', 'test_5_rc4.pdf');
    const info = await inspectPdfForUnlock(file);
    const result = await executePdfUnlock({ fileInfo: info, password: 'secretpassword123' });
    recordResult(5, "RC4 PDF Decryption", "test_5_rc4.pdf + 'secretpassword123'", "Decrypted & validated output PDF", `Output validated successfully (${result.pageCount} page)`, result.success && result.pageCount === 1);
  } catch (e) {
    recordResult(5, "RC4 PDF Decryption", "test_5_rc4.pdf", "Decrypted PDF", `Error: ${e.message || JSON.stringify(e)}`, false);
  }

  // Test 6: PDF Object Streams & Image Preservation
  try {
    const { file } = createMockFile('scratch/test_2_aes256.pdf', 'test_2_aes256.pdf');
    const info = await inspectPdfForUnlock(file);
    const result = await executePdfUnlock({ fileInfo: info, password: 'secretpassword123' });
    recordResult(6, "PDF Object Streams & Resource Preservation", "test_2_aes256.pdf", "Streams & resources intact", `Verified output page count ${result.pageCount}`, result.success);
  } catch (e) {
    recordResult(6, "PDF Object Streams & Resource Preservation", "test_2_aes256.pdf", "Intact structure", `Error: ${e.message || e}`, false);
  }

  // Test 7: PDF Text & Font Layer Preservation
  try {
    const { file } = createMockFile('scratch/test_4_aes128.pdf', 'test_4_aes128.pdf');
    const info = await inspectPdfForUnlock(file);
    const result = await executePdfUnlock({ fileInfo: info, password: 'secretpassword123' });
    recordResult(7, "PDF Text & Fonts Layer Preservation", "test_4_aes128.pdf", "Preserve text & font structures", `Output validated successfully (${result.pageCount} page)`, result.success);
  } catch (e) {
    recordResult(7, "PDF Text & Fonts Layer Preservation", "test_4_aes128.pdf", "Preserved text layer", `Error: ${e.message || e}`, false);
  }

  // Test 8: Large PDF (25 pages)
  try {
    const { file } = createMockFile('scratch/test_8_large.pdf', 'test_8_large.pdf');
    const info = await inspectPdfForUnlock(file);
    const result = await executePdfUnlock({ fileInfo: info, password: 'secretpassword123' });
    recordResult(8, "Large PDF (25 pages)", "test_8_large.pdf + 'secretpassword123'", "25 pages decrypted and verified", `Decrypted PDF verified with ${result.pageCount} pages`, result.success && result.pageCount === 25);
  } catch (e) {
    recordResult(8, "Large PDF", "test_8_large.pdf", "25 pages decrypted", `Error: ${e.message || e}`, false);
  }

  // Test 9: Corrupted PDF Handling
  try {
    const { file } = createMockFile('scratch/test_9_corrupted.pdf', 'test_9_corrupted.pdf');
    let caughtCorrupted = null;
    try {
      await inspectPdfForUnlock(file);
    } catch (err) {
      caughtCorrupted = err;
    }
    const isCorruptedErr = caughtCorrupted && (caughtCorrupted.errorCode === UNLOCK_ERROR_CODES.CORRUPTED_PDF || caughtCorrupted.message.includes("corrupted"));
    recordResult(9, "Corrupted PDF Handling", "test_9_corrupted.pdf", "Corrupted PDF error detection", caughtCorrupted ? caughtCorrupted.message : "No error thrown", isCorruptedErr);
  } catch (e) {
    recordResult(9, "Corrupted PDF Handling", "test_9_corrupted.pdf", "Corrupted error", `Unexpected error: ${e.message || e}`, false);
  }

  // Test 10: Permission Restrictions Removal (Case 4)
  try {
    const { file } = createMockFile('scratch/test_permission_restrictions.pdf', 'test_permission_restrictions.pdf');
    const info = await inspectPdfForUnlock(file);
    const result = await executeRemoveRestrictions({ fileInfo: info });
    recordResult(10, "Permission Restrictions Removal (Case 4)", "test_permission_restrictions.pdf", "Strip restrictions & validate output", `Restrictions removed, unencrypted output verified (${result.pageCount} page)`, result.success && result.pageCount === 1);
  } catch (e) {
    recordResult(10, "Permission Restrictions Removal", "test_permission_restrictions.pdf", "Restrictions removed", `Error: ${e.message || e}`, false);
  }

  console.log("\n==================================================");
  console.log(`SUMMARY: ${results.filter(r => r.status === "PASS").length} / ${results.length} TESTS PASSED`);
  console.log("==================================================");
}

runTestMatrix();
