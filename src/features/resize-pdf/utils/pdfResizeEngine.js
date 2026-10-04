import { PDFDocument } from "pdf-lib";

/**
 * Authoritative Standard Paper Size Presets (Dimensions in PDF Points).
 * 1 inch = 72 pt, 25.4 mm = 1 inch.
 */
export const PAPER_PRESETS = {
  A4: {
    name: "A4",
    widthPt: 595.28,
    heightPt: 841.89,
    description: "210 × 297 mm (Standard ISO)"
  },
  LETTER: {
    name: "Letter",
    widthPt: 612.0,
    heightPt: 792.0,
    description: "8.5 × 11 in (US Standard)"
  },
  LEGAL: {
    name: "Legal",
    widthPt: 612.0,
    heightPt: 1008.0,
    description: "8.5 × 14 in (US Legal)"
  },
  A3: {
    name: "A3",
    widthPt: 841.89,
    heightPt: 1190.55,
    description: "297 × 420 mm (Large Format ISO)"
  },
  A5: {
    name: "A5",
    widthPt: 419.53,
    heightPt: 595.28,
    description: "148 × 210 mm (Compact ISO)"
  },
  TABLOID: {
    name: "Tabloid / Ledger",
    widthPt: 792.0,
    heightPt: 1224.0,
    description: "11 × 17 in (Large US Format)"
  },
  EXECUTIVE: {
    name: "Executive",
    widthPt: 522.0,
    heightPt: 756.0,
    description: "7.25 × 10.5 in"
  },
  B5_ISO: {
    name: "B5 ISO",
    widthPt: 498.9,
    heightPt: 708.66,
    description: "176 × 250 mm"
  }
};

/**
 * Application safety limits for custom page dimensions in PDF Points.
 */
export const DIMENSION_LIMITS = {
  MIN_PT: 72.0, // 1 in / 25.4 mm
  MAX_PT: 14400.0 // 200 in / 5080 mm
};

/**
 * Unit conversion helpers
 */
export const convertMmToPoints = (mm) => {
  return (mm * 72) / 25.4;
};

export const convertInchesToPoints = (inches) => {
  return inches * 72;
};

export const convertPointsToMm = (points) => {
  return (points * 25.4) / 72;
};

export const convertPointsToInches = (points) => {
  return points / 72;
};

/**
 * Retrieves standard preset dimensions according to orientation ('portrait' | 'landscape').
 */
export const getPaperPresetDimensions = (presetKey, orientation = "portrait") => {
  const key = String(presetKey || "").toUpperCase().replace(/[^A-Z0-9_]/g, "");
  const preset = PAPER_PRESETS[key] || PAPER_PRESETS.A4;

  const widthPt = Math.min(preset.widthPt, preset.heightPt);
  const heightPt = Math.max(preset.widthPt, preset.heightPt);

  if (orientation.toLowerCase() === "landscape") {
    return {
      name: preset.name,
      widthPt: heightPt,
      heightPt: widthPt,
      orientation: "landscape"
    };
  }

  return {
    name: preset.name,
    widthPt,
    heightPt,
    orientation: "portrait"
  };
};

/**
 * Validates custom dimensions against application safety bounds.
 */
export const validateCustomDimensions = (widthPt, heightPt) => {
  const w = parseFloat(widthPt);
  const h = parseFloat(heightPt);

  if (isNaN(w) || isNaN(h) || !isFinite(w) || !isFinite(h)) {
    return {
      isValid: false,
      error: "Width and height must be valid numeric values."
    };
  }

  if (w <= 0 || h <= 0) {
    return {
      isValid: false,
      error: "Dimensions must be strictly greater than zero."
    };
  }

  if (w < DIMENSION_LIMITS.MIN_PT || h < DIMENSION_LIMITS.MIN_PT) {
    const minMm = Math.round(convertPointsToMm(DIMENSION_LIMITS.MIN_PT));
    return {
      isValid: false,
      error: `Page dimensions cannot be smaller than ${DIMENSION_LIMITS.MIN_PT} pt (${minMm} mm).`
    };
  }

  if (w > DIMENSION_LIMITS.MAX_PT || h > DIMENSION_LIMITS.MAX_PT) {
    const maxMm = Math.round(convertPointsToMm(DIMENSION_LIMITS.MAX_PT));
    return {
      isValid: false,
      error: `Page dimensions cannot exceed ${DIMENSION_LIMITS.MAX_PT} pt (${maxMm} mm).`
    };
  }

  return {
    isValid: true,
    widthPt: w,
    heightPt: h
  };
};

/**
 * Parses user custom page range string (e.g. "1-3, 5, 8-10" or "all").
 * Rejects invalid/out-of-bounds entries, deduplicates indices, and returns ascending page numbers.
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
 * Inspects uploaded PDF document metadata using pdf-lib.
 */
