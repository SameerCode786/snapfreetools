import { PDFDocument } from "pdf-lib";
import { executeQpdfEncryption } from "./qpdfLoader.js";

/**
 * Typed Error Codes for Protect PDF Operations
 */
export const PROTECT_ERROR_CODES = {
  INVALID_FILE: "INVALID_FILE",
  CORRUPTED_PDF: "CORRUPTED_PDF",
  PASSWORD_MISMATCH: "PASSWORD_MISMATCH",
  EMPTY_PASSWORD: "EMPTY_PASSWORD",
  PROCESSING_ERROR: "PROCESSING_ERROR",
  VERIFICATION_FAILED: "VERIFICATION_FAILED"
};

/**
 * Gets or initializes pdfjs-dist worker engine for PDF authentication & rendering.
 */
export const getPdfJsEngine = async () => {
  let pdfjsModule;
  if (typeof window !== "undefined") {
    pdfjsModule = await import("pdfjs-dist");
  } else {
    pdfjsModule = await import("pdfjs-dist/legacy/build/pdf.mjs");
  }
  const pdfjs = pdfjsModule.default || pdfjsModule;
  if (typeof window !== "undefined" && pdfjs.GlobalWorkerOptions) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  }
  return pdfjs;
};

/**
 * Asynchronous yield helper to ensure UI responsiveness during heavy processing.
 */
const yieldThread = (ms = 40) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Helper to sanitize filenames for safe downloading
 */
export const sanitizeFilename = (name) => {
  if (!name) return "document";
  return name.replace(/\.pdf$/i, "").replace(/[^a-zA-Z0-9_-]/g, "_");
};

/**
 * Helper to format bytes into readable file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0 || !bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Phase 1: Inspect uploaded PDF document for protection
 */
export const inspectPdfForProtection = async (file) => {
  if (!file || (typeof file.arrayBuffer !== "function" && typeof file.stream !== "function")) {
    throw { errorCode: PROTECT_ERROR_CODES.CORRUPTED_PDF, message: "This PDF document appears to be corrupted or invalid. Please select another file." };
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw { errorCode: PROTECT_ERROR_CODES.INVALID_FILE, message: "Please upload a valid PDF document (.pdf)." };
  }

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB Limit
  if (file.size > MAX_FILE_SIZE) {
    throw { errorCode: PROTECT_ERROR_CODES.PROCESSING_ERROR, message: "This file exceeds the maximum supported size of 50 MB for client-side processing." };
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdfjs = await getPdfJsEngine();

  let isAlreadyProtected = false;
  let pageCount = null;
  let firstPageThumbnail = null;
  let pdfJsDoc = null;

  try {
    pdfJsDoc = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) }).promise;
    pageCount = pdfJsDoc.numPages;
    isAlreadyProtected = false;
  } catch (err) {
    if (err.name === "PasswordException" || (err.message && err.message.toLowerCase().includes("password"))) {
      isAlreadyProtected = true;
    } else {
      throw {
        errorCode: PROTECT_ERROR_CODES.CORRUPTED_PDF,
        message: "This PDF document appears to be corrupted or invalid. Please select another file."
      };
    }
  }

  // Render first page thumbnail if unencrypted
  if (!isAlreadyProtected && pdfJsDoc && pageCount > 0) {
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
    } catch (thumbErr) {}
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: file.name,
    size: file.size,
    pageCount,
    isAlreadyProtected,
    firstPageThumbnail,
    rawFile: file,
    arrayBuffer
  };
};

/**
 * Output Verification Engine: Verifies that output PDF is unencrypted without password,
 * and opens cleanly with the newly created password.
 */
