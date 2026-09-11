import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

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

    if (p % 5 === 0) {
      await new Promise(r => setTimeout(r, 0));
    }
  }

  return thumbnails;
};

/**
 * Page range parser & validation.
 * Converts user string (e.g. "1, 3, 5-10") into valid 0-based indices.
 * Detects and reports out-of-range page numbers.
 */
export const parsePageRange = (rangeStr, totalPages) => {
  if (!rangeStr || rangeStr.trim().toLowerCase() === "all") {
    return {
      validIndices: Array.from({ length: totalPages }, (_, i) => i),
      invalidPages: [],
      warningMessage: null,
      errorMessage: null
    };
  }

  const parts = rangeStr.split(",").map(s => s.trim()).filter(Boolean);
  const selectedIndicesSet = new Set();
  const invalidPagesSet = new Set();

  parts.forEach((part) => {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map(s => parseInt(s.trim(), 10));
      if (!isNaN(startStr) && !isNaN(endStr)) {
        const start = Math.min(startStr, endStr);
        const end = Math.max(startStr, endStr);
        for (let p = start; p <= end; p++) {
          if (p >= 1 && p <= totalPages) {
            selectedIndicesSet.add(p - 1);
          } else {
            invalidPagesSet.add(p);
          }
        }
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p)) {
        if (p >= 1 && p <= totalPages) {
          selectedIndicesSet.add(p - 1);
        } else {
          invalidPagesSet.add(p);
        }
      }
    }
  });

  const validIndices = Array.from(selectedIndicesSet).sort((a, b) => a - b);
  const invalidPages = Array.from(invalidPagesSet).sort((a, b) => a - b);

  let warningMessage = null;
  let errorMessage = null;

  if (invalidPages.length > 0) {
    warningMessage = `Page ${invalidPages.join(", ")} ${invalidPages.length === 1 ? "is" : "are"} out of bounds (document has ${totalPages} ${totalPages === 1 ? "page" : "pages"}).`;
  }

  if (validIndices.length === 0) {
    errorMessage = `No valid pages selected. Please enter page numbers between 1 and ${totalPages}.`;
  }

  return {
    validIndices,
    invalidPages,
    warningMessage,
    errorMessage
  };
};

/**
 * Converts Hex color string (#RRGGBB) to pdf-lib rgb() object.
 */
export const hexToPdfColor = (hexStr = "#000000") => {
  let hex = hexStr.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }
  const r = parseInt(hex.substring(0, 2) || "00", 16) / 255;
  const g = parseInt(hex.substring(2, 4) || "00", 16) / 255;
  const b = parseInt(hex.substring(4, 6) || "00", 16) / 255;
  return rgb(r, g, b);
};

/**
 * Converts browser Image File/Blob (PNG, JPG, WebP) into PNG ArrayBuffer for pdf-lib embedding.
 * Preserves image transparency and converts WebP safely.
 */
export const convertImageToPngBuffer = async (imageFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Failed to convert image format."));
            return;
          }
          blob.arrayBuffer().then(resolve).catch(reject);
        }, "image/png");
      };
      img.onerror = () => reject(new Error("Failed to load image file."));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(imageFile);
  });
};

/**
 * Sanitize output filename (e.g. document-watermarked.pdf)
 */
export const sanitizeWatermarkedFilename = (originalName) => {
  if (!originalName) return "document-watermarked.pdf";
  const lastDot = originalName.lastIndexOf(".");
  if (lastDot === -1) return `${originalName}-watermarked.pdf`;
  const name = originalName.substring(0, lastDot);
  return `${name}-watermarked.pdf`;
};

/**
 * Calculates (x, y) coordinates for watermarks accounting for element width/height, margins, and page dimensions.
 */
export const calculateWatermarkPositions = ({ position, pageWidth, pageHeight, elemWidth, elemHeight }) => {
  const margin = 20;

  let x = (pageWidth - elemWidth) / 2;
  let y = (pageHeight - elemHeight) / 2;

  switch (position) {
    case "top-left":
      x = Math.max(margin, margin);
      y = Math.max(margin, pageHeight - elemHeight - margin);
      break;
    case "top-right":
      x = Math.max(margin, pageWidth - elemWidth - margin);
      y = Math.max(margin, pageHeight - elemHeight - margin);
      break;
    case "bottom-left":
      x = Math.max(margin, margin);
      y = Math.max(margin, margin);
      break;
    case "bottom-right":
      x = Math.max(margin, pageWidth - elemWidth - margin);
      y = Math.max(margin, margin);
      break;
    case "center":
    default:
      x = Math.max(margin, (pageWidth - elemWidth) / 2);
      y = Math.max(margin, (pageHeight - elemHeight) / 2);
      break;
  }

  if (position === "tiled") {
    // 3x3 Grid
    const positions = [];
    const xPoints = [pageWidth * 0.2, pageWidth * 0.5, pageWidth * 0.8];
    const yPoints = [pageHeight * 0.2, pageHeight * 0.5, pageHeight * 0.8];

    xPoints.forEach((px) => {
      yPoints.forEach((py) => {
        positions.push({
          x: Math.max(10, Math.min(pageWidth - elemWidth - 10, px - elemWidth / 2)),
          y: Math.max(10, Math.min(pageHeight - elemHeight - 10, py - elemHeight / 2))
        });
      });
    });
    return positions;
  }

  return [{ x, y }];
};

