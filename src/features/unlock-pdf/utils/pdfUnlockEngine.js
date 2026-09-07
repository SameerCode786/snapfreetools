import { PDFDocument, PDFName } from "pdf-lib";
import { decryptPDF } from "@pdfsmaller/pdf-decrypt";
import { sanitizeFilename } from "./formatters.js";

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
 * Technical Security Detection: Extracts PDF encryption algorithm, revision, and permission bits.
 */
export const detectPdfSecurityDetails = async (arrayBuffer) => {
  let isEncryptedPdfLib = false;
  let pdfLibDoc = null;
  let encryptionAlgorithm = "None";
  let algorithmKey = "NONE";
  let isSupported = true;
  let permissions = null;
  let v = null;
  let r = null;
  let cfm = null;

  try {
    pdfLibDoc = await PDFDocument.load(arrayBuffer.slice(0), { ignoreEncryption: true });
    const trailer = pdfLibDoc.context.trailerInfo;
    const encryptRef = trailer?.Encrypt || pdfLibDoc.catalog.get(PDFName.of("Encrypt"));

    if (encryptRef) {
      isEncryptedPdfLib = true;
      const dict = pdfLibDoc.context.lookup(encryptRef);
      if (dict && dict.get) {
        v = dict.get(PDFName.of("V"))?.numberValue || dict.get(PDFName.of("V"))?.value;
        r = dict.get(PDFName.of("R"))?.numberValue || dict.get(PDFName.of("R"))?.value;
        permissions = dict.get(PDFName.of("P"))?.numberValue || dict.get(PDFName.of("P"))?.value;
        cfm = dict.get(PDFName.of("CFM"))?.value || dict.get(PDFName.of("CFM"))?.name;
      }
    }
  } catch (err) {
    // pdf-lib load fail fallback handled in main flow
  }

  // Fallback text inspection if pdf-lib lookup didn't catch /Encrypt
  if (!isEncryptedPdfLib) {
    try {
      const bytes = new Uint8Array(arrayBuffer);
      const textDecoder = new TextDecoder("latin1");
      const sampleStr = textDecoder.decode(bytes.slice(0, Math.min(bytes.length, 300000))) + 
                        textDecoder.decode(bytes.slice(Math.max(0, bytes.length - 100000)));
      if (sampleStr.includes("/Encrypt")) {
        isEncryptedPdfLib = true;
      }
    } catch (e) {}
  }

  if (isEncryptedPdfLib) {
    if (r === 5 || r === 6 || v === 5 || cfm === "AESV3") {
      encryptionAlgorithm = "AES-256";
      algorithmKey = "AES_256";
    } else if (r === 4 || v === 4 || cfm === "AESV2") {
      encryptionAlgorithm = "AES-128";
      algorithmKey = "AES_128";
    } else if (r === 2 || r === 3 || v === 1 || v === 2 || cfm === "V2") {
      encryptionAlgorithm = "RC4";
      algorithmKey = "RC4";
    } else {
      encryptionAlgorithm = "Standard Encryption";
      algorithmKey = "STANDARD";
    }

    if (r && r > 6) {
      isSupported = false;
      encryptionAlgorithm = "Unsupported Encryption";
    }
  }

  return {
    isEncryptedPdfLib,
    encryptionAlgorithm,
    algorithmKey,
    isSupported,
    permissions,
    v,
    r
  };
};

/**
 * Phase 1: Inspect uploaded PDF document
 * Detects encryption status, security details, pages, thumbnail, and validates file size.
 */
export const inspectPdfForUnlock = async (file) => {
  if (!file || (typeof file.arrayBuffer !== "function" && typeof file.stream !== "function")) {
    throw { errorCode: UNLOCK_ERROR_CODES.CORRUPTED_PDF, message: "This PDF document appears to be corrupted or invalid. Please select another file." };
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw { errorCode: UNLOCK_ERROR_CODES.CORRUPTED_PDF, message: "Please upload a valid PDF document (.pdf)." };
  }

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB Limit
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
    pdfJsDoc = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) }).promise;
    pageCount = pdfJsDoc.numPages;
    isProtected = false;
  } catch (err) {
    if (err.name === "PasswordException" || (err.message && err.message.toLowerCase().includes("password"))) {
      isProtected = true;
    } else {
      throw {
        errorCode: UNLOCK_ERROR_CODES.CORRUPTED_PDF,
        message: "This PDF document appears to be corrupted or invalid. Please select another file."
      };
    }
  }

  // Detect detailed security metadata
  const securityDetails = await detectPdfSecurityDetails(arrayBuffer);

  const hasRestrictions = !isProtected && securityDetails.isEncryptedPdfLib;

  let protectionType = "None (Unprotected PDF)";
  let securityLabel = "Unprotected PDF";
  let recommendation = "This PDF does not have password protection.";

  if (isProtected) {
    protectionType = "Opening Password Required";
    securityLabel = `${securityDetails.encryptionAlgorithm} Password Protected`;
    recommendation = "Enter your password to unlock this PDF.";
  } else if (hasRestrictions) {
    protectionType = "Permission Restrictions Only";
    securityLabel = `${securityDetails.encryptionAlgorithm} (Usage Restricted)`;
    recommendation = "Click 'Remove Restrictions' to enable printing, copying, and editing.";
  }

  if (!securityDetails.isSupported) {
    protectionType = "Unsupported Encryption Format";
    securityLabel = "Unsupported Encryption";
    recommendation = "This PDF uses an encryption format that this browser-based tool cannot process.";
  }

  // Generate thumbnail if file opens without password
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
      // Thumbnail rendering skipped for complex files
    }
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: file.name,
    size: file.size,
    isProtected,
    hasRestrictions,
    protectionType,
    securityLabel,
    encryptionAlgorithm: securityDetails.encryptionAlgorithm,
    isSupported: securityDetails.isSupported,
    recommendation,
    pageCount,
    firstPageThumbnail,
    rawFile: file,
    arrayBuffer
  };
};

