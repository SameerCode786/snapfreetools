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
 * Parses basic metadata from an uploaded PDF file: page count, size, and thumbnails.
 * Creates an independent byte copy for PDF.js so the original File/ArrayBuffer is never detached.
 */
export const parsePdfMetadata = async (file) => {
  const pdfjs = await getPdfJsEngine();
  const rawArrayBuffer = await file.arrayBuffer();
  // Safe independent Uint8Array slice for PDF.js worker
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
 * Sanitize output filename (e.g. document-rotated.pdf)
 */
export const sanitizeRotatedFilename = (originalName) => {
  if (!originalName) return "document-rotated.pdf";
  const lastDot = originalName.lastIndexOf(".");
  if (lastDot === -1) return `${originalName}-rotated.pdf`;
  const name = originalName.substring(0, lastDot);
  return `${name}-rotated.pdf`;
};

/**
 * Executes PDF page rotation natively using pdf-lib without rasterizing the PDF.
 * Uses a fresh, independent Uint8Array copy from the underlying raw File handle
 * to guarantee that PDFDocument.load() never receives a detached ArrayBuffer.
 */
export const executePdfRotate = async ({ file, pageRotations = {}, onProgress = null }) => {
  if (onProgress) onProgress({ percent: 15, message: "Reading PDF file structure..." });

  const rawFile = file.rawFile || (file instanceof File || file instanceof Blob ? file : null);

  let rawArrayBuffer;
  if (rawFile && typeof rawFile.arrayBuffer === "function") {
    rawArrayBuffer = await rawFile.arrayBuffer();
  } else if (file.arrayBuffer && typeof file.arrayBuffer === "function") {
    rawArrayBuffer = await file.arrayBuffer();
  } else if (file.arrayBuffer && file.arrayBuffer instanceof ArrayBuffer && file.arrayBuffer.byteLength > 0) {
    rawArrayBuffer = file.arrayBuffer;
  } else {
    throw new Error("Unable to read valid PDF bytes for rotation.");
  }

  if (onProgress) onProgress({ percent: 35, message: "Applying page rotations..." });

  // Guarantee an independent byte copy dedicated exclusively to pdf-lib
  const pdfLibBytes = new Uint8Array(rawArrayBuffer.slice(0));

  const pdfDoc = await PDFDocument.load(pdfLibBytes, { ignoreEncryption: false });
  const pages = pdfDoc.getPages();

  let rotatedPageCount = 0;

  pages.forEach((page, index) => {
    const addAngle = pageRotations[index] || 0; // 0, 90, 180, 270
    if (addAngle !== 0) {
      rotatedPageCount++;
      const currentRotation = page.getRotation();
      const currentAngle = typeof currentRotation === "number"
        ? currentRotation
        : (currentRotation?.angle || 0);

      const targetAngle = (currentAngle + addAngle) % 360;
      page.setRotation(degrees(targetAngle));
    }
  });

  if (onProgress) onProgress({ percent: 70, message: "Saving rotated PDF structure..." });

  const pdfBytes = await pdfDoc.save();

  if (onProgress) onProgress({ percent: 95, message: "Finalizing document..." });

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const downloadUrl = URL.createObjectURL(blob);
  const outputFilename = sanitizeRotatedFilename(file.name);

  return {
    outputFilename,
    downloadUrl,
    blobSize: blob.size,
    totalPages: pages.length,
    rotatedPageCount,
    originalName: file.name
  };
};
