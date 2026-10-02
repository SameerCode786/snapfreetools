/**
 * PDF to Grayscale Engine
 * High-fidelity client-side PDF grayscale conversion engine using pdfjs-dist, HTML5 Canvas, and pdf-lib.
 * 
 * Capabilities:
 * - Page-by-page sequential rendering & luminance grayscale pixel processing
 * - Standard ITU-R BT.601 luminance conversion (Y = 0.299R + 0.587G + 0.114B)
 * - White background compositing for transparency & alpha channels
 * - Document structure preservation (page count, dimensions, landscape/portrait aspect ratio)
 * - AbortSignal cancellation support with clean memory deallocation
 * - Granular progress callback updates
 * - Structured error classification (PASSWORD_PROTECTED, INVALID_PDF, CORRUPTED_PDF, CANCELLED, PROCESSING_FAILED)
 */

export class PdfGrayscaleError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = "PdfGrayscaleError";
    this.code = code;
    this.details = details;
  }
}

/**
 * Gets or initializes pdfjs-dist worker engine for PDF parsing and page rendering.
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
 * Normalizes input source into Uint8Array buffer.
 */
export async function normalizeToUint8Array(source) {
  if (!source) {
    throw new PdfGrayscaleError("No PDF file or buffer provided.", "INVALID_PDF");
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
      throw new PdfGrayscaleError(
        "Failed to read PDF file contents from memory.",
        "INVALID_PDF",
        e
      );
    }
  }

  if (source && source.buffer instanceof ArrayBuffer) {
    return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
  }

  throw new PdfGrayscaleError(
    "Unsupported input source format. Expected File, Blob, ArrayBuffer, or Uint8Array.",
    "INVALID_PDF"
  );
}

/**
 * Generates safe output filename with deterministic '-grayscale.pdf' suffix.
 */
export function getSafeGrayscaleFilename(originalName) {
  if (!originalName || typeof originalName !== "string") {
    return "document-grayscale.pdf";
  }

  const baseName = originalName
    .replace(/\.[^/.]+$/, "") // Strip extension
    .replace(/[^a-zA-Z0-9-_]/g, "-") // Replace non-alphanumeric chars with hyphen
    .replace(/-+/g, "-") // Deduplicate hyphens
    .replace(/^-|-$/g, "") // Trim leading/trailing hyphens
    .toLowerCase();

  return `${baseName || "document"}-grayscale.pdf`;
}

/**
 * Creates canvas element safely for browser, OffscreenCanvas, and Node test environments.
 */
function createCanvas(width, height) {
  const w = Math.max(1, Math.ceil(width));
  const h = Math.max(1, Math.ceil(height));

  if (typeof document !== "undefined" && typeof document.createElement === "function") {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    return canvas;
  }

  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(w, h);
  }

  // Environment fallback for Node.js automated test runners (@napi-rs/canvas)
  if (typeof globalThis !== "undefined" && globalThis.__NAPI_CANVAS_CREATE__) {
    return globalThis.__NAPI_CANVAS_CREATE__(w, h);
  }

  throw new PdfGrayscaleError(
    "Canvas rendering API is unavailable in this environment.",
    "PROCESSING_FAILED"
  );
}

/**
 * Exports canvas content to JPEG Uint8Array byte buffer.
 */
function canvasToJpegBytes(canvas, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (typeof canvas.toBlob === "function") {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error("Canvas toBlob output was null."));
          }
          blob
            .arrayBuffer()
            .then((ab) => resolve(new Uint8Array(ab)))
            .catch(reject);
        },
        "image/jpeg",
        quality
      );
    } else if (typeof canvas.toDataURL === "function") {
      try {
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const base64 = dataUrl.split(",")[1];
        const binaryStr = atob(base64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        resolve(bytes);
      } catch (e) {
        reject(e);
      }
    } else if (typeof canvas.toBuffer === "function") {
      try {
        const buf = canvas.toBuffer("image/jpeg", { quality });
        resolve(new Uint8Array(buf));
      } catch (e) {
        reject(e);
      }
    } else {
      reject(new Error("Canvas JPEG export unavailable in current environment."));
    }
  });
}

/**
 * Reads basic PDF structure and checks page count / encryption state.
 */
