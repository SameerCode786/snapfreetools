/**
 * Core mathematical, geometric, spatial transformation, interpolation,
 * and SVG path utilities for PDF drawing and annotation.
 */

/**
 * Normalizes an angle in degrees to [0, 360).
 * @param {number} deg
 * @returns {number}
 */
export function normalizeAngle(deg = 0) {
  const mod = deg % 360;
  return mod < 0 ? mod + 360 : mod;
}

/**
 * Converts screen preview coordinates (top-left origin, CSS px) to PDF page coordinates (bottom-left origin, PDF points).
 * Handles page rotation (0°, 90°, 180°, 270°).
 *
 * @param {Object} params
 * @param {number} params.screenX - X coordinate relative to screen preview container
 * @param {number} params.screenY - Y coordinate relative to screen preview container
 * @param {number} params.previewWidth - Rendered screen width of preview viewport
 * @param {number} params.previewHeight - Rendered screen height of preview viewport
 * @param {number} params.pdfPageWidth - Unrotated PDF page width in points
 * @param {number} params.pdfPageHeight - Unrotated PDF page height in points
 * @param {number} [params.rotation=0] - Page rotation in degrees (0, 90, 180, 270)
 * @returns {{ x: number, y: number }} PDF coordinates (bottom-left origin in unrotated PDF space)
 */
export function screenToPdfPoint({
  screenX,
  screenY,
  previewWidth,
  previewHeight,
  pdfPageWidth,
  pdfPageHeight,
  rotation = 0
}) {
  if (!previewWidth || !previewHeight || previewWidth <= 0 || previewHeight <= 0) {
    return { x: screenX, y: screenY };
  }

  const rot = normalizeAngle(rotation);

  let pdfX = 0;
  let pdfY = 0;

  if (rot === 0) {
    // 0°: Screen top-left (0, 0) is PDF top-left (0, pdfPageHeight)
    const scaleX = pdfPageWidth / previewWidth;
    const scaleY = pdfPageHeight / previewHeight;
    pdfX = screenX * scaleX;
    pdfY = pdfPageHeight - screenY * scaleY;
  } else if (rot === 90) {
    // 90° CW rotation: Preview width corresponds to pdfPageHeight, preview height to pdfPageWidth
    const scaleX = pdfPageHeight / previewWidth;
    const scaleY = pdfPageWidth / previewHeight;
    pdfX = screenY * scaleY;
    pdfY = screenX * scaleX;
  } else if (rot === 180) {
    // 180° rotation: Preview top-left is PDF bottom-right (pdfPageWidth, 0)
    const scaleX = pdfPageWidth / previewWidth;
    const scaleY = pdfPageHeight / previewHeight;
    pdfX = pdfPageWidth - screenX * scaleX;
    pdfY = screenY * scaleY;
  } else if (rot === 270) {
    // 270° CW rotation: Preview width corresponds to pdfPageHeight, preview height to pdfPageWidth
    const scaleX = pdfPageHeight / previewWidth;
    const scaleY = pdfPageWidth / previewHeight;
    pdfX = pdfPageWidth - screenY * scaleY;
    pdfY = pdfPageHeight - screenX * scaleX;
  } else {
    // Fallback for non-standard rotation angles
    const scaleX = pdfPageWidth / previewWidth;
    const scaleY = pdfPageHeight / previewHeight;
    pdfX = screenX * scaleX;
    pdfY = pdfPageHeight - screenY * scaleY;
  }

  return {
    x: Math.round(pdfX * 100) / 100,
    y: Math.round(pdfY * 100) / 100
  };
}

/**
 * Converts PDF page coordinates (bottom-left origin) to screen preview coordinates (top-left origin).
 * Handles page rotation (0°, 90°, 180°, 270°).
 *
 * @param {Object} params
 * @param {number} params.pdfX - X coordinate on PDF page (points)
 * @param {number} params.pdfY - Y coordinate on PDF page (points)
 * @param {number} params.previewWidth - Rendered screen width of preview viewport
 * @param {number} params.previewHeight - Rendered screen height of preview viewport
 * @param {number} params.pdfPageWidth - Unrotated PDF page width in points
 * @param {number} params.pdfPageHeight - Unrotated PDF page height in points
 * @param {number} [params.rotation=0] - Page rotation in degrees
 * @returns {{ screenX: number, screenY: number }}
 */
