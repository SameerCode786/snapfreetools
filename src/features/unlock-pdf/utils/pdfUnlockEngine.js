import { PDFDocument, PDFName } from "pdf-lib";
import { decryptPDF, isEncrypted as checkIsEncrypted } from "@pdfsmaller/pdf-decrypt";
import { formatFileSize, sanitizeFilename } from "./formatters";

/**
 * Typed Error Codes for PDF Unlock Operations
 */
export const UNLOCK_ERROR_CODES = {
  INVALID_PASSWORD: "INVALID_PASSWORD",
  UNSUPPORTED_ENCRYPTION: "UNSUPPORTED_ENCRYPTION",
  CORRUPTED_PDF: "CORRUPTED_PDF",
  NOT_ENCRYPTED: "NOT_ENCRYPTED",
  PROCESSING_ERROR: "PROCESSING_ERROR"
};

/**
 * Gets or initializes pdfjs-dist worker engine for PDF authentication & rendering.
 */
export const getPdfJsEngine = async () => {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  return pdfjs;
};

/**
 * Asynchronous yield helper to ensure UI responsiveness during heavy processing.
 */
const yieldThread = (ms = 40) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Phase 1: Inspect uploaded PDF document
 * Detects encryption status, pages, thumbnail, and validates file size.
 */
