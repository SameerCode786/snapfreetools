import { PDFDocument } from "pdf-lib";

/**
 * Authoritative Standard Paper Presets for PNG to PDF (Dimensions in PDF Points).
 * 1 inch = 72 pt, 25.4 mm = 1 inch.
 */
export const PNG_PDF_PAPER_PRESETS = {
  A4: {
    name: "A4",
    widthPt: 595.28,
    heightPt: 841.89
  },
  LETTER: {
    name: "Letter",
    widthPt: 612.0,
    heightPt: 792.0
  },
  LEGAL: {
    name: "Legal",
    widthPt: 612.0,
    heightPt: 1008.0
  },
  A3: {
    name: "A3",
    widthPt: 841.89,
    heightPt: 1190.55
  }
};

/**
 * Application safety limits for PNG to PDF conversion.
 */
export const PNG_SAFETY_LIMITS = {
  MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024, // 50 MB
  MAX_BATCH_IMAGE_COUNT: 100,
  MAX_CANVAS_PIXELS: 12000000 // 12 Megapixels
};

/**
 * Margin presets in PDF Points (1 inch = 72 pt = 25.4 mm).
 */
export const MARGIN_PRESETS = {
  none: 0,
  small: (10 * 72) / 25.4, // ~28.35 pt (10 mm)
  large: (20 * 72) / 25.4 // ~56.69 pt (20 mm)
};

/**
 * Converts millimeters to PDF points.
 */
export const convertMmToPoints = (mm) => (mm * 72) / 25.4;

/**
 * Converts inches to PDF points.
 */
export const convertInchesToPoints = (inches) => inches * 72;

/**
 * 96 DPI policy calculation: converts pixel dimensions to physical PDF points.
 * points = pixels * (72 / 96) = pixels * 0.75
 */
export const convertPixelsToPoints96Dpi = (pixels) => pixels * 0.75;

/**
 * Validates PNG file header signature (magic bytes: 0x89 50 4E 47 0D 0A 1A 0A).
 */
export const isValidPngSignature = (uint8Array) => {
  if (!uint8Array || uint8Array.length < 8) return false;
  return (
    uint8Array[0] === 0x89 &&
    uint8Array[1] === 0x50 && // P
    uint8Array[2] === 0x4e && // N
    uint8Array[3] === 0x47 && // G
    uint8Array[4] === 0x0d && // \r
    uint8Array[5] === 0x0a && // \n
    uint8Array[6] === 0x1a && // Ctrl-Z
    uint8Array[7] === 0x0a    // \n
  );
};

/**
 * Parses IHDR chunk from raw PNG bytes to extract width and height without full decoding.
 */
export const parsePngHeaderDimensions = (uint8Array) => {
  if (!isValidPngSignature(uint8Array)) {
    return null;
  }
  // IHDR chunk starts at byte 16 (after 8-byte signature + 4-byte length + 4-byte chunk type)
  if (uint8Array.length < 24) return null;
  const view = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
  const width = view.getUint32(16, false);
  const height = view.getUint32(20, false);
  return { width, height };
};

/**
 * Validates individual PNG file against safety bounds.
 */