export function pdfToScreenPoint({
  pdfX,
  pdfY,
  previewWidth,
  previewHeight,
  pdfPageWidth,
  pdfPageHeight,
  rotation = 0
}) {
  const rot = normalizeAngle(rotation);

  let screenX = 0;
  let screenY = 0;

  if (rot === 0) {
    const scaleX = previewWidth / pdfPageWidth;
    const scaleY = previewHeight / pdfPageHeight;
    screenX = pdfX * scaleX;
    screenY = (pdfPageHeight - pdfY) * scaleY;
  } else if (rot === 90) {
    const scaleX = previewWidth / pdfPageHeight;
    const scaleY = previewHeight / pdfPageWidth;
    screenX = pdfY * scaleX;
    screenY = pdfX * scaleY;
  } else if (rot === 180) {
    const scaleX = previewWidth / pdfPageWidth;
    const scaleY = previewHeight / pdfPageHeight;
    screenX = (pdfPageWidth - pdfX) * scaleX;
    screenY = pdfY * scaleY;
  } else if (rot === 270) {
    const scaleX = previewWidth / pdfPageHeight;
    const scaleY = previewHeight / pdfPageWidth;
    screenX = (pdfPageHeight - pdfY) * scaleX;
    screenY = (pdfPageWidth - pdfX) * scaleY;
  } else {
    const scaleX = previewWidth / pdfPageWidth;
    const scaleY = previewHeight / pdfPageHeight;
    screenX = pdfX * scaleX;
    screenY = (pdfPageHeight - pdfY) * scaleY;
  }

  return {
    screenX: Math.round(screenX * 100) / 100,
    screenY: Math.round(screenY * 100) / 100
  };
}

/**
 * Normalizes a point coordinate relative to a 0..1 scale.
 * @param {{ x: number, y: number }} point
 * @param {number} width
 * @param {number} height
 * @returns {{ nx: number, ny: number }}
 */
export function normalizePoint(point, width, height) {
  if (!width || !height) return { nx: 0, ny: 0 };
  return {
    nx: Math.round((point.x / width) * 10000) / 10000,
    ny: Math.round((point.y / height) * 10000) / 10000
  };
}

/**
 * Denormalizes a 0..1 point back to screen/PDF dimensions.
 * @param {{ nx: number, ny: number }} normPoint
 * @param {number} width
 * @param {number} height
 * @returns {{ x: number, y: number }}
 */
export function denormalizePoint(normPoint, width, height) {
  return {
    x: Math.round(normPoint.nx * width * 100) / 100,
    y: Math.round(normPoint.ny * height * 100) / 100
  };
}

/**
 * Calculates the bounding box for an array of points.
 * @param {Array<{ x: number, y: number }>} points
 * @returns {{ x: number, y: number, width: number, height: number }}
 */
export function getBoundingBox(points = []) {
  if (!points || points.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const pt of points) {
    if (typeof pt.x === "number" && !isNaN(pt.x)) {
      minX = Math.min(minX, pt.x);
      maxX = Math.max(maxX, pt.x);
    }
    if (typeof pt.y === "number" && !isNaN(pt.y)) {
      minY = Math.min(minY, pt.y);
      maxY = Math.max(maxY, pt.y);
    }
  }

  if (minX === Infinity) return { x: 0, y: 0, width: 0, height: 0 };

  return {
    x: Math.round(minX * 100) / 100,
    y: Math.round(minY * 100) / 100,
    width: Math.round((maxX - minX) * 100) / 100,
    height: Math.round((maxY - minY) * 100) / 100
  };
}

/**
 * Smoothes an array of points into quadratic bezier curve control points.
 * Uses midpoint interpolation between consecutive points for smooth freehand drawing.
 *
 * @param {Array<{ x: number, y: number }>} points
 * @returns {Array<{ type: 'M'|'Q'|'L', x: number, y: number, cx?: number, cy?: number }>}
 */
export function smoothPoints(points = []) {
  if (!points || points.length === 0) return [];
  if (points.length === 1) {
    return [{ type: "M", x: points[0].x, y: points[0].y }];
  }
  if (points.length === 2) {
    return [
      { type: "M", x: points[0].x, y: points[0].y },
      { type: "L", x: points[1].x, y: points[1].y }
    ];
  }

  const result = [{ type: "M", x: points[0].x, y: points[0].y }];

  for (let i = 1; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;

    result.push({
      type: "Q",
      cx: p1.x,
      cy: p1.y,
      x: midX,
      y: midY
    });
  }

  // Connect last point
  const last = points[points.length - 1];
  result.push({ type: "L", x: last.x, y: last.y });

  return result;
}