export async function readPdfGrayscaleInfo(source) {
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
      throw new PdfGrayscaleError(
        "This PDF document is password-protected. Please unlock the PDF before converting.",
        "PASSWORD_PROTECTED",
        err
      );
    }
    throw new PdfGrayscaleError(
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
 * Converts a PDF document to grayscale page-by-page.
 */
export async function convertPdfToGrayscale(source, options = {}) {
  const {
    dpi = 150,
    quality = 0.85,
    mode = "standard",
    filename = "document.pdf",
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
      throw new PdfGrayscaleError(
        "Grayscale processing was cancelled.",
        "CANCELLED"
      );
    }
  };

  reportProgress("initializing", 0, 0, 0);
  checkSignal();

  const pdfBytes = await normalizeToUint8Array(source);

  // 1. Parse PDF using pdfjs-dist
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
      throw new PdfGrayscaleError(
        "This PDF document is password-protected. Please unlock the PDF before converting.",
        "PASSWORD_PROTECTED",
        err
      );
    }
    throw new PdfGrayscaleError(
      "Failed to parse PDF document structure. The file may be corrupt or invalid.",
      "CORRUPTED_PDF",
      err
    );
  }

  const totalPages = pdfjsDoc.numPages;
  if (totalPages === 0) {
    throw new PdfGrayscaleError(
      "The PDF document contains 0 pages.",
      "INVALID_PDF"
    );
  }

  // 2. Initialize output PDF document with pdf-lib
  const { PDFDocument } = await import("pdf-lib");
  let outPdfDoc;
  try {
    outPdfDoc = await PDFDocument.create();
  } catch (err) {
    throw new PdfGrayscaleError(
      "Failed to initialize output PDF document.",
      "PROCESSING_FAILED",
      err
    );
  }

  // Target DPI scale (Standard PDF points base = 72 DPI)
  const baseScale = dpi / 72;
  const MAX_CANVAS_AREA = 12000000; // 12 Megapixels area limit safeguard

  // 3. Process each page sequentially
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    checkSignal();

    reportProgress("rendering", pageNum, totalPages, ((pageNum - 0.8) / totalPages) * 100);

    let page;
    try {
      page = await pdfjsDoc.getPage(pageNum);
    } catch (err) {
      throw new PdfGrayscaleError(
        `Failed to load page ${pageNum} from PDF.`,
        "PROCESSING_FAILED",
        err
      );
    }

    const unscaledViewport = page.getViewport({ scale: 1.0 });
    const pdfWidth = unscaledViewport.width;
    const pdfHeight = unscaledViewport.height;

    let scale = baseScale;
    let targetWidth = pdfWidth * scale;
    let targetHeight = pdfHeight * scale;

    // Safety check: Cap canvas area if it exceeds maximum pixel area threshold
    if (targetWidth * targetHeight > MAX_CANVAS_AREA) {
      const currentArea = targetWidth * targetHeight;
      const shrinkRatio = Math.sqrt(MAX_CANVAS_AREA / currentArea);
      scale = scale * shrinkRatio;
    }

    const viewport = page.getViewport({ scale });

    // Create canvas & context
    let canvas, ctx;
    try {
      canvas = createCanvas(viewport.width, viewport.height);
      ctx = canvas.getContext("2d");
    } catch (err) {
      throw new PdfGrayscaleError(
        `Canvas context creation failed for page ${pageNum}. Environment may lack canvas support.`,
        "PROCESSING_FAILED",
        err
      );
    }

    // Composite clean white background for transparent pages
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render PDF page to canvas
    try {
      await page.render({
        canvasContext: ctx,
        viewport: viewport
      }).promise;
    } catch (err) {
      throw new PdfGrayscaleError(
        `Failed to render page ${pageNum} to canvas.`,
        "PROCESSING_FAILED",
        err
      );
    }

    checkSignal();
    reportProgress("converting", pageNum, totalPages, ((pageNum - 0.3) / totalPages) * 100);

    // Apply Standard Luminance Grayscale Filter (ITU-R BT.601: 0.299R + 0.587G + 0.114B)
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const len = data.length;

      for (let p = 0; p < len; p += 4) {
        const r = data[p];
        const g = data[p + 1];
        const b = data[p + 2];

        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

        data[p] = gray;
        data[p + 1] = gray;
        data[p + 2] = gray;
        // Alpha channel (data[p+3]) is preserved
      }

      ctx.putImageData(imageData, 0, 0);
    } catch (err) {
      throw new PdfGrayscaleError(
        `Failed pixel grayscale conversion on page ${pageNum}.`,
        "PROCESSING_FAILED",
        err
      );
    }

    checkSignal();

    // Export Canvas to JPEG Byte Buffer
    let imgBytes;
    try {
      imgBytes = await canvasToJpegBytes(canvas, quality);
    } catch (err) {
      throw new PdfGrayscaleError(
        `Failed image export for page ${pageNum}.`,
        "PROCESSING_FAILED",
        err
      );
    }

    // Embed Grayscale JPEG into PDF
    let embeddedImage;
    try {
      embeddedImage = await outPdfDoc.embedJpg(imgBytes);
    } catch (err) {
      throw new PdfGrayscaleError(
        `Failed embedding grayscale image into page ${pageNum}.`,
        "PROCESSING_FAILED",
        err
      );
    }

    // Add matching page to output PDF and render image over entire page area
    const newPage = outPdfDoc.addPage([pdfWidth, pdfHeight]);
    newPage.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: pdfWidth,
      height: pdfHeight
    });

    // Explicit canvas resource cleanup
    canvas.width = 0;
    canvas.height = 0;
    ctx = null;
  }

  checkSignal();
  reportProgress("assembling", totalPages, totalPages, 98);

  let outPdfBytes;
  try {
    outPdfBytes = await outPdfDoc.save();
  } catch (err) {
    throw new PdfGrayscaleError(
      "Failed to save final grayscale PDF document.",
      "PROCESSING_FAILED",
      err
    );
  }

  reportProgress("complete", totalPages, totalPages, 100);

  const safeName = getSafeGrayscaleFilename(filename);

  return {
    success: true,
    pdfBytes: outPdfBytes,
    blob: typeof Blob !== "undefined" ? new Blob([outPdfBytes], { type: "application/pdf" }) : null,
    filename: safeName,
    pageCount: totalPages,
    originalSize: pdfBytes.length,
    outputSize: outPdfBytes.length,
    processingTime: Date.now() - startTime,
    dpi: Math.round(dpi),
    mode: "standard"
  };
}

export default {
  readPdfGrayscaleInfo,
  convertPdfToGrayscale,
  getSafeGrayscaleFilename,
  normalizeToUint8Array,
  PdfGrayscaleError
};
