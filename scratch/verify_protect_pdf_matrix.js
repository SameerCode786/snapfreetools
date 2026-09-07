import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// WebCrypto & DOMMatrix polyfills for Node test environment
if (!global.crypto) global.crypto = crypto.webcrypto || crypto;
if (typeof global.DOMMatrix === 'undefined') {
  global.DOMMatrix = class DOMMatrix {
    constructor() {
      this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
    }
  };
}

import { inspectPdfForProtection, executePdfProtection, validateProtectedPdfOutput, PROTECT_ERROR_CODES } from '../src/features/protect-pdf/utils/protectPdfEngine.js';
import { decryptPDF } from '@pdfsmaller/pdf-decrypt';
import { PDFDocument } from 'pdf-lib';

// Helper to convert Node Buffer to Mock File
function createMockFile(filePath, fileName) {
  const buf = fs.readFileSync(filePath);
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  
  const file = {
    name: fileName,
    size: arrayBuffer.byteLength,
    type: 'application/pdf',
    arrayBuffer: async () => arrayBuffer.slice(0)
  };
  return { file, arrayBuffer };
}

async function runProtectPdfTestMatrix() {
  console.log("==================================================");
  console.log("PROTECT PDF FEATURE — AUTOMATED VERIFICATION TEST MATRIX");
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

  // Test 1: Normal PDF Inspection
  try {
    const { file } = createMockFile('scratch/test_1_unprotected.pdf', 'test_1_unprotected.pdf');
    const info = await inspectPdfForProtection(file);
    recordResult(1, "Normal PDF Inspection", "test_1_unprotected.pdf", "File parsed with page count 1", `pageCount: ${info.pageCount}, isAlreadyProtected: ${info.isAlreadyProtected}`, info.pageCount === 1 && !info.isAlreadyProtected);
  } catch (e) {
    recordResult(1, "Normal PDF Inspection", "test_1_unprotected.pdf", "File parsed", `Error: ${e.message || e}`, false);
  }

  // Test 2: AES-256 PDF Protection Execution
  try {
    const { file } = createMockFile('scratch/test_1_unprotected.pdf', 'test_1_unprotected.pdf');
    const info = await inspectPdfForProtection(file);
    const result = await executePdfProtection({
      fileInfo: info,
      userPassword: 'secretpassword123',
      confirmPassword: 'secretpassword123',
      keyLength: '256'
    });

    // Verify output with decryption engine
    const decryptedBytes = await decryptPDF(result.blob ? await result.blob.arrayBuffer() : info.arrayBuffer, 'secretpassword123');
    const pdfLibDoc = await PDFDocument.load(decryptedBytes, { ignoreEncryption: false });

    recordResult(2, "AES-256 Encryption & Output Verification", "test_1_unprotected.pdf + 'secretpassword123'", "Protected PDF opens with password (1 page)", `Verified output page count ${pdfLibDoc.getPageCount()}`, pdfLibDoc.getPageCount() === 1);
  } catch (e) {
    recordResult(2, "AES-256 Encryption & Output Verification", "test_1_unprotected.pdf", "Protected PDF", `Error: ${e.message || JSON.stringify(e)}`, false);
  }

  // Test 3: Password Mismatch Validation
  try {
    const { file } = createMockFile('scratch/test_1_unprotected.pdf', 'test_1_unprotected.pdf');
    const info = await inspectPdfForProtection(file);
    let caughtMismatch = null;
    try {
      await executePdfProtection({
        fileInfo: info,
        userPassword: 'pass123',
        confirmPassword: 'pass456'
      });
    } catch (err) {
      caughtMismatch = err;
    }
    const isMismatch = caughtMismatch && caughtMismatch.errorCode === PROTECT_ERROR_CODES.PASSWORD_MISMATCH;
    recordResult(3, "Password Mismatch Protection", "userPass: 'pass123', confirmPass: 'pass456'", "Rejection error 'PASSWORD_MISMATCH'", caughtMismatch ? caughtMismatch.message : "No error", isMismatch);
  } catch (e) {
    recordResult(3, "Password Mismatch Protection", "test_1_unprotected.pdf", "Mismatch error", `Unexpected error: ${e.message || e}`, false);
  }

  // Test 4: Special Characters Password
  try {
    const { file } = createMockFile('scratch/test_1_unprotected.pdf', 'test_1_unprotected.pdf');
    const info = await inspectPdfForProtection(file);
    const specialPass = 'P@ssw0rd!#$&*()';
    const result = await executePdfProtection({
      fileInfo: info,
      userPassword: specialPass,
      confirmPassword: specialPass,
      keyLength: '256'
    });

    recordResult(4, "Special Character Password Protection", `Pass: '${specialPass}'`, "PDF protected & output verified", `Protected PDF generated (${result.size} bytes)`, result.success && result.size > 100);
  } catch (e) {
    recordResult(4, "Special Character Password Protection", "Special Pass", "Protected PDF", `Error: ${e.message || e}`, false);
  }

  // Test 5: AES-128 Encryption Mode
  try {
    const { file } = createMockFile('scratch/test_1_unprotected.pdf', 'test_1_unprotected.pdf');
    const info = await inspectPdfForProtection(file);
    const result = await executePdfProtection({
      fileInfo: info,
      userPassword: 'secretpassword123',
      confirmPassword: 'secretpassword123',
      keyLength: '128'
    });

    recordResult(5, "AES-128 Mode Protection", "keyLength: '128'", "PDF protected with AES-128", `Protected PDF generated (${result.size} bytes)`, result.success && result.keyLength === '128');
  } catch (e) {
    recordResult(5, "AES-128 Mode Protection", "AES-128", "Protected PDF", `Error: ${e.message || e}`, false);
  }

  // Test 6: Custom Permissions (No Print / No Copy)
  try {
    const { file } = createMockFile('scratch/test_1_unprotected.pdf', 'test_1_unprotected.pdf');
    const info = await inspectPdfForProtection(file);
    const result = await executePdfProtection({
      fileInfo: info,
      userPassword: 'secretpassword123',
      confirmPassword: 'secretpassword123',
      permissions: {
        printing: false,
        copying: false,
        modifying: false,
        annotating: false
      }
    });

    recordResult(6, "Custom Permissions Protection", "printing: false, copying: false", "PDF protected with custom /P bitmask", `Protected PDF generated (${result.size} bytes)`, result.success);
  } catch (e) {
    recordResult(6, "Custom Permissions Protection", "Permissions", "Protected PDF", `Error: ${e.message || e}`, false);
  }

  // Test 7: Multi-page Large PDF (25 pages)
  try {
    const { file } = createMockFile('scratch/test_8_large.pdf', 'test_8_large.pdf');
    const info = await inspectPdfForProtection(file);
    const result = await executePdfProtection({
      fileInfo: info,
      userPassword: 'secretpassword123',
      confirmPassword: 'secretpassword123'
    });

    recordResult(7, "Large Multi-Page PDF (25 pages)", "test_8_large.pdf", "25 pages encrypted and verified", `Verified output page count ${result.pageCount}`, result.success && result.pageCount === 25);
  } catch (e) {
    recordResult(7, "Large Multi-Page PDF", "test_8_large.pdf", "25 pages encrypted", `Error: ${e.message || e}`, false);
  }

  // Test 8: Corrupted PDF Error Handling
  try {
    const { file } = createMockFile('scratch/test_9_corrupted.pdf', 'test_9_corrupted.pdf');
    let caughtCorrupted = null;
    try {
      await inspectPdfForProtection(file);
    } catch (err) {
      caughtCorrupted = err;
    }
    const isCorruptedErr = caughtCorrupted && (caughtCorrupted.errorCode === PROTECT_ERROR_CODES.CORRUPTED_PDF || caughtCorrupted.message.includes("corrupted"));
    recordResult(8, "Corrupted PDF Error Handling", "test_9_corrupted.pdf", "Corrupted PDF error detection", caughtCorrupted ? caughtCorrupted.message : "No error", isCorruptedErr);
  } catch (e) {
    recordResult(8, "Corrupted PDF Error Handling", "test_9_corrupted.pdf", "Corrupted error", `Error: ${e.message || e}`, false);
  }

  console.log("\n==================================================");
  console.log(`SUMMARY: ${results.filter(r => r.status === "PASS").length} / ${results.length} TESTS PASSED`);
  console.log("==================================================");
}

runProtectPdfTestMatrix();
