/**
 * Reverse PDF Pages Engine
 * Pure client-side browser engine for reversing PDF page order using pdf-lib and pdfjs-dist.
 * 
 * Capabilities:
 * - 100% Vector Text & Layout Preservation: Direct stream copying via pdf-lib copyPages()
 * - Preserves native fonts, vector graphics, high-res images, transparency, forms & annotations
 * - Fast zero-quality-loss page reordering in milliseconds
 * - Client-side browser execution (zero server file uploads)
 * - Error classification (PASSWORD_PROTECTED, INVALID_PDF, CORRUPTED_PDF, CANCELLED, PROCESSING_FAILED)
 */

export class ReversePdfError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = "ReversePdfError";
    this.code = code;
    this.details = details;
  }
}

/**
 * Lazy loads pdfjs-dist engine for thumbnail and page extraction.
 */
export const getPdfJsEngine = async () => {
  let pdfjs;
  if (typeof window === "undefined") {
    pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  } else {
    pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  }
  return pdfjs;
};

/**
 * Normalizes input source into a clean Uint8Array buffer.
 */
export async function normalizeToUint8Array(source) {
  if (!source) {
    throw new ReversePdfError("No PDF file or buffer provided.", "INVALID_PDF");
  }

  if (source instanceof Uint8Array) {
    return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
  }

  if (source instanceof ArrayBuffer) {
    return new Uint8Array(source);
  }

  if (typeof Blob !== "undefined" && source instanceof Blob) {
    try {
      const arrayBuffer = await source.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch (e) {
      throw new ReversePdfError("Failed to read PDF file contents from memory.", "INVALID_PDF", e);
    }
  }

  if (source && source.buffer instanceof ArrayBuffer) {
    return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
  }

  throw new ReversePdfError(
    "Unsupported input source format. Expected File, Blob, ArrayBuffer, or Uint8Array.",
    "INVALID_PDF"
  );
}

/**
 * Generates safe output filename with deterministic '-reversed.pdf' suffix.
 */
export function getSafeReversedFilename(originalName) {
  if (!originalName || typeof originalName !== "string") {
    return "document-reversed.pdf";
  }

  const baseName = originalName
    .replace(/\.[^/.]+$/, "") // Strip extension
    .replace(/[^a-zA-Z0-9-_]/g, "-") // Replace non-alphanumeric chars with hyphen
    .replace(/-+/g, "-") // Deduplicate hyphens
    .replace(/^-|-$/g, "") // Trim leading/trailing hyphens
    .toLowerCase();

  return `${baseName || "document"}-reversed.pdf`;
}

/**
 * Reads basic PDF structure, page count, and checks encryption state.
 */
export async function readPdfInfo(source) {
  const pdfBytes = await normalizeToUint8Array(source);

  const pdfjs = await getPdfJsEngine();
  let pdfjsDoc;
  try {
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(pdfBytes),
      disableWorker: typeof window === "undefined"
    });
    pdfjsDoc = await loadingTask.promise;
  } catch (err) {
    const errMsg = (err.message || "").toLowerCase();
    const errName = (err.name || "").toLowerCase();
    if (
      err.name === "PasswordException" ||
      errName.includes("password") ||
      err.code === 1 ||
      err.code === 2 ||
      errMsg.includes("encrypted") ||
      errMsg.includes("password") ||
      errMsg.includes("protected")
    ) {
      throw new ReversePdfError(
        "This PDF document is password-protected. Please unlock the PDF before reversing pages.",
        "PASSWORD_PROTECTED",
        err
      );
    }
    throw new ReversePdfError(
      "Failed to parse PDF document structure. The file may be corrupt or invalid.",
      "CORRUPTED_PDF",
      err
    );
  }

  const pageCount = pdfjsDoc.numPages;

  return {
    pageCount,
    byteSize: pdfBytes.length,
    pdfBytes
  };
}

/**
 * Generates array of 0-based page indices according to reversal mode and range.
 */
export function buildReorderedIndices(totalPages, mode = "all", rangeStart = 1, rangeEnd = totalPages) {
  if (totalPages <= 0) return [];

  if (mode === "range") {
    const s = parseInt(rangeStart, 10);
    const e = parseInt(rangeEnd, 10);

    const startIdx = Math.max(0, Math.min(totalPages - 1, (isNaN(s) ? 1 : s) - 1));
    const endIdx = Math.max(0, Math.min(totalPages - 1, (isNaN(e) ? totalPages : e) - 1));

    if (startIdx < endIdx) {
      const indices = [];
      // 1. Pages before range
      for (let i = 0; i < startIdx; i++) {
        indices.push(i);
      }
      // 2. Inverted pages inside range
      for (let i = endIdx; i >= startIdx; i--) {
        indices.push(i);
      }
      // 3. Pages after range
      for (let i = endIdx + 1; i < totalPages; i++) {
        indices.push(i);
      }
      return indices;
    }
  }

  // Default: Full document reversal [totalPages - 1, totalPages - 2, ..., 0]
  return Array.from({ length: totalPages }, (_, i) => totalPages - 1 - i);
}