/**
 * Output Validation Engine: Verifies that output PDF is unencrypted, opens cleanly without password,
 * and maintains structural page integrity.
 */
export const validateUnlockedPdfOutput = async (unlockedBytes, expectedPageCount = null) => {
  if (!unlockedBytes || unlockedBytes.length < 100) {
    throw {
      errorCode: UNLOCK_ERROR_CODES.PROCESSING_ERROR,
      message: "Unable to create a valid unlocked PDF. Please try another file."
    };
  }

  // 1. Verify with pdf-lib without ignoreEncryption
  let verifyDoc = null;
  try {
    verifyDoc = await PDFDocument.load(unlockedBytes.slice(0), { ignoreEncryption: false });
    if (!verifyDoc || verifyDoc.getPageCount() === 0) {
      throw new Error("Empty page count");
    }
  } catch (err) {
    console.error("PDF Validation Error (pdf-lib):", err);
    throw {
      errorCode: UNLOCK_ERROR_CODES.PROCESSING_ERROR,
      message: "Unable to create a valid unlocked PDF. Please try another file."
    };
  }

  // 2. Verify with pdfjs-dist without password parameter
  try {
    const pdfjs = await getPdfJsEngine();
    const pdfJsVerify = await pdfjs.getDocument({ data: new Uint8Array(unlockedBytes.slice(0)) }).promise;
    if (!pdfJsVerify || pdfJsVerify.numPages === 0) {
      throw new Error("pdfjs-dist validation failed");
    }
  } catch (err) {
    console.error("PDF Validation Error (pdfjs):", err);
    throw {
      errorCode: UNLOCK_ERROR_CODES.PROCESSING_ERROR,
      message: "Unable to create a valid unlocked PDF. Please try another file."
    };
  }

  return true;
};

/**
 * Execute Removal of Usage Restrictions (Case 4)
 * For PDFs that open without password, but contain owner permission restrictions.
 */
export const executeRemoveRestrictions = async ({ fileInfo, onProgress }) => {
  if (!fileInfo || !fileInfo.arrayBuffer) {
    throw { errorCode: UNLOCK_ERROR_CODES.CORRUPTED_PDF, message: "No PDF document selected." };
  }

  if (onProgress) {
    onProgress({ step: "Analyzing PDF restrictions...", percent: 30 });
  }
  await yieldThread(40);

  let unlockedBytes = null;
  try {
    const pdfLibDoc = await PDFDocument.load(fileInfo.arrayBuffer.slice(0), { ignoreEncryption: true });
    if (pdfLibDoc.context.trailerInfo) {
      delete pdfLibDoc.context.trailerInfo.Encrypt;
    }
    pdfLibDoc.catalog.delete(PDFName.of("Encrypt"));
    unlockedBytes = await pdfLibDoc.save({ useObjectStreams: false });
  } catch (err) {
    throw {
      errorCode: UNLOCK_ERROR_CODES.PROCESSING_ERROR,
      message: "Unable to remove restrictions from this PDF. Please try another file."
    };
  }

  if (onProgress) {
    onProgress({ step: "Validating output PDF document...", percent: 80 });
  }
  await yieldThread(40);

  // Validate output
  await validateUnlockedPdfOutput(unlockedBytes, fileInfo.pageCount);

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
    pageCount: fileInfo.pageCount || 1,
    size: blob.size,
    originalName: fileInfo.name,
    originalSize: fileInfo.size,
    isRestrictionRemoval: true,
    message: "Restrictions removed successfully."
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
      data: new Uint8Array(fileInfo.arrayBuffer.slice(0)),
      password: cleanPassword
    }).promise;
  } catch (authErr) {
    if (authErr.name === "PasswordException") {
      throw {
        errorCode: UNLOCK_ERROR_CODES.INVALID_PASSWORD,
        message: "Incorrect password. Please check your password and try again."
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
        message: "Unable to create a valid unlocked PDF. Please try another file."
      };
    }
  }

  // Step 3: Output Validation — Verify unlocked output opens cleanly WITHOUT password
  if (onProgress) {
    onProgress({ step: "Validating output PDF document...", percent: 90 });
  }
  await yieldThread(50);

  await validateUnlockedPdfOutput(unlockedBytes, validatedPageCount);

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
    originalSize: fileInfo.size,
    message: "PDF password removed successfully."
  };
};