/**
 * Executes PDF Watermarking natively using pdf-lib.
 * Modifies pages structurally with zero rasterization.
 */
export const executePdfWatermark = async ({
  file,
  watermarkType = "text", // 'text' | 'image'
  textConfig = {},
  imageConfig = {},
  pageSelectionMode = "all", // 'all' | 'specific'
  specificPagesStr = "",
  onProgress = null
}) => {
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
    throw new Error("Unable to read valid PDF bytes for watermarking.");
  }

  // Independent byte copy dedicated to pdf-lib
  const pdfLibBytes = new Uint8Array(rawArrayBuffer.slice(0));

  const pdfDoc = await PDFDocument.load(pdfLibBytes, { ignoreEncryption: false });
  const totalPages = pdfDoc.getPageCount();

  // Validate Page Selection Range
  const rangeResult = parsePageRange(
    pageSelectionMode === "all" ? "all" : specificPagesStr,
    totalPages
  );

  if (rangeResult.errorMessage) {
    throw new Error(rangeResult.errorMessage);
  }

  const selectedIndices = rangeResult.validIndices;

  if (onProgress) onProgress("Preparing watermark components...");

  let embeddedFont = null;
  let embeddedImage = null;

  if (watermarkType === "text") {
    embeddedFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  } else if (watermarkType === "image" && imageConfig.imageFile) {
    const pngBuffer = await convertImageToPngBuffer(imageConfig.imageFile);
    embeddedImage = await pdfDoc.embedPng(pngBuffer);
  }

  if (onProgress) onProgress("Applying watermark overlay...");

  const pages = pdfDoc.getPages();

  selectedIndices.forEach((pageIndex) => {
    const page = pages[pageIndex];
    const { width: pageWidth, height: pageHeight } = page.getSize();

    if (watermarkType === "text") {
      const text = textConfig.text || "CONFIDENTIAL";
      const fontSize = textConfig.fontSize || 36;
      const opacity = typeof textConfig.opacity === "number" ? textConfig.opacity : 0.3;
      const rotationDeg = typeof textConfig.rotation === "number" ? textConfig.rotation : 45;
      const color = hexToPdfColor(textConfig.color || "#000000");

      const textWidth = embeddedFont.widthOfTextAtSize(text, fontSize);
      const textHeight = embeddedFont.heightAtSize(fontSize);

      const positions = calculateWatermarkPositions({
        position: textConfig.position || "center",
        pageWidth,
        pageHeight,
        elemWidth: textWidth,
        elemHeight: textHeight
      });

      positions.forEach((pos) => {
        page.drawText(text, {
          x: pos.x,
          y: pos.y,
          size: fontSize,
          font: embeddedFont,
          color,
          opacity,
          rotate: degrees(rotationDeg)
        });
      });

    } else if (watermarkType === "image" && embeddedImage) {
      const scale = typeof imageConfig.scale === "number" ? imageConfig.scale : 0.5;
      const opacity = typeof imageConfig.opacity === "number" ? imageConfig.opacity : 0.3;
      const rotationDeg = typeof imageConfig.rotation === "number" ? imageConfig.rotation : 0;

      const imgWidth = embeddedImage.width * scale;
      const imgHeight = embeddedImage.height * scale;

      const positions = calculateWatermarkPositions({
        position: imageConfig.position || "center",
        pageWidth,
        pageHeight,
        elemWidth: imgWidth,
        elemHeight: imgHeight
      });

      positions.forEach((pos) => {
        page.drawImage(embeddedImage, {
          x: pos.x,
          y: pos.y,
          width: imgWidth,
          height: imgHeight,
          opacity,
          rotate: degrees(rotationDeg)
        });
      });
    }
  });

  if (onProgress) onProgress("Building watermarked PDF document...");

  const pdfBytes = await pdfDoc.save();

  if (onProgress) onProgress("Finalizing document...");

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const downloadUrl = URL.createObjectURL(blob);
  const filename = sanitizeWatermarkedFilename(file.name);

  return {
    filename,
    outputFilename: filename,
    downloadUrl,
    blob,
    originalPageCount: totalPages,
    watermarkedPageCount: selectedIndices.length,
    warningMessage: rangeResult.warningMessage,
    originalName: file.name
  };
};
