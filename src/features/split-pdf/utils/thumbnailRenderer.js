/**
 * Gets or initializes pdfjs-dist worker engine.
 */
export const getPdfJsEngine = async () => {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  return pdfjs;
};

/**
 * Parses basic metadata from an uploaded PDF file: page count, size, and 1st page thumbnail preview.
 */
export const parsePdfMetadata = async (file) => {
  const pdfjs = await getPdfJsEngine();
  const arrayBuffer = await file.arrayBuffer();
  
  const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
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
    rawFile: file,
    arrayBuffer
  };
};

/**
 * Renders a single page low-resolution canvas thumbnail and returns data URL.
 * Immediately zeros out canvas dimensions to release browser memory.
 */
export const renderSinglePageThumbnail = async (pdfDoc, pageNum, scale = 0.25) => {
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

    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);

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
 * Batch renders page thumbnails for Visual Page Selection mode.
 * Supports rendering a slice of pages (e.g. 1 to 24) to avoid blocking the thread.
 */
export const renderPageThumbnailsBatch = async (file, pageRange = null, scale = 0.25, onProgress = null) => {
  const pdfjs = await getPdfJsEngine();
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  const totalPages = pdfDoc.numPages;
  const startPage = pageRange ? pageRange.start : 1;
  const endPage = pageRange ? Math.min(pageRange.end, totalPages) : totalPages;

  const thumbnails = [];

  for (let p = startPage; p <= endPage; p++) {
    const thumbUrl = await renderSinglePageThumbnail(pdfDoc, p, scale);
    thumbnails.push({
      pageNumber: p,
      pageIndex: p - 1,
      thumbnailUrl: thumbUrl
    });

    if (onProgress) {
      onProgress({
        current: p - startPage + 1,
        total: endPage - startPage + 1,
        pageNumber: p
      });
    }

    // Yield main thread every 5 pages to prevent UI freezing
    if (p % 5 === 0) {
      await new Promise(r => setTimeout(r, 0));
    }
  }

  return thumbnails;
};