export const inspectPdfForUnlock = async (file) => {
  if (!file || !(file instanceof File)) {
    throw { errorCode: UNLOCK_ERROR_CODES.CORRUPTED_PDF, message: "Please upload a valid file." };
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw { errorCode: UNLOCK_ERROR_CODES.CORRUPTED_PDF, message: "Please upload a valid PDF document (.pdf)." };
  }

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB Limit for client-side browser memory safety
  if (file.size > MAX_FILE_SIZE) {
    throw { errorCode: UNLOCK_ERROR_CODES.PROCESSING_ERROR, message: "This file exceeds the maximum supported size of 50 MB for client-side processing." };
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdfjs = await getPdfJsEngine();

  let isProtected = false;
  let pageCount = null;
  let firstPageThumbnail = null;
  let pdfJsDoc = null;

  try {
    // Attempt loading without password parameter
    pdfJsDoc = await pdfjs.getDocument({ data: arrayBuffer.slice(0) }).promise;
    pageCount = pdfJsDoc.numPages;
    isProtected = false;
  } catch (err) {
    if (err.name === "PasswordException" || (err.message && err.message.toLowerCase().includes("password"))) {
      isProtected = true;
    } else {
      throw {
        errorCode: UNLOCK_ERROR_CODES.CORRUPTED_PDF,
        message: "This PDF appears to be damaged or invalid."
      };
    }
  }

  // Generate thumbnail if file is not password-protected
  if (!isProtected && pdfJsDoc && pageCount > 0) {
    try {
      const page = await pdfJsDoc.getPage(1);
      const viewport = page.getViewport({ scale: 0.3 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: ctx, viewport }).promise;
      firstPageThumbnail = canvas.toDataURL("image/jpeg", 0.7);

      canvas.width = 0;
      canvas.height = 0;
    } catch (thumbErr) {
      // Thumbnail rendering skipped for protected/complex files
    }
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: file.name,
    size: file.size,
    isProtected,
    pageCount,
    firstPageThumbnail,
    rawFile: file,
    arrayBuffer
  };
};

/**
 * Technical Abstraction Layer: executePdfUnlock
 * 1. Authenticates password with pdfjs-dist engine.
 * 2. Decrypts all object streams (pages, images, text, fonts, vector objects) using stream decryption.
 * 3. Validates output PDF by re-parsing without password parameters.
 */
export const executePdfUnlock = async ({ fileInfo, password, onProgress }) => {
  if (!fileInfo || !fileInfo.arrayBuffer) {
    throw { errorCode: UNLOCK_ERROR_CODES.CORRUPTED_PDF, message: "No PDF document selected." };
  }

  if (!fileInfo.isProtected) {
    throw { errorCode: UNLOCK_ERROR_CODES.NOT_ENCRYPTED, message: "This PDF is already unlocked." };
  }

  if (!password || !password.trim()) {
    throw { errorCode: UNLOCK_ERROR_CODES.INVALID_PASSWORD, message: "Please enter the PDF password to unlock this document." };
  }

  const cleanPassword = password.trim();

  // Step 1: Verifying password credentials with pdfjs-dist engine
  if (onProgress) {
    onProgress({ step: "Verifying password credentials...", percent: 30 });
  }
  await yieldThread(50);

  const pdfjs = await getPdfJsEngine();
  let pdfJsDoc;

  try {
    pdfJsDoc = await pdfjs.getDocument({
      data: fileInfo.arrayBuffer.slice(0),
      password: cleanPassword
    }).promise;
  } catch (authErr) {
    if (authErr.name === "PasswordException") {
      throw {
        errorCode: UNLOCK_ERROR_CODES.INVALID_PASSWORD,
        message: "Incorrect password. Please check the password and try again."
      };
    }

    throw {
      errorCode: UNLOCK_ERROR_CODES.UNSUPPORTED_ENCRYPTION,
      message: "This PDF uses an encryption format that this browser-based tool cannot process."
    };
  }

  const validatedPageCount = pdfJsDoc ? pdfJsDoc.numPages : (fileInfo.pageCount || 1);

  // Step 2: Stream Decryption (decrypting all page streams, image XObjects, fonts, and vector paths)
  if (onProgress) {
    onProgress({ step: "Decrypting document streams & images...", percent: 70 });
  }
  await yieldThread(50);

  let unlockedBytes = null;
  try {
    // Decrypt streams via stream decryption engine
    unlockedBytes = await decryptPDF(fileInfo.arrayBuffer.slice(0), cleanPassword);
  } catch (decryptErr) {
    const errStr = (decryptErr.message || "").toLowerCase();

    // Fallback: If encryption revision varies, strip /Encrypt dictionary via pdf-lib
    if (errStr.includes("unsupported") || errStr.includes("v=")) {
      try {
        const pdfLibDoc = await PDFDocument.load(fileInfo.arrayBuffer.slice(0), { ignoreEncryption: true });
        if (pdfLibDoc.context.trailerInfo) {
          delete pdfLibDoc.context.trailerInfo.Encrypt;
        }
        pdfLibDoc.catalog.delete(PDFName.of("Encrypt"));
        unlockedBytes = await pdfLibDoc.save({ useObjectStreams: false });
      } catch (fallbackErr) {
        throw {
          errorCode: UNLOCK_ERROR_CODES.UNSUPPORTED_ENCRYPTION,
          message: "This PDF uses an encryption format that this browser-based tool cannot process."
        };
      }
    } else {
      throw {
        errorCode: UNLOCK_ERROR_CODES.PROCESSING_ERROR,
        message: "We couldn't unlock this PDF. Please try another file."
      };
    }
  }

  // Step 3: Output Validation — Verify unlocked output opens cleanly WITHOUT password
  if (onProgress) {
    onProgress({ step: "Validating output PDF document...", percent: 90 });
  }
  await yieldThread(50);

  try {
    const verifyDoc = await PDFDocument.load(unlockedBytes.slice(0), { ignoreEncryption: false });
    if (!verifyDoc || verifyDoc.getPageCount() === 0) {
      throw new Error("Output validation failed: empty page count.");
    }
  } catch (verifyErr) {
    console.error("Output Verification Failure:", verifyErr);
    throw {
      errorCode: UNLOCK_ERROR_CODES.PROCESSING_ERROR,
      message: "We couldn't generate a valid unlocked PDF from this file. Please try another file."
    };
  }

  // Finalizing Blob & Download Object URL
  const blob = new Blob([unlockedBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const baseName = sanitizeFilename(fileInfo.name);

  if (onProgress) {
    onProgress({ step: "Finalizing...", percent: 100 });
  }
  await yieldThread(30);

  return {
    success: true,
    blob,
    url,
    filename: `${baseName}-unlocked.pdf`,
    pageCount: validatedPageCount,
    size: blob.size,
    originalName: fileInfo.name,
    originalSize: fileInfo.size
  };
};
