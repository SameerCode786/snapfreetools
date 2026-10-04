import JSZip from "jszip";

/**
 * Gets or initializes pdfjs-dist worker engine dynamically.
 */
export const getPdfJsEngine = async () => {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  return pdfjs;
};

/**
 * Calculates correct scale factor based on target DPI.
 * Standard PDF points base: 72 DPI (1.0x).
 * 72 DPI = 1.0x
 * 150 DPI = 150 / 72 ≈ 2.083x
 * 300 DPI = 300 / 72 ≈ 4.167x
 */
export const calculateDpiScale = (dpiSetting) => {
  const dpi = parseInt(dpiSetting, 10) || 150;
  return dpi / 72;
};

/**
 * Renders a single low-resolution page thumbnail for visual preview lists.
 */
export const renderPageThumbnail = async (pdfDoc, pageNumber, scale = 0.35) => {
  try {
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Clean white canvas background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport: viewport
    }).promise;

    const url = canvas.toDataURL("image/jpeg", 0.7);
    const width = Math.round(viewport.width);
    const height = Math.round(viewport.height);

    // Free canvas memory
    canvas.width = 0;
    canvas.height = 0;

    return { url, width, height, pageNumber };
  } catch (err) {
    console.error(`Failed to render thumbnail for page ${pageNumber}:`, err);
    return null;
  }
};

/**
 * Parses basic metadata from an uploaded PDF file.
 */
export const parsePdfMetadata = async (file) => {
  const pdfjs = await getPdfJsEngine();
  const rawArrayBuffer = await file.arrayBuffer();
  const pdfJsBytes = new Uint8Array(rawArrayBuffer.slice(0));

  const pdfDoc = await pdfjs.getDocument({ data: pdfJsBytes }).promise;
  const pageCount = pdfDoc.numPages;

  let firstPageThumbnail = null;
  if (pageCount > 0) {
    firstPageThumbnail = await renderPageThumbnail(pdfDoc, 1, 0.35);
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
 * Batch renders low-res page thumbnails for workspace previews.
 */
export const renderAllThumbnailsBatch = async (file, scale = 0.35, onProgress = null) => {
  const pdfjs = await getPdfJsEngine();
  const rawFile = file.rawFile || file;
  const rawArrayBuffer = await rawFile.arrayBuffer();
  const pdfJsBytes = new Uint8Array(rawArrayBuffer.slice(0));

  const pdfDoc = await pdfjs.getDocument({ data: pdfJsBytes }).promise;
  const totalPages = pdfDoc.numPages;
  const thumbnails = [];

  for (let p = 1; p <= totalPages; p++) {
    const thumb = await renderPageThumbnail(pdfDoc, p, scale);
    if (thumb) {
      thumbnails.push(thumb);
    }
    if (onProgress) {
      onProgress({ current: p, total: totalPages });
    }

    // Yield main thread every 5 pages to prevent UI locking
    if (p % 5 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  return thumbnails;
};

/**
 * Converts a specific PDF page to a PNG Blob with selected DPI settings.
 * Includes a 12-Megapixel canvas area safety cap to prevent allocation crashes.
 */
export const renderPageToPng = async (pdfDoc, pageNumber, settings = {}) => {
  const { dpi = 150 } = settings;
  const page = await pdfDoc.getPage(pageNumber);
  let scale = calculateDpiScale(dpi);

  const testViewport = page.getViewport({ scale: 1.0 });
  const rawWidth = testViewport.width;
  const rawHeight = testViewport.height;

  let targetWidth = rawWidth * scale;
  let targetHeight = rawHeight * scale;
  let isCapped = false;

  // Cap dimensions if area exceeds 12 Megapixels (~3500x3500px)
  const maxArea = 12000000;
  if (targetWidth * targetHeight > maxArea) {
    const currentArea = targetWidth * targetHeight;
    const shrinkRatio = Math.sqrt(maxArea / currentArea);
    scale = scale * shrinkRatio;
    targetWidth = rawWidth * scale;
    targetHeight = rawHeight * scale;
    isCapped = true;
  }

  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  // Fill background white by default for clean PNG rendering
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvasContext: ctx,
    viewport: viewport
  }).promise;

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      const width = Math.round(viewport.width);
      const height = Math.round(viewport.height);

      // Free canvas memory buffer immediately
      canvas.width = 0;
      canvas.height = 0;

      if (!blob) {
        reject(new Error(`Failed to generate PNG blob for page ${pageNumber}`));
        return;
      }

      resolve({
        blob,
        width,
        height,
        pageNumber,
        isCapped,
        dpi: Math.round(dpi * (isCapped ? scale / calculateDpiScale(dpi) : 1))
      });
    }, "image/png");
  });
};

