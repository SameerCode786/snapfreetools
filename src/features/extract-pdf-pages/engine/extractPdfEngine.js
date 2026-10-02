/**
 * Extract PDF Pages Engine
 * Pure client-side browser engine for extracting selected pages from PDF documents using pdf-lib and pdfjs-dist.
 * 
 * Capabilities:
 * - Direct PDF Object Stream Copying via pdf-lib copyPages()
 * - Zero Rasterization: Preserves 100% of original vector text, fonts, images, transparency, page dimensions, forms & annotations
 * - Custom Extraction Sequence Support (e.g. pages [6, 2, 4] extracted in exact requested order)
 * - Flexible Range Parser (e.g. "1-3, 5, 8" or [6, 2, 4])
 * - Validation for duplicates, out-of-bounds, invalid syntax, empty selection, corrupted and password-protected PDFs
 * - Client-side browser execution (zero server file uploads)
 * - Error classification (PASSWORD_PROTECTED, INVALID_PDF, CORRUPTED_PDF, EMPTY_SELECTION, INVALID_SELECTION, OUT_OF_RANGE, CANCELLED, PROCESSING_FAILED)
 */

export class ExtractPdfError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = "ExtractPdfError";
    this.code = code;
    this.details = details;
  }
}

/**
 * Lazy loads pdfjs-dist engine for PDF parsing.
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
    throw new ExtractPdfError("No PDF file or buffer provided.", "INVALID_PDF");
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
      throw new ExtractPdfError("Failed to read PDF file contents from memory.", "INVALID_PDF", e);
    }
  }

  if (source && source.buffer instanceof ArrayBuffer) {
    return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
  }

  throw new ExtractPdfError(
    "Unsupported input source format. Expected File, Blob, ArrayBuffer, or Uint8Array.",
    "INVALID_PDF"
  );
}

/**
 * Generates safe output filename with deterministic '-extracted.pdf' suffix.
 */
export function getSafeExtractedFilename(originalName) {
  if (!originalName || typeof originalName !== "string") {
    return "document-extracted.pdf";
  }

  const baseName = originalName
    .replace(/\.[^/.]+$/, "") // Strip extension
    .replace(/[^a-zA-Z0-9-_]/g, "-") // Replace non-alphanumeric chars with hyphen
    .replace(/-+/g, "-") // Deduplicate hyphens
    .replace(/^-|-$/g, "") // Trim leading/trailing hyphens
    .toLowerCase();

  return `${baseName || "document"}-extracted.pdf`;
}

/**
 * Parses user-provided selection (array of numbers or string like "1-3, 5, 8")
 * into 1-based page numbers and 0-based page indices.
 * Validates out-of-range pages, duplicates, and malformed syntax.
 */