export const validatePngFile = (fileOrBytes, filename = "image.png") => {
  const size = fileOrBytes.size !== undefined ? fileOrBytes.size : fileOrBytes.byteLength || 0;

  if (size === 0) {
    return { isValid: false, error: `File "${filename}" is empty (0 bytes).` };
  }

  if (size > PNG_SAFETY_LIMITS.MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File "${filename}" exceeds the maximum 50 MB limit (${(size / (1024 * 1024)).toFixed(1)} MB).`
    };
  }

  return { isValid: true };
};

/**
 * Sanitizes base filename for generated output PDF.
 */
export const sanitizePngToPdfFilename = (firstFilename, imageCount = 1) => {
  if (!firstFilename || imageCount > 1) {
    return "converted-png-documents.pdf";
  }
  const lastDot = firstFilename.lastIndexOf(".");
  const baseName = lastDot === -1 ? firstFilename : firstFilename.substring(0, lastDot);
  const cleanBase = baseName.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase() || "converted-png";
  return `${cleanBase}.pdf`;
};

/**
 * Calculates page dimensions based on paper preset, image dimensions, and orientation.
 */
export const calculatePageDimensions = (widthPx, heightPx, settings = {}) => {
  const { pageSize = "a4", orientation = "auto" } = settings;

  if (pageSize === "original") {
    const origW = convertPixelsToPoints96Dpi(widthPx);
    const origH = convertPixelsToPoints96Dpi(heightPx);
    return { pageWidth: origW, pageHeight: origH, orientation: widthPx > heightPx ? "landscape" : "portrait" };
  }

  const presetKey = String(pageSize).toUpperCase();
  const preset = PNG_PDF_PAPER_PRESETS[presetKey] || PNG_PDF_PAPER_PRESETS.A4;

  let shortDim = Math.min(preset.widthPt, preset.heightPt);
  let longDim = Math.max(preset.widthPt, preset.heightPt);

  let targetOrientation = orientation;
  if (orientation === "auto") {
    targetOrientation = widthPx > heightPx ? "landscape" : "portrait";
  }

  if (targetOrientation === "landscape") {
    return { pageWidth: longDim, pageHeight: shortDim, orientation: "landscape" };
  }

  return { pageWidth: shortDim, pageHeight: longDim, orientation: "portrait" };
};

/**
 * Calculates image placement coordinates and scaling factors for page rendering.
 */
export const calculateImagePlacement = (widthPx, heightPx, settings = {}) => {
  const {
    pageSize = "a4",
    margin = "none",
    fitMode = "FIT_TO_PAGE"
  } = settings;

  const { pageWidth, pageHeight, orientation } = calculatePageDimensions(widthPx, heightPx, settings);

  const marginPt = MARGIN_PRESETS[margin] !== undefined ? MARGIN_PRESETS[margin] : MARGIN_PRESETS.none;
  const usableWidth = Math.max(1, pageWidth - marginPt * 2);
  const usableHeight = Math.max(1, pageHeight - marginPt * 2);

  const imgPtWidth = convertPixelsToPoints96Dpi(widthPx);
  const imgPtHeight = convertPixelsToPoints96Dpi(heightPx);

  let drawWidth = usableWidth;
  let drawHeight = usableHeight;
  let drawX = marginPt;
  let drawY = marginPt;

  if (fitMode === "FIT_TO_PAGE") {
    const scale = Math.min(usableWidth / imgPtWidth, usableHeight / imgPtHeight);
    drawWidth = imgPtWidth * scale;
    drawHeight = imgPtHeight * scale;
    drawX = marginPt + (usableWidth - drawWidth) / 2;
    drawY = marginPt + (usableHeight - drawHeight) / 2;
  } else if (fitMode === "FILL_PAGE") {
    const scale = Math.max(usableWidth / imgPtWidth, usableHeight / imgPtHeight);
    drawWidth = imgPtWidth * scale;
    drawHeight = imgPtHeight * scale;
    drawX = marginPt + (usableWidth - drawWidth) / 2;
    drawY = marginPt + (usableHeight - drawHeight) / 2;
  } else if (fitMode === "ORIGINAL_SIZE") {
    drawWidth = imgPtWidth;
    drawHeight = imgPtHeight;
    drawX = (pageWidth - drawWidth) / 2;
    drawY = (pageHeight - drawHeight) / 2;
  }

  return {
    pageWidth,
    pageHeight,
    orientation,
    drawX,
    drawY,
    drawWidth,
    drawHeight,
    marginPt
  };
};

/**
 * Normalizes PNG bytes by composite-rendering over a solid white background (#FFFFFF)
 * when running in browser canvas environment, or directly embedding valid PNG bytes.
 */
export const preparePngBytesWithWhiteBackground = async (pngUint8Array) => {
  if (typeof window !== "undefined" && typeof document !== "undefined" && window.Image) {
    try {
      const blob = new Blob([pngUint8Array], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to decode PNG image in browser."));
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      URL.revokeObjectURL(url);

      return new Promise((resolve, reject) => {
        canvas.toBlob((b) => {
          canvas.width = 0;
          canvas.height = 0;
          if (!b) {
            resolve(pngUint8Array);
            return;
          }
          b.arrayBuffer().then((buf) => resolve(new Uint8Array(buf))).catch(() => resolve(pngUint8Array));
        }, "image/png");
      });
    } catch (e) {
      console.warn("Browser canvas normalization fallback to raw PNG bytes:", e);
      return pngUint8Array;
    }
  }

  return pngUint8Array;
};

/**
 * Core PDF Generation Engine: Converts an ordered list of PNG images into a PDF document using pdf-lib.
 * Preserves caller array order strictly without sorting or deduplication.
 */
export const createPdfFromPngs = async ({ images = [], settings = {}, onProgress = null }) => {
  if (!Array.isArray(images) || images.length === 0) {
    throw new Error("No PNG images provided for conversion.");
  }

  if (images.length > PNG_SAFETY_LIMITS.MAX_BATCH_IMAGE_COUNT) {
    throw new Error(`Batch size exceeds maximum limit of ${PNG_SAFETY_LIMITS.MAX_BATCH_IMAGE_COUNT} images.`);
  }

  const pdfDoc = await PDFDocument.create();
  const total = images.length;

  for (let i = 0; i < total; i++) {
    const item = images[i];
    const rawData = item.data || item.bytes || item;
    const filename = item.name || item.filename || `image-${i + 1}.png`;

    if (onProgress) {
      onProgress({ current: i + 1, total, stage: `Processing image ${i + 1} of ${total}...` });
    }

    const uint8Array = rawData instanceof Uint8Array
      ? rawData
      : new Uint8Array(rawData instanceof ArrayBuffer ? rawData : await rawData.arrayBuffer());

    const validation = validatePngFile(uint8Array, filename);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    let dimensions = parsePngHeaderDimensions(uint8Array);
    let pngBytesToEmbed = uint8Array;

    // Fallback if header parsing fails or in browser environment
    if (!dimensions) {
      throw new Error(`Invalid PNG image data or header in file "${filename}".`);
    }

    const pixelCount = dimensions.width * dimensions.height;
    if (pixelCount > PNG_SAFETY_LIMITS.MAX_CANVAS_PIXELS) {
      throw new Error(
        `Image "${filename}" (${dimensions.width}×${dimensions.height} px = ${(pixelCount / 1000000).toFixed(1)}MP) exceeds the 12 Megapixel safety cap.`
      );
    }

    pngBytesToEmbed = await preparePngBytesWithWhiteBackground(uint8Array);

    const embeddedImage = await pdfDoc.embedPng(pngBytesToEmbed);
    const widthPx = dimensions.width;
    const heightPx = dimensions.height;

    const placement = calculateImagePlacement(widthPx, heightPx, settings);

    const page = pdfDoc.addPage([placement.pageWidth, placement.pageHeight]);

    page.drawImage(embeddedImage, {
      x: placement.drawX,
      y: placement.drawY,
      width: placement.drawWidth,
      height: placement.drawHeight
    });

    if ((i + 1) % 5 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  const pdfBytes = await pdfDoc.save();

  return {
    pdfBytes,
    pageCount: total,
    filename: sanitizePngToPdfFilename(images[0]?.name || images[0]?.filename, total)
  };
};
