import { PDFDocument } from "pdf-lib";

/**
 * Gets or initializes pdfjs-dist worker engine.
 */
export const getPdfJsEngine = async () => {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  return pdfjs;
};

/**
 * Renders a single page low-resolution canvas thumbnail and returns data URL.
 * Immediately zeros out canvas dimensions to release browser memory.
 */
export const renderSinglePageThumbnail = async (pdfDoc, pageNum, scale = 0.3) => {
  try {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport
    }).promise;

    const dataUrl = canvas.toDataURL("image/jpeg", 0.75);

    // Free canvas memory buffer
    canvas.width = 0;
    canvas.height = 0;

    return dataUrl;
  } catch (err) {
    console.error(`Failed to render thumbnail for page ${pageNum}:`, err);
    return null;
  }
};

/**
 * Parses basic metadata from an uploaded PDF file: page count, size, and thumbnails.
 * Uses an independent Uint8Array slice for PDF.js to preserve the underlying File handle.
 */
export const parsePdfMetadata = async (file) => {
  const pdfjs = await getPdfJsEngine();
  const rawArrayBuffer = await file.arrayBuffer();
  const pdfJsBytes = new Uint8Array(rawArrayBuffer.slice(0));

  const pdfDoc = await pdfjs.getDocument({ data: pdfJsBytes }).promise;
  const pageCount = pdfDoc.numPages;

  let firstPageThumbnail = null;
  if (pageCount > 0) {
    firstPageThumbnail = await renderSinglePageThumbnail(pdfDoc, 1, 0.3);
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: file.name,
    size: file.size,
    pageCount,
    firstPageThumbnail,
    rawFile: file
  };
};

/**
 * Batch renders page thumbnails for visual workspace.
 * Uses an independent byte copy to guarantee thread-safety and prevent ArrayBuffer detachment.
 */
export const renderPageThumbnailsBatch = async (file, scale = 0.3, onProgress = null) => {
  const pdfjs = await getPdfJsEngine();
  const rawFile = file.rawFile || file;
  const rawArrayBuffer = await rawFile.arrayBuffer();
  const pdfJsBytes = new Uint8Array(rawArrayBuffer.slice(0));

  const pdfDoc = await pdfjs.getDocument({ data: pdfJsBytes }).promise;
  const totalPages = pdfDoc.numPages;
  const thumbnails = [];

  for (let p = 1; p <= totalPages; p++) {
    const thumbUrl = await renderSinglePageThumbnail(pdfDoc, p, scale);
    thumbnails.push({
      pageNumber: p,
      pageIndex: p - 1,
      index: p - 1,
      dataUrl: thumbUrl,
      thumbnailUrl: thumbUrl
    });

    if (onProgress) {
      onProgress({
        current: p,
        total: totalPages
      });
    }

    // Yield main thread every 5 pages to prevent UI freezing
    if (p % 5 === 0) {
      await new Promise(r => setTimeout(r, 0));
    }
  }

  return thumbnails;
};

/**
 * Sanitize output filename (e.g. document-pages-deleted.pdf)
 */
export const sanitizeDeletedFilename = (originalName) => {
  if (!originalName) return "document-pages-deleted.pdf";
  const lastDot = originalName.lastIndexOf(".");
  if (lastDot === -1) return `${originalName}-pages-deleted.pdf`;
  const name = originalName.substring(0, lastDot);
  return `${name}-pages-deleted.pdf`;
};

/**
 * Executes PDF page deletion natively using pdf-lib copyPages.
 * Uses a fresh, independent Uint8Array copy from the underlying raw File handle
 * to guarantee that PDFDocument.load() never receives a detached ArrayBuffer.
 */
export const executePdfDeletePages = async ({ file, deletedIndices = [], onProgress = null }) => {
  if (onProgress) onProgress("Reading PDF file structure...");

  const rawFile = file.rawFile || (file instanceof File || file instanceof Blob ? file : null);

  let rawArrayBuffer;
  if (rawFile && typeof rawFile.arrayBuffer === "function") {
    rawArrayBuffer = await rawFile.arrayBuffer();
  } else if (file.arrayBuffer && typeof file.arrayBuffer === "function") {
    rawArrayBuffer = await file.arrayBuffer();
  } else if (file.arrayBuffer && file.arrayBuffer instanceof ArrayBuffer && file.arrayBuffer.byteLength > 0) {
    rawArrayBuffer = file.arrayBuffer;
  } else {
    throw new Error("Unable to read valid PDF bytes for page removal.");
  }

  // Guarantee an independent byte copy dedicated exclusively to pdf-lib
  const pdfLibBytes = new Uint8Array(rawArrayBuffer.slice(0));

  const srcDoc = await PDFDocument.load(pdfLibBytes, { ignoreEncryption: false });
  const totalPages = srcDoc.getPageCount();

  // Validate keeping at least 1 page
  const keepIndices = [];
  for (let i = 0; i < totalPages; i++) {
    if (!deletedIndices.includes(i)) {
      keepIndices.push(i);
    }
  }

  if (keepIndices.length === 0) {
    throw new Error("You must keep at least one page in the PDF.");
  }

  if (onProgress) onProgress("Removing selected pages...");

  // Create clean new PDF and copy remaining pages in original order
  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, keepIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  if (onProgress) onProgress("Building new PDF document...");

  const pdfBytes = await newDoc.save();

  if (onProgress) onProgress("Finalizing document...");

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const downloadUrl = URL.createObjectURL(blob);
  const filename = sanitizeDeletedFilename(file.name);

  return {
    filename,
    outputFilename: filename,
    downloadUrl,
    blob,
    originalPageCount: totalPages,
    deletedPageCount: deletedIndices.length,
    remainingPageCount: keepIndices.length,
    originalName: file.name
  };
};

export const executePdfDelete = executePdfDeletePages;