/**
 * Sanitizes base filename for generated PNG images.
 */
export const sanitizePngBaseFilename = (originalName) => {
  if (!originalName) return "document";
  const lastDot = originalName.lastIndexOf(".");
  const baseName = lastDot === -1 ? originalName : originalName.substring(0, lastDot);
  return baseName.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase() || "document";
};

/**
 * Parses user custom page selection range string (e.g., "1-3, 5, 7").
 */
export const parsePageSelectionRange = (rangeString, totalPages) => {
  if (!rangeString || rangeString.trim().toLowerCase() === "all") {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const selectedPages = new Set();
  const parts = rangeString.split(",").map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let p = start; p <= end; p++) {
          if (p >= 1 && p <= totalPages) {
            selectedPages.add(p);
          }
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        selectedPages.add(pageNum);
      }
    }
  }

  return Array.from(selectedPages).sort((a, b) => a - b);
};

/**
 * Converts selected PDF pages into individual PNG images and bundles them into a ZIP archive.
 */
export const convertPdfToPngBatch = async ({ file, settings = {}, onProgress = null }) => {
  const { dpi = 150, pageRange = "all" } = settings;
  const pdfjs = await getPdfJsEngine();

  const rawFile = file.rawFile || file;
  const rawArrayBuffer = await rawFile.arrayBuffer();
  const pdfJsBytes = new Uint8Array(rawArrayBuffer.slice(0));

  const pdfDoc = await pdfjs.getDocument({ data: pdfJsBytes }).promise;
  const totalPages = pdfDoc.numPages;
  const pagesToConvert = parsePageSelectionRange(pageRange, totalPages);

  if (pagesToConvert.length === 0) {
    throw new Error("No valid pages selected for conversion.");
  }

  const baseFilename = sanitizePngBaseFilename(file.name);
  const convertedImages = [];
  const zip = new JSZip();

  for (let i = 0; i < pagesToConvert.length; i++) {
    const pageNum = pagesToConvert[i];
    if (onProgress) {
      onProgress({
        current: i + 1,
        total: pagesToConvert.length,
        pageNum
      });
    }

    const renderResult = await renderPageToPng(pdfDoc, pageNum, { dpi });
    const formattedPageNum = String(pageNum).padStart(3, "0");
    const imageFilename = `${baseFilename}-page-${formattedPageNum}.png`;
    const objectUrl = URL.createObjectURL(renderResult.blob);

    convertedImages.push({
      ...renderResult,
      filename: imageFilename,
      objectUrl
    });

    // Add PNG arrayBuffer to JSZip archive
    const pngArrayBuffer = await renderResult.blob.arrayBuffer();
    zip.file(imageFilename, pngArrayBuffer);

    // Yield main thread every 3 pages
    if ((i + 1) % 3 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  if (onProgress) {
    onProgress({ current: pagesToConvert.length, total: pagesToConvert.length, stage: "Building ZIP archive..." });
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const zipFilename = `${baseFilename}-png-images.zip`;
  const zipDownloadUrl = URL.createObjectURL(zipBlob);

  return {
    baseFilename,
    zipFilename,
    zipDownloadUrl,
    zipBlob,
    images: convertedImages,
    convertedCount: convertedImages.length,
    totalPages
  };
};