export function parsePageSelection(selectionInput, totalPages, options = {}) {
  const { allowDuplicates = false } = options;

  if (totalPages <= 0) {
    throw new ExtractPdfError("PDF document page count must be greater than 0.", "INVALID_PDF");
  }

  if (!selectionInput && selectionInput !== 0) {
    throw new ExtractPdfError("No page selection provided. Please select at least one page.", "EMPTY_SELECTION");
  }

  let pages1Based = [];

  if (Array.isArray(selectionInput)) {
    if (selectionInput.length === 0) {
      throw new ExtractPdfError("Selection list is empty. Please select at least one page.", "EMPTY_SELECTION");
    }
    for (const val of selectionInput) {
      const num = Number(val);
      if (!Number.isInteger(num)) {
        throw new ExtractPdfError(`Invalid page number: "${val}". Page numbers must be integers.`, "INVALID_SELECTION");
      }
      pages1Based.push(num);
    }
  } else if (typeof selectionInput === "number") {
    if (!Number.isInteger(selectionInput)) {
      throw new ExtractPdfError(`Invalid page number: "${selectionInput}". Page numbers must be integers.`, "INVALID_SELECTION");
    }
    pages1Based.push(selectionInput);
  } else if (typeof selectionInput === "string") {
    const trimmed = selectionInput.trim();
    if (!trimmed) {
      throw new ExtractPdfError("No page selection provided. Please select at least one page.", "EMPTY_SELECTION");
    }

    const parts = trimmed.split(/[\s,]+/);
    for (const part of parts) {
      if (!part) continue;

      if (part.includes("-")) {
        const rangeParts = part.split("-");
        if (rangeParts.length !== 2) {
          throw new ExtractPdfError(`Malformed page range: "${part}". Expected format like "1-5".`, "INVALID_SELECTION");
        }

        const start = Number(rangeParts[0].trim());
        const end = Number(rangeParts[1].trim());

        if (!Number.isInteger(start) || !Number.isInteger(end)) {
          throw new ExtractPdfError(`Invalid numbers in page range: "${part}". Range values must be integers.`, "INVALID_SELECTION");
        }

        if (start > end) {
          throw new ExtractPdfError(`Invalid range direction: "${part}". Start page must be less than or equal to end page.`, "INVALID_SELECTION");
        }

        for (let p = start; p <= end; p++) {
          pages1Based.push(p);
        }
      } else {
        const num = Number(part);
        if (!Number.isInteger(num)) {
          throw new ExtractPdfError(`Invalid page number token: "${part}". Page numbers must be integers.`, "INVALID_SELECTION");
        }
        pages1Based.push(num);
      }
    }
  } else {
    throw new ExtractPdfError("Unsupported selection format. Expected Array of numbers or String range.", "INVALID_SELECTION");
  }

  if (pages1Based.length === 0) {
    throw new ExtractPdfError("No valid pages selected. Please select at least one page.", "EMPTY_SELECTION");
  }

  // 1. Validate out-of-range
  for (const pageNum of pages1Based) {
    if (pageNum < 1 || pageNum > totalPages) {
      throw new ExtractPdfError(
        `Page number ${pageNum} is out of bounds. Document contains ${totalPages} ${totalPages === 1 ? "page" : "pages"}.`,
        "OUT_OF_RANGE"
      );
    }
  }

  // 2. Validate duplicates
  if (!allowDuplicates) {
    const seen = new Set();
    for (const pageNum of pages1Based) {
      if (seen.has(pageNum)) {
        throw new ExtractPdfError(
          `Duplicate page selection detected for page ${pageNum}. Duplicate selections are not allowed.`,
          "INVALID_SELECTION"
        );
      }
      seen.add(pageNum);
    }
  }

  const indices0Based = pages1Based.map((p) => p - 1);

  return {
    pages1Based,
    indices0Based
  };
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
      throw new ExtractPdfError(
        "This PDF document is password-protected. Please unlock the PDF before extracting pages.",
        "PASSWORD_PROTECTED",
        err
      );
    }
    throw new ExtractPdfError(
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
 * Extracts selected pages from a PDF document using pdf-lib copyPages().
 * Preserves exact requested selection order (e.g. [6, 2, 4] extracts pages 6, 2, and 4 in that exact order).
 */
export async function extractPdfPages(source, selectedPagesInput, options = {}) {
  const {
    filename = "document.pdf",
    allowDuplicates = false,
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
      throw new ExtractPdfError("PDF page extraction operation was cancelled.", "CANCELLED");
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
      throw new ExtractPdfError(
        "This PDF document is password-protected. Please unlock the PDF before extracting pages.",
        "PASSWORD_PROTECTED",
        err
      );
    }
    throw new ExtractPdfError(
      "Failed to parse PDF document structure. The file may be corrupt or invalid.",
      "CORRUPTED_PDF",
      err
    );
  }

  const totalPages = srcPdfDoc.getPageCount();
  if (totalPages === 0) {
    throw new ExtractPdfError("The PDF document contains 0 pages.", "INVALID_PDF");
  }

  reportProgress("parsing", 0, totalPages, 20);
  checkSignal();

  // 2. Parse and validate selection input
  const { pages1Based, indices0Based } = parsePageSelection(selectedPagesInput, totalPages, { allowDuplicates });

  reportProgress("extracting", 1, pages1Based.length, 40);
  checkSignal();

  // 3. Create new document and copy selected pages in exact requested sequence
  let extractedDoc;
  try {
    extractedDoc = await PDFDocument.create();

    const copiedPages = await extractedDoc.copyPages(srcPdfDoc, indices0Based);

    for (let i = 0; i < copiedPages.length; i++) {
      checkSignal();
      extractedDoc.addPage(copiedPages[i]);
      reportProgress("extracting", i + 1, copiedPages.length, 40 + Math.round(((i + 1) / copiedPages.length) * 50));
    }
  } catch (err) {
    throw new ExtractPdfError(
      "Failed to copy selected PDF pages into new document.",
      "PROCESSING_FAILED",
      err
    );
  }

  reportProgress("assembling", pages1Based.length, pages1Based.length, 95);
  checkSignal();

  // 4. Save extracted PDF bytes
  let outPdfBytes;
  try {
    outPdfBytes = await extractedDoc.save();
  } catch (err) {
    throw new ExtractPdfError(
      "Failed to save extracted PDF document.",
      "PROCESSING_FAILED",
      err
    );
  }

  reportProgress("complete", pages1Based.length, pages1Based.length, 100);

  const safeName = getSafeExtractedFilename(filename);

  return {
    success: true,
    pdfBytes: outPdfBytes,
    blob: typeof Blob !== "undefined" ? new Blob([outPdfBytes], { type: "application/pdf" }) : null,
    filename: safeName,
    originalPageCount: totalPages,
    extractedPageCount: pages1Based.length,
    selectedPages1Based: pages1Based,
    originalSize: pdfBytes.length,
    outputSize: outPdfBytes.length,
    processingTime: Date.now() - startTime
  };
}

export default {
  readPdfInfo,
  extractPdfPages,
  parsePageSelection,
  getSafeExtractedFilename,
  normalizeToUint8Array,
  ExtractPdfError
};
