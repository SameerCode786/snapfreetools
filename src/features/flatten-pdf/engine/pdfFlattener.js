/**
 * PDF Flattener Engine
 * Pure client-side PDF form field and annotation flattening engine using pdf-lib.
 * 
 * Capabilities:
 * - Bakes interactive AcroForm fields (text boxes, checkboxes, radio buttons, dropdowns) into static page vector operators
 * - Removes interactive field dictionaries and widget annotations
 * - Preserves visual page appearances, page dimensions, text quality, and document geometry
 * - 100% Client-side browser execution (zero server uploads)
 * - Error classification (PASSWORD_PROTECTED, CORRUPTED_PDF, INVALID_SOURCE)
 */

import { PDFDocument } from "pdf-lib";

export class PdfFlattenError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = "PdfFlattenError";
    this.code = code;
    this.details = details;
  }
}

/**
 * Normalizes input source into Uint8Array buffer.
 */
export async function normalizeToUint8Array(source) {
  if (!source) {
    throw new PdfFlattenError(
      "No PDF file or buffer provided.",
      "INVALID_SOURCE"
    );
  }

  if (source instanceof Uint8Array) {
    return source;
  }

  if (source instanceof ArrayBuffer) {
    return new Uint8Array(source);
  }

  if (typeof Blob !== "undefined" && source instanceof Blob) {
    try {
      const arrayBuffer = await source.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch (e) {
      throw new PdfFlattenError(
        "Failed to read PDF file contents from memory.",
        "INVALID_SOURCE",
        e
      );
    }
  }

  if (source && source.buffer instanceof ArrayBuffer) {
    return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
  }

  throw new PdfFlattenError(
    "Unsupported input source format. Expected File, Blob, or ArrayBuffer.",
    "INVALID_SOURCE"
  );
}

/**
 * Reads basic PDF structure and checks for interactive form fields.
 */
export async function readPdfInfo(source) {
  const pdfBytes = await normalizeToUint8Array(source);

  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(pdfBytes, {
      ignoreEncryption: false,
      updateMetadata: false,
    });
  } catch (err) {
    const errMsg = (err.message || "").toLowerCase();
    if (
      errMsg.includes("encrypted") ||
      errMsg.includes("password") ||
      err.name === "PasswordRequiredError"
    ) {
      throw new PdfFlattenError(
        "This PDF document is password-protected. Please unlock the PDF before flattening.",
        "PASSWORD_PROTECTED",
        err
      );
    }
    throw new PdfFlattenError(
      "Failed to parse PDF document structure. The file may be corrupt or invalid.",
      "CORRUPTED_PDF",
      err
    );
  }

  const pageCount = pdfDoc.getPageCount();
  let fieldCount = 0;
  let formHasFields = false;

  try {
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    fieldCount = fields.length;
    formHasFields = fieldCount > 0;
  } catch (e) {
    // PDF has no AcroForm dictionary
    fieldCount = 0;
    formHasFields = false;
  }

  return {
    pageCount,
    byteSize: pdfBytes.length,
    fieldCount,
    formHasFields,
    pdfBytes,
  };
}

/**
 * Flattens interactive form fields and annotations in a PDF document.
 */
export async function flattenPdf(source, options = {}, onProgress = null) {
  if (onProgress) onProgress("Reading PDF document structure...");
  const pdfBytes = await normalizeToUint8Array(source);

  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(pdfBytes, {
      ignoreEncryption: false,
      updateMetadata: false,
    });
  } catch (err) {
    const errMsg = (err.message || "").toLowerCase();
    if (
      errMsg.includes("encrypted") ||
      errMsg.includes("password") ||
      err.name === "PasswordRequiredError"
    ) {
      throw new PdfFlattenError(
        "This PDF document is password-protected. Please unlock the PDF before flattening.",
        "PASSWORD_PROTECTED",
        err
      );
    }
    throw new PdfFlattenError(
      "Failed to parse PDF document structure. The file may be corrupt or invalid.",
      "CORRUPTED_PDF",
      err
    );
  }

  if (onProgress) onProgress("Detecting interactive form fields and annotations...");

  let initialFieldsCount = 0;
  let formExisted = false;

  try {
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    initialFieldsCount = fields.length;
    formExisted = initialFieldsCount > 0;

    if (onProgress) onProgress("Flattening interactive elements into page graphics...");

    // Call pdf-lib form.flatten() to bake fields into page contents
    form.flatten();
  } catch (e) {
    // No AcroForm present, nothing to flatten at form level
    initialFieldsCount = 0;
  }

  if (onProgress) onProgress("Optimizing and generating flattened PDF...");

  let flattenedBytes;
  try {
    flattenedBytes = await pdfDoc.save({ updateFieldAppearances: true });
  } catch (err) {
    throw new PdfFlattenError(
      "Failed to save flattened PDF document.",
      "PROCESSING_FAILED",
      err
    );
  }

  if (onProgress) onProgress("Verifying flattened PDF integrity...");

  // Verify reloaded document integrity
  let reloadedDoc;
  let finalFieldsCount = 0;
  try {
    reloadedDoc = await PDFDocument.load(flattenedBytes, {
      ignoreEncryption: false,
      updateMetadata: false,
    });
    try {
      finalFieldsCount = reloadedDoc.getForm().getFields().length;
    } catch (e) {
      finalFieldsCount = 0;
    }
  } catch (e) {
    // If verification reload fails, return flattenedBytes anyway
    reloadedDoc = null;
  }

  const finalPageCount = reloadedDoc ? reloadedDoc.getPageCount() : pdfDoc.getPageCount();

  return {
    success: true,
    pdfBytes: flattenedBytes,
    byteSize: flattenedBytes.length,
    originalByteSize: pdfBytes.length,
    pageCount: finalPageCount,
    initialFieldsCount,
    finalFieldsCount,
    fieldsFlattenedCount: Math.max(0, initialFieldsCount - finalFieldsCount),
  };
}

/**
 * Generates safe output filename.
 */
export function getSafeFlattenedFilename(originalName) {
  if (!originalName || typeof originalName !== "string") {
    return "flattened-document.pdf";
  }

  const baseName = originalName
    .replace(/\.[^/.]+$/, "") // Strip extension
    .replace(/[^a-zA-Z0-9-_]/g, "-") // Replace non-alphanumeric chars with hyphen
    .replace(/-+/g, "-") // Deduplicate hyphens
    .replace(/^-|-$/g, "") // Trim leading/trailing hyphens
    .toLowerCase();

  return `${baseName || "document"}-flattened.pdf`;
}

export default {
  readPdfInfo,
  flattenPdf,
  getSafeFlattenedFilename,
  PdfFlattenError,
};
