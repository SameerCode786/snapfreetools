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
/**
 * Calculates a new field rectangle when dragging one of the 8 resize handles.
 *
 * @param {Object} params
 * @param {{ x: number, y: number, width: number, height: number }} params.startRect - Starting rectangle
 * @param {'nw'|'n'|'ne'|'e'|'se'|'s'|'sw'|'w'} params.handle - Active resize handle
 * @param {number} params.deltaX - Pointer X movement in document canvas pixels
 * @param {number} params.deltaY - Pointer Y movement in document canvas pixels
 * @param {{ width: number, height: number }} params.containerBounds - Document container dimensions
 * @param {number} [params.minWidth=30] - Minimum allowed width (px)
 * @param {number} [params.minHeight=16] - Minimum allowed height (px)
 * @param {boolean} [params.lockAspectRatio=false] - Whether to preserve aspect ratio on corner handles
 * @returns {{ x: number, y: number, width: number, height: number }}
 */
export function calculateFieldResize({
  startRect,
  handle,
  deltaX,
  deltaY,
  containerBounds,
  minWidth = 30,
  minHeight = 16,
  lockAspectRatio = false
}) {
  const contW = Math.max(100, containerBounds?.width || 600);
  const contH = Math.max(100, containerBounds?.height || 800);
  const safeMinWidth = Math.max(10, minWidth);
  const safeMinHeight = Math.max(10, minHeight);

  const aspectRatio =
    startRect.width > 0 && startRect.height > 0
      ? startRect.width / startRect.height
      : 1;

  let { x, y, width, height } = startRect;

  switch (handle) {
    case "e": {
      width = Math.max(safeMinWidth, Math.min(contW - startRect.x, startRect.width + deltaX));
      break;
    }

    case "w": {
      const maxAllowedX = startRect.x + startRect.width - safeMinWidth;
      const newX = Math.max(0, Math.min(maxAllowedX, startRect.x + deltaX));
      width = startRect.width + (startRect.x - newX);
      x = newX;
      break;
    }

    case "s": {
      height = Math.max(safeMinHeight, Math.min(contH - startRect.y, startRect.height + deltaY));
      break;
    }

    case "n": {
      const maxAllowedY = startRect.y + startRect.height - safeMinHeight;
      const newY = Math.max(0, Math.min(maxAllowedY, startRect.y + deltaY));
      height = startRect.height + (startRect.y - newY);
      y = newY;
      break;
    }

    case "se": {
      if (lockAspectRatio) {
        // Corner resize preserving aspect ratio
        let candW = startRect.width + (Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : deltaY * aspectRatio);
        candW = Math.max(safeMinWidth, Math.min(contW - startRect.x, candW));
        let candH = candW / aspectRatio;

        if (startRect.y + candH > contH) {
          candH = contH - startRect.y;
          candW = candH * aspectRatio;
        }
        if (candH < safeMinHeight) {
          candH = safeMinHeight;
          candW = candH * aspectRatio;
        }

        width = candW;
        height = candH;
      } else {
        width = Math.max(safeMinWidth, Math.min(contW - startRect.x, startRect.width + deltaX));
        height = Math.max(safeMinHeight, Math.min(contH - startRect.y, startRect.height + deltaY));
      }
      break;
    }

    case "sw": {
      if (lockAspectRatio) {
        let candW = startRect.width - (Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : -deltaY * aspectRatio);
        candW = Math.max(safeMinWidth, Math.min(startRect.x + startRect.width, candW));
        let candH = candW / aspectRatio;

        if (startRect.y + candH > contH) {
          candH = contH - startRect.y;
          candW = candH * aspectRatio;
        }
        if (candH < safeMinHeight) {
          candH = safeMinHeight;
          candW = candH * aspectRatio;
        }

        const newX = startRect.x + (startRect.width - candW);
        x = Math.max(0, newX);
        width = candW;
        height = candH;
      } else {
        const maxAllowedX = startRect.x + startRect.width - safeMinWidth;
        const newX = Math.max(0, Math.min(maxAllowedX, startRect.x + deltaX));
        width = startRect.width + (startRect.x - newX);
        height = Math.max(safeMinHeight, Math.min(contH - startRect.y, startRect.height + deltaY));
        x = newX;
      }
      break;
    }

    case "ne": {
      if (lockAspectRatio) {
        let candW = startRect.width + (Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : -deltaY * aspectRatio);
        candW = Math.max(safeMinWidth, Math.min(contW - startRect.x, candW));
        let candH = candW / aspectRatio;

        if (startRect.y + startRect.height - candH < 0) {
          candH = startRect.y + startRect.height;
          candW = candH * aspectRatio;
        }
        if (candH < safeMinHeight) {
          candH = safeMinHeight;
          candW = candH * aspectRatio;
        }

        const newY = startRect.y + (startRect.height - candH);
        y = Math.max(0, newY);
        width = candW;
        height = candH;
      } else {
        const maxAllowedY = startRect.y + startRect.height - safeMinHeight;
        const newY = Math.max(0, Math.min(maxAllowedY, startRect.y + deltaY));
        height = startRect.height + (startRect.y - newY);
        width = Math.max(safeMinWidth, Math.min(contW - startRect.x, startRect.width + deltaX));
        y = newY;
      }
      break;
    }

    case "nw": {
      if (lockAspectRatio) {
        let candW = startRect.width - (Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : deltaY * aspectRatio);
        candW = Math.max(safeMinWidth, Math.min(startRect.x + startRect.width, candW));
        let candH = candW / aspectRatio;

        if (startRect.y + startRect.height - candH < 0) {
          candH = startRect.y + startRect.height;
          candW = candH * aspectRatio;
        }
        if (candH < safeMinHeight) {
          candH = safeMinHeight;
          candW = candH * aspectRatio;
        }

        const newX = startRect.x + (startRect.width - candW);
        const newY = startRect.y + (startRect.height - candH);
        x = Math.max(0, newX);
        y = Math.max(0, newY);
        width = candW;
        height = candH;
      } else {
        const maxAllowedX = startRect.x + startRect.width - safeMinWidth;
        const maxAllowedY = startRect.y + startRect.height - safeMinHeight;
        const newX = Math.max(0, Math.min(maxAllowedX, startRect.x + deltaX));
        const newY = Math.max(0, Math.min(maxAllowedY, startRect.y + deltaY));
        width = startRect.width + (startRect.x - newX);
        height = startRect.height + (startRect.y - newY);
        x = newX;
        y = newY;
      }
      break;
    }

    default:
      break;
  }

  // Final safety checks against container boundaries
  const clampedX = Math.max(0, Math.min(contW - safeMinWidth, x));
  const clampedY = Math.max(0, Math.min(contH - safeMinHeight, y));
  const clampedWidth = Math.max(safeMinWidth, Math.min(contW - clampedX, width));
  const clampedHeight = Math.max(safeMinHeight, Math.min(contH - clampedY, height));

  return {
    x: Math.round(clampedX),
    y: Math.round(clampedY),
    width: Math.round(clampedWidth),
    height: Math.round(clampedHeight)
  };
}