/**
 * Reverses the page order of a PDF document using pdf-lib.
 * Supports full document reversal or specific page range reversal.
 */
export async function reversePdfPages(source, options = {}) {
  const {
    filename = "document.pdf",
    mode = "all",
    rangeStart = 1,
    rangeEnd = null,
    onProgress = null,
    signal = null
  } = options;

  const startTime = Date.now();

  const reportProgress = (stage, currentPage, totalPages, percentage) => {
    if (onProgress && typeof onProgress === "function") {
      onProgress({
        stage,
        currentPage,
        totalPages,
        percentage: Math.min(100, Math.max(0, Math.round(percentage)))
      });
    }
  };

  const checkSignal = () => {
    if (signal && signal.aborted) {
      throw new ReversePdfError("Page reversal operation was cancelled.", "CANCELLED");
    }
  };

  reportProgress("initializing", 0, 0, 0);
  checkSignal();

  const pdfBytes = await normalizeToUint8Array(source);

  // 1. Load source PDF via pdf-lib
  const { PDFDocument } = await import("pdf-lib");
  let srcPdfDoc;
  try {
    srcPdfDoc = await PDFDocument.load(pdfBytes, {
      ignoreEncryption: false,
      updateMetadata: false
    });
  } catch (err) {
    const errMsg = (err.message || "").toLowerCase();
    if (
      err.name === "PasswordRequiredError" ||
      errMsg.includes("encrypted") ||
      errMsg.includes("password")
    ) {
      throw new ReversePdfError(
        "This PDF document is password-protected. Please unlock the PDF before reversing pages.",
        "PASSWORD_PROTECTED",
        err
      );
    }
    throw new ReversePdfError(
      "Failed to parse PDF document structure. The file may be corrupt or invalid.",
      "CORRUPTED_PDF",
      err
    );
  }

  const totalPages = srcPdfDoc.getPageCount();
  if (totalPages === 0) {
    throw new ReversePdfError("The PDF document contains 0 pages.", "INVALID_PDF");
  }

  reportProgress("reversing", 1, totalPages, 30);
  checkSignal();

  // Determine target page index sequence
  const targetRangeEnd = rangeEnd ? rangeEnd : totalPages;
  const reorderedIndices = buildReorderedIndices(totalPages, mode, rangeStart, targetRangeEnd);

  // 2. Create new document and copy pages in specified order
  let reversedDoc;
  try {
    reversedDoc = await PDFDocument.create();

    reportProgress("copying", 1, totalPages, 60);
    checkSignal();

    const copiedPages = await reversedDoc.copyPages(srcPdfDoc, reorderedIndices);

    for (let i = 0; i < copiedPages.length; i++) {
      checkSignal();
      reversedDoc.addPage(copiedPages[i]);
      reportProgress("copying", i + 1, totalPages, 60 + Math.round(((i + 1) / copiedPages.length) * 30));
    }
  } catch (err) {
    throw new ReversePdfError(
      "Failed to reorder PDF document pages.",
      "PROCESSING_FAILED",
      err
    );
  }

  reportProgress("assembling", totalPages, totalPages, 95);
  checkSignal();

  // 3. Save reversed PDF bytes
  let outPdfBytes;
  try {
    outPdfBytes = await reversedDoc.save();
  } catch (err) {
    throw new ReversePdfError(
      "Failed to save reversed PDF document.",
      "PROCESSING_FAILED",
      err
    );
  }

  reportProgress("complete", totalPages, totalPages, 100);

  const safeName = getSafeReversedFilename(filename);

  return {
    success: true,
    pdfBytes: outPdfBytes,
    blob: typeof Blob !== "undefined" ? new Blob([outPdfBytes], { type: "application/pdf" }) : null,
    filename: safeName,
    pageCount: totalPages,
    reorderedIndices,
    mode,
    rangeStart,
    rangeEnd: targetRangeEnd,
    originalSize: pdfBytes.length,
    outputSize: outPdfBytes.length,
    processingTime: Date.now() - startTime
  };
}

export default {
  readPdfInfo,
  reversePdfPages,
  buildReorderedIndices,
  getSafeReversedFilename,
  normalizeToUint8Array,
  ReversePdfError
};