export const inspectPdf = async (fileOrBuffer) => {
  const buffer = fileOrBuffer instanceof ArrayBuffer
    ? fileOrBuffer
    : fileOrBuffer instanceof Uint8Array
      ? fileOrBuffer.buffer
      : await fileOrBuffer.arrayBuffer();

  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();
  const pagesInfo = [];

  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.getPage(i);
    const widthPt = page.getWidth();
    const heightPt = page.getHeight();
    const rotation = page.getRotation().angle || 0;

    pagesInfo.push({
      pageNumber: i + 1,
      widthPt,
      heightPt,
      widthMm: parseFloat(convertPointsToMm(widthPt).toFixed(2)),
      heightMm: parseFloat(convertPointsToMm(heightPt).toFixed(2)),
      rotation
    });
  }

  return {
    pageCount: totalPages,
    pages: pagesInfo,
    firstPageSize: pagesInfo[0] || null
  };
};

/**
 * Calculates scaling factors and offset translations for content resizing modes.
 */
export const calculateResizeTransform = (sourceWidth, sourceHeight, targetWidth, targetHeight, mode = "FIT_CONTENT") => {
  let scaleX = 1.0;
  let scaleY = 1.0;
  let offsetX = 0.0;
  let offsetY = 0.0;
  let isDistorted = false;

  if (mode === "FIT_CONTENT") {
    const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
    scaleX = scale;
    scaleY = scale;
    const scaledWidth = sourceWidth * scale;
    const scaledHeight = sourceHeight * scale;
    offsetX = (targetWidth - scaledWidth) / 2;
    offsetY = (targetHeight - scaledHeight) / 2;
  } else if (mode === "KEEP_CONTENT_SIZE") {
    scaleX = 1.0;
    scaleY = 1.0;
    offsetX = (targetWidth - sourceWidth) / 2;
    offsetY = (targetHeight - sourceHeight) / 2;
  } else if (mode === "STRETCH_CONTENT") {
    scaleX = targetWidth / sourceWidth;
    scaleY = targetHeight / sourceHeight;
    offsetX = 0.0;
    offsetY = 0.0;
    if (Math.abs(scaleX - scaleY) > 0.01) {
      isDistorted = true;
    }
  }

  return {
    scaleX,
    scaleY,
    offsetX,
    offsetY,
    isDistorted
  };
};

/**
 * Sanitizes base filename for generated output PDFs.
 */
export const sanitizeResizedFilename = (originalName) => {
  if (!originalName) return "document-resized.pdf";
  const lastDot = originalName.lastIndexOf(".");
  const baseName = lastDot === -1 ? originalName : originalName.substring(0, lastDot);
  const cleanBase = baseName.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase() || "document";
  return `${cleanBase}-resized.pdf`;
};

/**
 * Resizes selected PDF pages to target dimensions using pdf-lib vector operators.
 * Preserves selectable text, vector graphics, and image resolution without rasterization.
 */
export const resizePdf = async ({
  fileOrBuffer,
  targetWidthPt,
  targetHeightPt,
  mode = "FIT_CONTENT",
  pageRange = "all",
  onProgress = null
}) => {
  const validation = validateCustomDimensions(targetWidthPt, targetHeightPt);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const buffer = fileOrBuffer instanceof ArrayBuffer
    ? fileOrBuffer
    : fileOrBuffer instanceof Uint8Array
      ? fileOrBuffer.buffer
      : await fileOrBuffer.arrayBuffer();

  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();
  const pagesToResize = parsePageSelectionRange(pageRange, totalPages);

  if (pagesToResize.length === 0) {
    throw new Error("No valid pages selected for resizing.");
  }

  const targetPagesSet = new Set(pagesToResize);

  for (let i = 0; i < totalPages; i++) {
    const pageNum = i + 1;

    if (onProgress) {
      onProgress({ current: pageNum, total: totalPages, stage: `Resizing page ${pageNum} of ${totalPages}...` });
    }

    if (targetPagesSet.has(pageNum)) {
      const page = pdfDoc.getPage(i);
      const sourceWidth = page.getWidth();
      const sourceHeight = page.getHeight();

      const { scaleX, scaleY, offsetX, offsetY } = calculateResizeTransform(
        sourceWidth,
        sourceHeight,
        targetWidthPt,
        targetHeightPt,
        mode
      );

      // Perform transformation in pdf-lib graphics stream:
      // Translate first, then scale
      if (scaleX !== 1.0 || scaleY !== 1.0) {
        page.scaleContent(scaleX, scaleY);
      }

      if (offsetX !== 0 || offsetY !== 0) {
        page.translateContent(offsetX, offsetY);
      }

      // Update MediaBox to exact target dimensions
      page.setSize(targetWidthPt, targetHeightPt);
    }

    // Yield main thread every 10 pages
    if (pageNum % 10 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  const resizedPdfBytes = await pdfDoc.save();

  return {
    pdfBytes: resizedPdfBytes,
    totalPages,
    resizedPageCount: pagesToResize.length,
    targetWidthPt,
    targetHeightPt
  };
};
