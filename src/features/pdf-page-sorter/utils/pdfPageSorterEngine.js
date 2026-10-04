import { PDFDocument, degrees } from "pdf-lib";

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
 * Parses basic metadata from an uploaded PDF file.
 * Uses an independent Uint8Array slice for PDF.js to preserve raw File handle.
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
 * Returns initial pages with stable IDs: { id, originalPageNumber, originalIndex, rotation: 0, thumbnailUrl }
 */
export const renderPageThumbnailsBatch = async (file, scale = 0.3, onProgress = null) => {
  const pdfjs = await getPdfJsEngine();
  const rawFile = file.rawFile || file;
  const rawArrayBuffer = await rawFile.arrayBuffer();
  const pdfJsBytes = new Uint8Array(rawArrayBuffer.slice(0));

  const pdfDoc = await pdfjs.getDocument({ data: pdfJsBytes }).promise;
  const totalPages = pdfDoc.numPages;
  const pageItems = [];

  for (let p = 1; p <= totalPages; p++) {
    const thumbUrl = await renderSinglePageThumbnail(pdfDoc, p, scale);
    pageItems.push({
      id: `page-item-${p}-${Math.random().toString(36).substring(2, 7)}`,
      originalPageNumber: p,
      originalIndex: p - 1,
      rotation: 0,
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

  return pageItems;
};

/**
 * Sanitize output filename (e.g. document-sorted.pdf)
 */
export const sanitizeSortedFilename = (originalName) => {
  if (!originalName) return "document-sorted.pdf";
  const lastDot = originalName.lastIndexOf(".");
  if (lastDot === -1) return `${originalName}-sorted.pdf`;
  const name = originalName.substring(0, lastDot);
  return `${name}-sorted.pdf`;
};

/**
 * Executes PDF page reordering structurally using pdf-lib copyPages.
 * Preserves text, fonts, vector shapes, annotations, and original document quality.
 * Accepts pageItems array in custom user order: [{ originalIndex, rotation }, ...]
 */
export const executePdfPageSorter = async ({ file, pageItems = [], onProgress = null }) => {
  if (onProgress) onProgress("Reading PDF document structure...");

  const rawFile = file.rawFile || (file instanceof File || file instanceof Blob ? file : null);

  let rawArrayBuffer;
  if (rawFile && typeof rawFile.arrayBuffer === "function") {
    rawArrayBuffer = await rawFile.arrayBuffer();
  } else if (file.arrayBuffer && typeof file.arrayBuffer === "function") {
    rawArrayBuffer = await file.arrayBuffer();
  } else if (file.arrayBuffer && file.arrayBuffer instanceof ArrayBuffer && file.arrayBuffer.byteLength > 0) {
    rawArrayBuffer = file.arrayBuffer;
  } else {
    throw new Error("Unable to read valid PDF bytes for page sorting.");
  }

  // Guarantee an independent byte copy dedicated exclusively to pdf-lib
  const pdfLibBytes = new Uint8Array(rawArrayBuffer.slice(0));

  const srcDoc = await PDFDocument.load(pdfLibBytes, { ignoreEncryption: false });
  const totalPages = srcDoc.getPageCount();

  if (!pageItems || pageItems.length === 0) {
    throw new Error("No pages available to sort.");
  }

  if (onProgress) onProgress("Applying custom page order sequence...");

  const newDoc = await PDFDocument.create();

  // Array of original page indices to copy in requested custom sequence
  const indicesToCopy = pageItems.map(item => item.originalIndex);
  const copiedPages = await newDoc.copyPages(srcDoc, indicesToCopy);

  // Add copied pages in user's reordered sequence with rotation if specified
  copiedPages.forEach((copiedPage, i) => {
    const itemConfig = pageItems[i];
    if (itemConfig && itemConfig.rotation && itemConfig.rotation !== 0) {
      const currentRotation = copiedPage.getRotation().angle || 0;
      copiedPage.setRotation(degrees((currentRotation + itemConfig.rotation) % 360));
    }
    newDoc.addPage(copiedPage);
  });

  if (onProgress) onProgress("Compiling reordered PDF document...");

  const pdfBytes = await newDoc.save();

  if (onProgress) onProgress("Finalizing document...");

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const downloadUrl = URL.createObjectURL(blob);
  const filename = sanitizeSortedFilename(file.name);

  return {
    filename,
    outputFilename: filename,
    downloadUrl,
    blob,
    originalPageCount: totalPages,
    sortedPageCount: pageItems.length,
    originalName: file.name
  };
};
