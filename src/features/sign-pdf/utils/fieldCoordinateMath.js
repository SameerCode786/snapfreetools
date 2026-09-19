/**
 * Mathematical utilities for precise coordinate transformations between
 * browser screen/preview viewport (top-left origin, CSS pixels)
 * and PDF page coordinates (bottom-left origin, 72-point units).
 */

/**
 * Converts screen preview coordinates (top-left origin) to PDF page coordinates (bottom-left origin).
 *
 * @param {Object} params
 * @param {number} params.screenX - X coordinate relative to the preview container (px)
 * @param {number} params.screenY - Y coordinate relative to the preview container (px)
 * @param {number} params.screenWidth - Field width on screen (px)
 * @param {number} params.screenHeight - Field height on screen (px)
 * @param {number} params.previewWidth - Total rendered width of the preview container (px)
 * @param {number} params.previewHeight - Total rendered height of the preview container (px)
 * @param {number} params.pdfPageWidth - Actual PDF page width (points)
 * @param {number} params.pdfPageHeight - Actual PDF page height (points)
 * @param {number} [params.rotation=0] - Field rotation in degrees (0, 90, 180, 270)
 * @returns {{ x: number, y: number, width: number, height: number, rotation: number }}
 */
export function screenToPdfCoords({
  screenX,
  screenY,
  screenWidth,
  screenHeight,
  previewWidth,
  previewHeight,
  pdfPageWidth,
  pdfPageHeight,
  rotation = 0
}) {
  if (!previewWidth || !previewHeight || previewWidth <= 0 || previewHeight <= 0) {
    return {
      x: screenX,
      y: screenY,
      width: screenWidth,
      height: screenHeight,
      rotation: rotation || 0
    };
  }

  const scaleX = pdfPageWidth / previewWidth;
  const scaleY = pdfPageHeight / previewHeight;

  const pdfWidth = screenWidth * scaleX;
  const pdfHeight = screenHeight * scaleY;
  const pdfX = screenX * scaleX;

  // In PDF coordinate space, (0,0) is bottom-left, while in browser DOM (0,0) is top-left
  const pdfY = pdfPageHeight - (screenY * scaleY) - pdfHeight;

  return {
    x: Math.round(pdfX * 100) / 100,
    y: Math.round(pdfY * 100) / 100,
    width: Math.round(pdfWidth * 100) / 100,
    height: Math.round(pdfHeight * 100) / 100,
    rotation: rotation || 0
  };
}

/**
 * Converts PDF page coordinates (bottom-left origin) to screen preview coordinates (top-left origin).
 *
 * @param {Object} params
 * @param {number} params.pdfX - X position on PDF page (pt)
 * @param {number} params.pdfY - Y position on PDF page (pt)
 * @param {number} params.pdfWidth - Field width on PDF page (pt)
 * @param {number} params.pdfHeight - Field height on PDF page (pt)
 * @param {number} params.previewWidth - Rendered preview container width (px)
 * @param {number} params.previewHeight - Rendered preview container height (px)
 * @param {number} params.pdfPageWidth - Actual PDF page width (pt)
 * @param {number} params.pdfPageHeight - Actual PDF page height (pt)
 * @returns {{ screenX: number, screenY: number, screenWidth: number, screenHeight: number }}
 */
export function pdfToScreenCoords({
  pdfX,
  pdfY,
  pdfWidth,
  pdfHeight,
  previewWidth,
  previewHeight,
  pdfPageWidth,
  pdfPageHeight
}) {
  const scaleX = previewWidth / pdfPageWidth;
  const scaleY = previewHeight / pdfPageHeight;

  const screenWidth = pdfWidth * scaleX;
  const screenHeight = pdfHeight * scaleY;
  const screenX = pdfX * scaleX;
  const screenY = (pdfPageHeight - pdfY - pdfHeight) * scaleY;

  return {
    screenX: Math.round(screenX),
    screenY: Math.round(screenY),
    screenWidth: Math.round(screenWidth),
    screenHeight: Math.round(screenHeight)
  };
}

/**
 * Clamps a field's position and dimensions so it stays completely inside its container.
 *
 * @param {Object} field - Field object with x, y, width, height
 * @param {{ width: number, height: number }} containerBounds
 * @returns {{ x: number, y: number, width: number, height: number }}
 */
export function clampFieldToContainer(field, containerBounds) {
  const maxWidth = Math.max(20, containerBounds.width);
  const maxHeight = Math.max(20, containerBounds.height);

  const clampedWidth = Math.max(20, Math.min(maxWidth, field.width || 100));
  const clampedHeight = Math.max(16, Math.min(maxHeight, field.height || 30));

  const maxX = Math.max(0, containerBounds.width - clampedWidth);
  const maxY = Math.max(0, containerBounds.height - clampedHeight);

  const clampedX = Math.max(0, Math.min(maxX, field.x || 0));
  const clampedY = Math.max(0, Math.min(maxY, field.y || 0));

  return {
    x: Math.round(clampedX),
    y: Math.round(clampedY),
    width: Math.round(clampedWidth),
    height: Math.round(clampedHeight)
  };
}

/**
 * Computes an offset position for a duplicated field ensuring it is visible
 * and contained inside the page container.
 *
 * @param {Object} sourceField
 * @param {{ width: number, height: number }} containerBounds
 * @param {number} [offset=20]
 * @returns {{ x: number, y: number }}
 */
export function computeDuplicateOffset(sourceField, containerBounds, offset = 20) {
  const maxX = Math.max(0, containerBounds.width - sourceField.width);
  const maxY = Math.max(0, containerBounds.height - sourceField.height);

  let newX = sourceField.x + offset;
  let newY = sourceField.y + offset;

  // If overflowing bottom or right, wrap back towards top-left
  if (newX > maxX) newX = Math.max(0, sourceField.x - offset);
  if (newY > maxY) newY = Math.max(0, sourceField.y - offset);

  return {
    x: Math.max(0, Math.min(maxX, Math.round(newX))),
    y: Math.max(0, Math.min(maxY, Math.round(newY)))
  };
}

/**
 * Converts a hex color string (e.g. "#1d4ed8" or "#000") to normalized RGB components (0..1).
 *
 * @param {string} hex
 * @returns {{ r: number, g: number, b: number }}
 */
export function hexToNormalizedRgb(hex = "#000000") {
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((c) => c + c).join("");
  }
  if (cleanHex.length !== 6) {
    return { r: 0, g: 0, b: 0 };
  }

  const num = parseInt(cleanHex, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255
  };
}

/**
 * Formats a Date object or ISO string according to standard formats.
 *
 * @param {Date|string} dateInput
 * @param {'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'MMMM D, YYYY'} [format='YYYY-MM-DD']
 * @returns {string}
 */
export function formatDateValue(dateInput = new Date(), format = "YYYY-MM-DD") {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) {
    return new Date().toISOString().split("T")[0];
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  switch (format) {
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "MMMM D, YYYY":
      return `${monthNames[d.getMonth()]} ${d.getDate()}, ${year}`;
    case "YYYY-MM-DD":
    default:
      return `${year}-${month}-${day}`;
  }
}