export const validateProtectedPdfOutput = async (protectedBytes, userPassword, originalPageCount = null) => {
  if (!protectedBytes || protectedBytes.length < 100) {
    throw {
      errorCode: PROTECT_ERROR_CODES.VERIFICATION_FAILED,
      message: "Unable to generate a valid protected PDF. Output file is incomplete."
    };
  }

  const pdfjs = await getPdfJsEngine();

  // Verification Step 1: Attempt loading WITHOUT password (MUST throw PasswordException)
  let unauthenticatedFailed = false;
  try {
    await pdfjs.getDocument({ data: new Uint8Array(protectedBytes.slice(0)) }).promise;
  } catch (err) {
    if (err.name === "PasswordException" || (err.message && err.message.toLowerCase().includes("password"))) {
      unauthenticatedFailed = true;
    }
  }

  if (!unauthenticatedFailed) {
    throw {
      errorCode: PROTECT_ERROR_CODES.VERIFICATION_FAILED,
      message: "Security verification failed: Output document was not encrypted with a password prompt."
    };
  }

  // Verification Step 2: Attempt loading WITH created password (MUST succeed and return pages)
  try {
    const verifiedDoc = await pdfjs.getDocument({
      data: new Uint8Array(protectedBytes.slice(0)),
      password: userPassword.trim()
    }).promise;

    if (!verifiedDoc || verifiedDoc.numPages === 0) {
      throw new Error("Page count is zero.");
    }

    if (originalPageCount && verifiedDoc.numPages !== originalPageCount) {
      console.warn(`Page count warning: Original ${originalPageCount}, Protected ${verifiedDoc.numPages}`);
    }
  } catch (err) {
    console.error("Authenticated PDF Verification Failure:", err);
    throw {
      errorCode: PROTECT_ERROR_CODES.VERIFICATION_FAILED,
      message: "Security verification failed: Output document could not be authenticated with your password."
    };
  }

  return true;
};

/**
 * Main Controller Function: executePdfProtection
 */
export const executePdfProtection = async ({
  fileInfo,
  userPassword,
  confirmPassword,
  ownerPassword = "",
  keyLength = "256",
  permissions = {
    printing: false,
    copying: false,
    modifying: false,
    annotating: false
  },
  onProgress
}) => {
  if (!fileInfo || !fileInfo.arrayBuffer) {
    throw { errorCode: PROTECT_ERROR_CODES.CORRUPTED_PDF, message: "No PDF document selected." };
  }

  if (!userPassword || !userPassword.trim()) {
    throw { errorCode: PROTECT_ERROR_CODES.EMPTY_PASSWORD, message: "Please enter a password to protect your PDF document." };
  }

  if (userPassword !== confirmPassword) {
    throw { errorCode: PROTECT_ERROR_CODES.PASSWORD_MISMATCH, message: "Passwords do not match. Please verify your password entry." };
  }

  // Runtime Browser Environment Isolation Check
  if (typeof window !== "undefined" && !window.crossOriginIsolated) {
    throw {
      errorCode: PROTECT_ERROR_CODES.PROCESSING_ERROR,
      message: "Secure PDF protection requires a compatible browser environment."
    };
  }

  // Step 1: Loading encryption engine
  if (onProgress) {
    onProgress({ step: "Loading client-side PDF encryption engine...", percent: 20 });
  }
  await yieldThread(40);

  // Step 2: Encrypting PDF
  if (onProgress) {
    onProgress({ step: `Encrypting streams with ${keyLength === "128" ? "AES-128" : "AES-256"}...`, percent: 50 });
  }
  await yieldThread(50);

  let protectedBytes = null;
  try {
    protectedBytes = await executeQpdfEncryption({
      arrayBuffer: fileInfo.arrayBuffer,
      userPassword,
      ownerPassword,
      keyLength,
      permissions
    });
  } catch (err) {
    console.error("PDF Protection Engine Failure:", err);
    throw {
      errorCode: PROTECT_ERROR_CODES.PROCESSING_ERROR,
      message: err.message || "Unable to protect this PDF document. Please try another file."
    };
  }

  // Step 3: Verification
  if (onProgress) {
    onProgress({ step: "Validating output PDF security & password requirement...", percent: 85 });
  }
  await yieldThread(40);

  await validateProtectedPdfOutput(protectedBytes, userPassword, fileInfo.pageCount);

  // Step 4: Finalizing
  const blob = new Blob([protectedBytes], { type: "application/pdf" });
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
    filename: `${baseName}-protected.pdf`,
    pageCount: fileInfo.pageCount || 1,
    size: blob.size,
    originalName: fileInfo.name,
    originalSize: fileInfo.size,
    keyLength,
    message: "PDF protected successfully with password encryption."
  };
};
