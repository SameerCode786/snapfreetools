/**
 * PDF Metadata Editor Engine
 * Pure client-side PDF document metadata reading, updating, and clearing engine using pdf-lib.
 * 
 * Supports:
 * - Title, Author, Subject, Keywords, Creator, Producer, Creation Date, Modification Date
 * - Keyword string/array normalization & chip handling
 * - Date parsing & ISO formatting with safe fallbacks
 * - 100% Client-side browser execution without server uploads
 * - Structured error classification (Password-protected, Corrupted, Invalid source)
 */

import { PDFDocument } from "pdf-lib";

/**
 * Custom Error Class for PDF Metadata Operations
 */
export class PdfMetadataError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = "PdfMetadataError";
    this.code = code;
    this.details = details;
  }
}

/**
 * Normalizes input source into Uint8Array buffer.
 */
export async function normalizeToUint8Array(source) {
  if (!source) {
    throw new PdfMetadataError(
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
      throw new PdfMetadataError(
        "Failed to read file contents from memory.",
        "INVALID_SOURCE",
        e
      );
    }
  }

  if (source && source.buffer instanceof ArrayBuffer) {
    return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
  }

  throw new PdfMetadataError(
    "Unsupported input source format. Expected File, Blob, or ArrayBuffer.",
    "INVALID_SOURCE"
  );
}

/**
 * Parses keywords string or array into normalized array and comma-separated display string.
 * Handles comma, semicolon, or space separation (as returned by pdf-lib).
 */
export function parseKeywordsInput(input) {
  if (!input) return { keywordsArray: [], keywordsString: "" };

  let rawList = [];
  if (Array.isArray(input)) {
    rawList = input;
  } else if (typeof input === "string") {
    if (input.includes(",") || input.includes(";")) {
      rawList = input.split(/[,;]/);
    } else {
      rawList = input.split(/\s+/);
    }
  }

  const cleaned = rawList
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);

  // Deduplicate case-sensitively while preserving order
  const uniqueKeywords = Array.from(new Set(cleaned));

  return {
    keywordsArray: uniqueKeywords,
    keywordsString: uniqueKeywords.join(", "),
  };
}

/**
 * Safely parses Date or ISO date string into Date object.
 */
export function parseDateSafe(dateInput) {
  if (!dateInput) return null;
  if (dateInput instanceof Date) {
    return isNaN(dateInput.getTime()) ? null : dateInput;
  }
  if (typeof dateInput === "string" || typeof dateInput === "number") {
    const parsed = new Date(dateInput);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

/**
 * Formats Date into readable ISO string YYYY-MM-DDThh:mm for datetime-local inputs.
 */
export function formatDateToIsoLocal(dateInput) {
  const date = parseDateSafe(dateInput);
  if (!date) return "";
  try {
    return date.toISOString().slice(0, 16);
  } catch (e) {
    return "";
  }
}

/**
 * Reads existing metadata properties from a PDF document buffer.
 */
export async function readPdfMetadata(source) {
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
      throw new PdfMetadataError(
        "This PDF document is password-protected. Please unlock the PDF before editing metadata.",
        "PASSWORD_PROTECTED",
        err
      );
    }
    throw new PdfMetadataError(
      "Failed to parse PDF document structure. The file may be corrupt or invalid.",
      "CORRUPTED_PDF",
      err
    );
  }

  const title = pdfDoc.getTitle() || "";
  const author = pdfDoc.getAuthor() || "";
  const subject = pdfDoc.getSubject() || "";
  const keywordsRaw = pdfDoc.getKeywords() || "";
  const creator = pdfDoc.getCreator() || "";
  const producer = pdfDoc.getProducer() || "";

  let creationDateStr = "";
  try {
    const cDate = pdfDoc.getCreationDate();
    if (cDate && !isNaN(cDate.getTime())) {
      creationDateStr = cDate.toISOString();
    }
  } catch (e) {
    creationDateStr = "";
  }

  let modDateStr = "";
  try {
    const mDate = pdfDoc.getModificationDate();
    if (mDate && !isNaN(mDate.getTime())) {
      modDateStr = mDate.toISOString();
    }
  } catch (e) {
    modDateStr = "";
  }

  const pageCount = pdfDoc.getPageCount();
  const { keywordsArray, keywordsString } = parseKeywordsInput(keywordsRaw);

  return {
    title,
    author,
    subject,
    keywords: keywordsString,
    keywordsArray,
    creator,
    producer,
    creationDate: creationDateStr,
    modificationDate: modDateStr,
    pageCount,
    byteSize: pdfBytes.length,
  };
}

/**
 * Updates metadata properties of a PDF document and returns the updated PDF Uint8Array.
 */
export async function updatePdfMetadata(source, newMetadata = {}) {
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
      throw new PdfMetadataError(
        "This PDF document is password-protected. Please unlock the PDF before editing metadata.",
        "PASSWORD_PROTECTED",
        err
      );
    }
    throw new PdfMetadataError(
      "Failed to parse PDF document structure. The file may be corrupt or invalid.",
      "CORRUPTED_PDF",
      err
    );
  }

  const {
    title,
    author,
    subject,
    keywords,
    creator,
    producer,
    creationDate,
    modificationDate,
  } = newMetadata;

  // Apply Title
  if (typeof title === "string") {
    pdfDoc.setTitle(title.trim());
  }

  // Apply Author
  if (typeof author === "string") {
    pdfDoc.setAuthor(author.trim());
  }

  // Apply Subject
  if (typeof subject === "string") {
    pdfDoc.setSubject(subject.trim());
  }

  // Apply Keywords
  if (keywords !== undefined) {
    const { keywordsArray } = parseKeywordsInput(keywords);
    pdfDoc.setKeywords(keywordsArray);
  }

  // Apply Creator
  if (typeof creator === "string") {
    pdfDoc.setCreator(creator.trim());
  }

  // Apply Producer
  if (typeof producer === "string") {
    pdfDoc.setProducer(producer.trim());
  }

  // Apply Creation Date
  if (creationDate) {
    const parsedCreationDate = parseDateSafe(creationDate);
    if (parsedCreationDate) {
      pdfDoc.setCreationDate(parsedCreationDate);
    }
  }

  // Apply Modification Date (default to current date if updated)
  const parsedModDate = parseDateSafe(modificationDate) || new Date();
  pdfDoc.setModificationDate(parsedModDate);

  // Save modified document preserving pages and content
  let updatedBytes;
  try {
    updatedBytes = await pdfDoc.save();
  } catch (err) {
    throw new PdfMetadataError(
      "Failed to save modified PDF document metadata.",
      "PROCESSING_FAILED",
      err
    );
  }

  // Read updated metadata to verify persistence
  const updatedReadout = await readPdfMetadata(updatedBytes);

  return {
    success: true,
    pdfBytes: updatedBytes,
    byteSize: updatedBytes.length,
    metadata: updatedReadout,
  };
}

/**
 * Clears all editable metadata fields from a PDF document.
 */
export async function clearPdfMetadata(source) {
  return await updatePdfMetadata(source, {
    title: "",
    author: "",
    subject: "",
    keywords: "",
    creator: "",
    producer: "",
    modificationDate: new Date(),
  });
}

export default {
  readPdfMetadata,
  updatePdfMetadata,
  clearPdfMetadata,
  parseKeywordsInput,
  parseDateSafe,
  formatDateToIsoLocal,
};