/**
 * Computes smart alignment guides and snapping coordinates against page edges/center and sibling fields.
 *
 * @param {Object} params
 * @param {number} params.rawX - Raw proposed X coordinate
 * @param {number} params.rawY - Raw proposed Y coordinate
 * @param {number} params.width - Field width
 * @param {number} params.height - Field height
 * @param {{ width: number, height: number }} params.containerBounds - Page container dimensions
 * @param {Array<Object>} [params.siblingFields=[]] - Other fields on the current page
 * @param {number} [params.threshold=6] - Snap distance threshold in document pixels
 * @returns {{ snappedX: number, snappedY: number, activeGuides: Array<Object> }}
 */
export function computeSmartGuidesAndSnap({
  rawX,
  rawY,
  width,
  height,
  containerBounds,
  siblingFields = [],
  threshold = 6
}) {
  let snappedX = rawX;
  let snappedY = rawY;
  const activeGuides = [];

  const contW = containerBounds?.width || 600;
  const contH = containerBounds?.height || 800;

  // Horizontal target lines (X positions on page)
  const xTargets = [
    { pos: 0, type: "page-edge" },
    { pos: Math.round(contW / 2), type: "page-center" },
    { pos: contW, type: "page-edge" }
  ];

  for (const s of siblingFields) {
    if (!s || typeof s.x !== "number" || typeof s.width !== "number") continue;
    xTargets.push({ pos: s.x, type: "sibling-edge" });
    xTargets.push({ pos: Math.round(s.x + s.width / 2), type: "sibling-center" });
    xTargets.push({ pos: s.x + s.width, type: "sibling-edge" });
  }

  // Subject field X alignment points (left, center, right)
  const subjectXPoints = [
    { point: rawX, offset: 0 },
    { point: rawX + Math.round(width / 2), offset: Math.round(width / 2) },
    { point: rawX + width, offset: width }
  ];

  let bestXDiff = threshold + 0.001;
  let bestXSnap = null;
  let bestXGuide = null;

  for (const sub of subjectXPoints) {
    for (const tgt of xTargets) {
      const diff = Math.abs(sub.point - tgt.pos);
      if (diff <= threshold && diff < bestXDiff) {
        bestXDiff = diff;
        bestXSnap = tgt.pos - sub.offset;
        bestXGuide = { orientation: "vertical", x: tgt.pos, type: tgt.type };
      }
    }
  }

  if (bestXSnap !== null) {
    snappedX = bestXSnap;
    activeGuides.push(bestXGuide);
  }

  // Vertical target lines (Y positions on page)
  const yTargets = [
    { pos: 0, type: "page-edge" },
    { pos: Math.round(contH / 2), type: "page-center" },
    { pos: contH, type: "page-edge" }
  ];

  for (const s of siblingFields) {
    if (!s || typeof s.y !== "number" || typeof s.height !== "number") continue;
    yTargets.push({ pos: s.y, type: "sibling-edge" });
    yTargets.push({ pos: Math.round(s.y + s.height / 2), type: "sibling-center" });
    yTargets.push({ pos: s.y + s.height, type: "sibling-edge" });
  }

  // Subject field Y alignment points (top, center, bottom)
  const subjectYPoints = [
    { point: rawY, offset: 0 },
    { point: rawY + Math.round(height / 2), offset: Math.round(height / 2) },
    { point: rawY + height, offset: height }
  ];

  let bestYDiff = threshold + 0.001;
  let bestYSnap = null;
  let bestYGuide = null;

  for (const sub of subjectYPoints) {
    for (const tgt of yTargets) {
      const diff = Math.abs(sub.point - tgt.pos);
      if (diff <= threshold && diff < bestYDiff) {
        bestYDiff = diff;
        bestYSnap = tgt.pos - sub.offset;
        bestYGuide = { orientation: "horizontal", y: tgt.pos, type: tgt.type };
      }
    }
  }

  if (bestYSnap !== null) {
    snappedY = bestYSnap;
    activeGuides.push(bestYGuide);
  }

  // Clamping to container bounds
  const maxX = Math.max(0, contW - width);
  const maxY = Math.max(0, contH - height);
  snappedX = Math.max(0, Math.min(maxX, snappedX));
  snappedY = Math.max(0, Math.min(maxY, snappedY));

  return {
    snappedX: Math.round(snappedX),
    snappedY: Math.round(snappedY),
    activeGuides
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

/**
 * Checks if a target DOM element is an active text typing context
 * (input, textarea, select, contentEditable, etc.) where global shortcuts must not intercept.
 *
 * @param {EventTarget|null} target
 * @returns {boolean}
 */
export function isTypingContext(target) {
  if (!target) return false;
  const tagName = target.tagName ? target.tagName.toUpperCase() : "";
  if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
    return true;
  }
  if (target.isContentEditable) {
    return true;
  }
  if (typeof target.getAttribute === "function" && target.getAttribute("role") === "textbox") {
    return true;
  }
  return false;
}

/**
 * Calculates new bounded field coordinates when nudged by keyboard arrow keys.
 *
 * @param {Object} params
 * @param {number} params.x - Current X coordinate
 * @param {number} params.y - Current Y coordinate
 * @param {number} params.width - Field width
 * @param {number} params.height - Field height
 * @param {'ArrowUp'|'ArrowDown'|'ArrowLeft'|'ArrowRight'} params.direction - Arrow key pressed
 * @param {number} [params.step=1] - Movement distance (1 or 10 with Shift)
 * @param {{ width: number, height: number }} params.containerBounds - Container dimensions
 * @returns {{ x: number, y: number }}
 */
export function nudgeFieldCoordinates({
  x,
  y,
  width,
  height,
  direction,
  step = 1,
  containerBounds
}) {
  let newX = x;
  let newY = y;
  const maxX = Math.max(0, containerBounds.width - width);
  const maxY = Math.max(0, containerBounds.height - height);

  switch (direction) {
    case "ArrowLeft":
      newX = Math.max(0, x - step);
      break;
    case "ArrowRight":
      newX = Math.min(maxX, x + step);
      break;
    case "ArrowUp":
      newY = Math.max(0, y - step);
      break;
    case "ArrowDown":
      newY = Math.min(maxY, y + step);
      break;
    default:
      break;
  }

  return {
    x: Math.round(newX),
    y: Math.round(newY)
  };
}