/**
 * Converts an array of points or smooth path commands into a valid SVG path data string.
 *
 * @param {Array<{ x: number, y: number }>} points
 * @returns {string} SVG path string (e.g. "M 10 20 Q 15 25 20 30 L 40 50")
 */
export function pointsToSvgPath(points = []) {
  if (!points || points.length === 0) return "";

  const segments = smoothPoints(points);
  return segments
    .map((seg) => {
      if (seg.type === "M") {
        return `M ${seg.x.toFixed(2)} ${seg.y.toFixed(2)}`;
      }
      if (seg.type === "Q") {
        return `Q ${seg.cx.toFixed(2)} ${seg.cy.toFixed(2)} ${seg.x.toFixed(2)} ${seg.y.toFixed(2)}`;
      }
      if (seg.type === "L") {
        return `L ${seg.x.toFixed(2)} ${seg.y.toFixed(2)}`;
      }
      return "";
    })
    .filter(Boolean)
    .join(" ");
}

/**
 * Calculates arrowhead geometry for a directed vector line segment.
 *
 * @param {Object} params
 * @param {number} params.startX - Line start X
 * @param {number} params.startY - Line start Y
 * @param {number} params.endX - Line end X (arrowhead tip)
 * @param {number} params.endY - Line end Y (arrowhead tip)
 * @param {number} [params.arrowSize=12] - Arrowhead length in pixels/points
 * @param {number} [params.angleDegrees=30] - Half-angle of arrowhead in degrees
 * @returns {{ line: { startX: number, startY: number, endX: number, endY: number }, arrowLeft: { x: number, y: number }, arrowRight: { x: number, y: number } }}
 */
export function calculateArrowGeometry({
  startX,
  startY,
  endX,
  endY,
  arrowSize = 12,
  angleDegrees = 30
}) {
  const dx = endX - startX;
  const dy = endY - startY;
  const angle = Math.atan2(dy, dx);
  const rad = (angleDegrees * Math.PI) / 180;

  const leftAngle = angle - Math.PI + rad;
  const rightAngle = angle - Math.PI - rad;

  const leftX = endX + arrowSize * Math.cos(leftAngle);
  const leftY = endY + arrowSize * Math.sin(leftAngle);

  const rightX = endX + arrowSize * Math.cos(rightAngle);
  const rightY = endY + arrowSize * Math.sin(rightAngle);

  return {
    line: { startX, startY, endX, endY },
    arrowLeft: { x: Math.round(leftX * 100) / 100, y: Math.round(leftY * 100) / 100 },
    arrowRight: { x: Math.round(rightX * 100) / 100, y: Math.round(rightY * 100) / 100 }
  };
}

/**
 * Normalizes rectangle bounds so width and height are always non-negative.
 *
 * @param {{ x: number, y: number, width: number, height: number }} rect
 * @returns {{ x: number, y: number, width: number, height: number }}
 */
export function normalizeRectangle(rect) {
  let { x, y, width, height } = rect;
  if (width < 0) {
    x += width;
    width = Math.abs(width);
  }
  if (height < 0) {
    y += height;
    height = Math.abs(height);
  }
  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100,
    width: Math.round(width * 100) / 100,
    height: Math.round(height * 100) / 100
  };
}

/**
 * Calculates center, X-radius, and Y-radius for an ellipse/circle bounding box.
 *
 * @param {{ x: number, y: number, width: number, height: number }} rect
 * @returns {{ cx: number, cy: number, rx: number, ry: number }}
 */
export function calculateEllipseGeometry(rect) {
  const norm = normalizeRectangle(rect);
  const rx = norm.width / 2;
  const ry = norm.height / 2;
  const cx = norm.x + rx;
  const cy = norm.y + ry;

  return {
    cx: Math.round(cx * 100) / 100,
    cy: Math.round(cy * 100) / 100,
    rx: Math.round(rx * 100) / 100,
    ry: Math.round(ry * 100) / 100
  };
}

/**
 * Clamps a point within given container boundaries.
 *
 * @param {{ x: number, y: number }} point
 * @param {{ width: number, height: number }} container
 * @returns {{ x: number, y: number }}
 */
export function clampPoint(point, container) {
  return {
    x: Math.max(0, Math.min(container.width, point.x)),
    y: Math.max(0, Math.min(container.height, point.y))
  };
}

/**
 * Converts a hex color string (e.g. "#ef4444") to normalized RGB components (0..1).
 *
 * @param {string} hex
 * @returns {{ r: number, g: number, b: number }}
 */
export function hexToNormalizedRgb(hex = "#000000") {
  let cleanHex = (hex || "#000000").replace("#", "").trim();
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
