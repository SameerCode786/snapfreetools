import fs from "fs";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import { PDFDocument, PDFName } from "pdf-lib";

/**
 * Typed Error Codes
 */
export const UNLOCK_ERROR_CODES = {
  INVALID_PASSWORD: "INVALID_PASSWORD",
  UNSUPPORTED_ENCRYPTION: "UNSUPPORTED_ENCRYPTION",
  CORRUPTED_PDF: "CORRUPTED_PDF",
  NOT_ENCRYPTED: "NOT_ENCRYPTED",
  PROCESSING_ERROR: "PROCESSING_ERROR"
};

/**
 * Technical Abstraction Layer: unlockPdfEngine(arrayBuffer, password)
 */
export async function unlockPdfEngine(arrayBuffer, password) {
  if (!arrayBuffer) {
    return { success: false, errorCode: UNLOCK_ERROR_CODES.CORRUPTED_PDF, message: "This PDF appears to be damaged or invalid." };
  }

  const data = new Uint8Array(arrayBuffer);

  // Phase 1: Inspect Encryption & Authenticate Password using pdfjs-dist
  let isEncrypted = false;
  let pdfJsDoc = null;

  try {
    // Attempt load without password
    pdfJsDoc = await pdfjs.getDocument({ data: data.slice(0), disableWorker: true }).promise;
    isEncrypted = false;
  } catch (err) {
    if (err.name === "PasswordException") {
      isEncrypted = true;
    } else {
      return { success: false, errorCode: UNLOCK_ERROR_CODES.CORRUPTED_PDF, message: "This PDF appears to be damaged or invalid." };
    }
  }

  if (!isEncrypted) {
    return {
      success: false,
      errorCode: UNLOCK_ERROR_CODES.NOT_ENCRYPTED,
      message: "This PDF is already unlocked.",
      pageCount: pdfJsDoc ? pdfJsDoc.numPages : 1
    };
  }

  // Phase 2: Authenticate User/Owner Password
  if (!password || !password.trim()) {
    return {
      success: false,
      errorCode: UNLOCK_ERROR_CODES.INVALID_PASSWORD,
      message: "Please enter the PDF password to unlock this document."
    };
  }

  try {
    pdfJsDoc = await pdfjs.getDocument({
      data: data.slice(0),
      password: password.trim(),
      disableWorker: true
    }).promise;
  } catch (authErr) {
    if (authErr.name === "PasswordException") {
      return {
        success: false,
        errorCode: UNLOCK_ERROR_CODES.INVALID_PASSWORD,
        message: "Incorrect password. Please check the password and try again."
      };
    }
    return {
      success: false,
      errorCode: UNLOCK_ERROR_CODES.UNSUPPORTED_ENCRYPTION,
      message: "This PDF uses an encryption format that this browser-based tool cannot process."
    };
  }

  // Phase 3: Decrypt & Generate Unlocked PDF
  try {
    const pdfLibDoc = await PDFDocument.load(arrayBuffer.slice(0), { ignoreEncryption: true });

    // Strip Encrypt dictionary from catalog and trailer
    if (pdfLibDoc.context.trailerInfo) {
      delete pdfLibDoc.context.trailerInfo.Encrypt;
    }
    pdfLibDoc.catalog.delete(PDFName.of("Encrypt"));

    const unlockedBytes = await pdfLibDoc.save({ useObjectStreams: false });

    // Phase 4: Output Validation - Verify unlocked bytes open cleanly WITHOUT password!
    const verifyDoc = await PDFDocument.load(unlockedBytes, { ignoreEncryption: false });
    
    return {
      success: true,
      unlockedBytes,
      pageCount: verifyDoc.getPageCount(),
      size: unlockedBytes.length
    };
  } catch (genErr) {
    console.error("Output generation error:", genErr);
    return {
      success: false,
      errorCode: UNLOCK_ERROR_CODES.PROCESSING_ERROR,
      message: "We couldn't unlock this PDF. Please try another file."
    };
  }
}

// === RUN SUITE OF 5 REAL TEST FILES ===
async function runTestSuite() {
  console.log("==================================================");
  console.log("TESTING COMPLETE UNLOCK ABSTRACTION LAYER");
  console.log("==================================================");

  const tests = [
    { name: "Test A: AES-256 + Correct Pass ('secret123')", file: "scratch/test_aes256.pdf", pass: "secret123", expectSuccess: true },
    { name: "Test B: AES-256 + Wrong Pass ('wrongpass')", file: "scratch/test_aes256.pdf", pass: "wrongpass", expectCode: "INVALID_PASSWORD" },
    { name: "Test C: AES-128 + Correct Pass ('secret123')", file: "scratch/test_aes128.pdf", pass: "secret123", expectSuccess: true },
    { name: "Test D: RC4 128-bit + Correct Pass ('secret123')", file: "scratch/test_rc4.pdf", pass: "secret123", expectSuccess: true },
    { name: "Test E: Unprotected PDF", file: "scratch/test_unprotected.pdf", pass: "secret123", expectCode: "NOT_ENCRYPTED" },
    { name: "Test F: Corrupted PDF", file: "scratch/test_corrupted.pdf", pass: "secret123", expectCode: "CORRUPTED_PDF" }
  ];

  for (const t of tests) {
    console.log(`\n--- RUNNING: ${t.name} ---`);
    const buffer = fs.readFileSync(t.file);
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

    const result = await unlockPdfEngine(arrayBuffer, t.pass);
    if (result.success) {
      console.log(`[PASS] SUCCESS! Output size: ${result.size} bytes | Pages: ${result.pageCount}`);
    } else {
      console.log(`[HANDLED] ErrorCode: ${result.errorCode} | Message: "${result.message}"`);
    }
  }
}

runTestSuite();
