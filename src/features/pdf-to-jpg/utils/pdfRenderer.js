/**
 * PDF rendering engine using pdfjs-dist.
 * Process conversions locally inside the browser.
 */

// Helper to load pdfjs-dist asynchronously to avoid SSR/bundling issues
export const getPdfJsEngine = async () => {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  return pdfjs;
};

/**
 * Calculates correct scale factor based on target DPI.
 * Standard PDF points base: 72 DPI.
 * 72 DPI = 1.0x
 * 150 DPI = 150 / 72 ≈ 2.083x
 * 300 DPI = 300 / 72 ≈ 4.167x
 */
export const calculateDpiScale = (dpiSetting) => {
  const dpi = parseInt(dpiSetting, 10) || 150;
  return dpi / 72;
};

/**
 * Loads a PDF file and returns the pdf document reference and page count
 */
export const loadPdfDocument = async (file) => {
  const pdfjs = await getPdfJsEngine();
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  return pdfDoc;
};

/**
 * Renders a low-res thumbnail of a page for preview lists
 */
export const renderPageThumbnail = async (pdfDoc, pageNumber, scale = 0.35) => {
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
  const width = viewport.width;
  const height = viewport.height;
  
  // Cleanup references
  canvas.width = 0;
  canvas.height = 0;
  
  return { url, width, height, pageNumber };
};

/**
 * Converts a specific PDF page to a high-quality JPG blob with selected DPI & Quality settings
 */
export const renderPageToJpg = async (pdfDoc, pageNumber, settings) => {
  const { dpi = 150, quality = "high" } = settings;
  
  // Quality options mapper
  const qualityMap = {
    standard: 0.80,
    high: 0.90,
    maximum: 0.98
  };
  const qualityValue = qualityMap[quality] ?? 0.90;
  
  const page = await pdfDoc.getPage(pageNumber);
  let scale = calculateDpiScale(dpi);
  
  // Check natural size at 1x
  const testViewport = page.getViewport({ scale: 1.0 });
  const rawWidth = testViewport.width;
  const rawHeight = testViewport.height;
  
  // Calculate raw pixels with scaling factor
  let targetWidth = rawWidth * scale;
  let targetHeight = rawHeight * scale;
  let isCapped = false;
  
  // Safety check: Cap dimensions if they exceed browser limits (approx. 12 Megapixels)
  const maxArea = 12000000;
  if (targetWidth * targetHeight > maxArea) {
    // Recalculate safe scaling factor
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
  
  // Fill background white
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  await page.render({
    canvasContext: ctx,
    viewport: viewport
  }).promise;
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      // Release memory variables
      const width = Math.round(viewport.width);
      const height = Math.round(viewport.height);
      
      canvas.width = 0;
      canvas.height = 0;
      
      resolve({
        blob,
        width,
        height,
        pageNumber,
        isCapped,
        dpi: Math.round(dpi * (isCapped ? (scale / calculateDpiScale(dpi)) : 1))
      });
    }, "image/jpeg", qualityValue);
  });
};
