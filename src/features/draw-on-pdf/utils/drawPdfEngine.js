import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import {
  screenToPdfPoint,
  pdfToScreenPoint,
  pointsToSvgPath,
  calculateArrowGeometry,
  normalizeRectangle,
  calculateEllipseGeometry,
  hexToNormalizedRgb
} from "./drawingMath.js";

/**
 * Custom structured error class for Draw on PDF engine.
 */
export class DrawPdfError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {'DRAW_PDF_ERROR'|'CORRUPTED_PDF'|'PASSWORD_PROTECTED'|'INVALID_ANNOTATION'|'INVALID_PAGE'|'CANCELLED'|'EXPORT_FAILED'} [code='DRAW_PDF_ERROR']
   * @param {any} [details=null]
   */
  constructor(message, code = "DRAW_PDF_ERROR", details = null) {
    super(message);
    this.name = "DrawPdfError";
    this.code = code;
    this.details = details;
  }
}

/**
 * Initializes or fetches the pdfjs-dist worker engine.
 */
export const getPdfJsEngine = async () => {
  let pdfjsModule;
  if (typeof window !== "undefined") {
    pdfjsModule = await import("pdfjs-dist");
  } else {
    pdfjsModule = await import("pdfjs-dist/legacy/build/pdf.mjs");
  }
  const pdfjs = pdfjsModule.default || pdfjsModule;
  if (typeof window !== "undefined" && pdfjs.GlobalWorkerOptions) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  }
  return pdfjs;
};

/**
 * Helper to identify password-protected or encrypted PDF errors.
 * @param {Error|any} err
 * @returns {boolean}
 */
export const isPasswordProtectedError = (err) => {
  if (!err) return false;
  if (err.name === "PasswordException" || err.name === "EncryptedPDFError") return true;
  if (err.code === 1 || err.code === 2) return true;
  const msg = (err.message || "").toString().toLowerCase();
  return (
    msg.includes("password") ||
    msg.includes("encrypted") ||
    msg.includes("no password given") ||
    msg.includes("passwordexception") ||
    msg.includes("incorrect password")
  );
};

/**
 * Converts various input formats (File, Blob, ArrayBuffer, Uint8Array) into an immutable Uint8Array copy.
 *
 * @param {File|Blob|ArrayBuffer|Uint8Array} input
 * @returns {Promise<Uint8Array>}
 */
export const normalizeToUint8Array = async (input) => {
  if (!input) {
    throw new DrawPdfError("No PDF file input provided.", "INVALID_ANNOTATION");
  }
  if (input instanceof Uint8Array) {
    // Return a fresh defensive copy so the original buffer is never mutated
    return new Uint8Array(input.slice(0));
  }
  if (input instanceof ArrayBuffer) {
    return new Uint8Array(input.slice(0));
  }
  if (typeof Blob !== "undefined" && input instanceof Blob) {
    const ab = await input.arrayBuffer();
    return new Uint8Array(ab);
  }
  if (input.buffer && input.buffer instanceof ArrayBuffer) {
    return new Uint8Array(input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength));
  }
  throw new DrawPdfError("Unsupported file input format.", "CORRUPTED_PDF");
};

/**
 * Parses basic metadata, page count, dimensions, and rotation angles from an uploaded PDF file.
 *
 * @param {File|Blob|ArrayBuffer|Uint8Array} input
 * @returns {Promise<{ pageCount: number, pageDimensions: Array<{ pageNumber: number, width: number, height: number, rotation: number }>, bytes: Uint8Array }>}
 */
export const parsePdfMetadata = async (input) => {
  const bytes = await normalizeToUint8Array(input);

  // Try parsing using pdf-lib first (reliable in all Node.js and browser environments)
  try {
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: false });
    const pageCount = pdfDoc.getPageCount();
    const pages = pdfDoc.getPages();
    const pageDimensions = [];

    for (let p = 0; p < pageCount; p++) {
      const page = pages[p];
      const { width, height } = page.getSize();
      const rotation = page.getRotation().angle || 0;
      pageDimensions.push({
        pageNumber: p + 1,
        width,
        height,
        rotation
      });
    }

    return {
      pageCount,
      pageDimensions,
      bytes
    };
  } catch (err) {
    if (isPasswordProtectedError(err)) {
      throw new DrawPdfError(
        "This PDF is password-protected. Please unlock it using our Unlock PDF tool first.",
        "PASSWORD_PROTECTED",
        err
      );
    }
    const msg = (err.message || "").toLowerCase();
    if (msg.includes("pdf") || msg.includes("header") || msg.includes("parse")) {
      throw new DrawPdfError("Invalid or corrupted PDF file structure.", "CORRUPTED_PDF", err);
    }
    throw new DrawPdfError(err.message || "Failed to parse PDF metadata.", "CORRUPTED_PDF", err);
  }
};

/**
 * Sanitizes an output filename for the annotated PDF.
 * @param {string} [originalName="document.pdf"]
 * @returns {string}
 */
export const sanitizeAnnotatedFilename = (originalName = "document.pdf") => {
  if (!originalName || typeof originalName !== "string") {
    return "document-annotated.pdf";
  }
  const baseName = originalName
    .replace(/\.pdf$/i, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return `${baseName || "document"}-annotated.pdf`;
};

/**
 * Filters out deleted annotations or eraser objects from the active annotation list.
 *
 * @param {Array<Object>} annotations
 * @returns {Array<Object>}
 */
export const filterActiveAnnotations = (annotations = []) => {
  if (!Array.isArray(annotations)) return [];
  return annotations.filter(
    (item) => item && !item.deleted && item.type !== "eraser"
  );
};

/**
 * Exports user annotations onto the original PDF pages as vector graphics using pdf-lib.
 * Preserves existing text, fonts, images, hyperlinks, and page layout without page rasterization.
 *
 * @param {Object} params
 * @param {File|Blob|ArrayBuffer|Uint8Array} params.pdfInput - Input PDF file bytes
 * @param {Record<number, Array<Object>>} [params.annotationsByPage={}] - Keyed by pageNumber (1-indexed)
 * @param {string} [params.filename="document.pdf"] - Original document filename
 * @param {Function} [params.onProgress=null] - Progress callback function
 * @param {AbortSignal} [params.signal=null] - AbortSignal for cancellation
 * @returns {Promise<{ success: boolean, pdfBytes: Uint8Array, pageCount: number, totalAnnotationsPlaced: number, filename: string }>}
 */
export const exportAnnotationsToPdf = async ({
  pdfInput,
  annotationsByPage = {},
  filename = "document.pdf",
  onProgress = null,
  signal = null
}) => {
  const reportProgress = (stage, progress = 0, total = 100, text = "") => {
    if (typeof onProgress === "function") {
      onProgress({ stage, progress, total, text });
    }
  };

  // Check cancellation before starting
  if (signal && signal.aborted) {
    throw new DrawPdfError("PDF export process was cancelled.", "CANCELLED");
  }

  reportProgress("initializing", 5, 100, "Initializing PDF export engine...");

  // Normalize input PDF bytes defensively
  const inputBytes = await normalizeToUint8Array(pdfInput);

  if (signal && signal.aborted) {
    throw new DrawPdfError("PDF export process was cancelled.", "CANCELLED");
  }

  reportProgress("loading", 15, 100, "Loading PDF document binary...");

  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(inputBytes, { ignoreEncryption: false });
  } catch (err) {
    if (isPasswordProtectedError(err)) {
      throw new DrawPdfError(
        "This PDF is password-protected. Please unlock it using our Unlock PDF tool first.",
        "PASSWORD_PROTECTED",
        err
      );
    }
    throw new DrawPdfError("Failed to parse PDF document for export.", "CORRUPTED_PDF", err);
  }

  const pageCount = pdfDoc.getPageCount();
  const pages = pdfDoc.getPages();

  if (signal && signal.aborted) {
    throw new DrawPdfError("PDF export process was cancelled.", "CANCELLED");
  }

  reportProgress("parsing", 30, 100, "Embedding typography fonts...");

  // Embed standard Helvetica fonts for text annotations
  const fonts = {
    Helvetica: await pdfDoc.embedFont(StandardFonts.Helvetica),
    HelveticaBold: await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  };

  let totalAnnotationsPlaced = 0;

  reportProgress("processing", 40, 100, "Applying vector annotations to PDF pages...");

  // Iterate over each page in the document
  for (let p = 1; p <= pageCount; p++) {
    if (signal && signal.aborted) {
      throw new DrawPdfError("PDF export process was cancelled.", "CANCELLED");
    }

    const pageAnnotations = filterActiveAnnotations(annotationsByPage[p] || []);
    if (pageAnnotations.length === 0) continue;

    const page = pages[p - 1];
    const { width: pdfPageWidth, height: pdfPageHeight } = page.getSize();
    const rotation = page.getRotation().angle || 0;

    for (const item of pageAnnotations) {
      if (signal && signal.aborted) {
        throw new DrawPdfError("PDF export process was cancelled.", "CANCELLED");
      }

      if (!item || !item.type) continue;

      const previewW = item.previewWidth || pdfPageWidth;
      const previewH = item.previewHeight || pdfPageHeight;
      const opacity = typeof item.opacity === "number" ? Math.max(0, Math.min(1, item.opacity)) : 1.0;
      const strokeWidth = item.strokeWidth || 2;
      const strokeRgb = hexToNormalizedRgb(item.color || "#000000");
      const colorObj = rgb(strokeRgb.r, strokeRgb.g, strokeRgb.b);

      const fillRgb = item.fillColor ? hexToNormalizedRgb(item.fillColor) : null;
      const fillColorObj = fillRgb ? rgb(fillRgb.r, fillRgb.g, fillRgb.b) : undefined;

      // 1. FREEHAND PEN & HIGHLIGHTER ANNOTATIONS
      if (item.type === "pen" || item.type === "highlighter") {
        if (!item.points || item.points.length === 0) continue;

        // Convert points from screen preview space to unrotated PDF page coordinates
        const pdfPoints = item.points.map((pt) =>
          screenToPdfPoint({
            screenX: pt.x,
            screenY: pt.y,
            previewWidth: previewW,
            previewHeight: previewH,
            pdfPageWidth,
            pdfPageHeight,
            rotation
          })
        );

        if (pdfPoints.length === 1) {
          // Single point dot
          page.drawEllipse({
            x: pdfPoints[0].x,
            y: pdfPoints[0].y,
            xScale: strokeWidth / 2,
            yScale: strokeWidth / 2,
            color: colorObj,
            opacity: item.type === "highlighter" ? (item.opacity || 0.35) : opacity
          });
        } else if (pdfPoints.length === 2) {
          // 2 points line segment
          page.drawLine({
            start: pdfPoints[0],
            end: pdfPoints[1],
            thickness: strokeWidth,
            color: colorObj,
            opacity: item.type === "highlighter" ? (item.opacity || 0.35) : opacity
          });
        } else {
          // Multi-point freehand curve using pdf-lib drawSvgPath or line segments
          const svgPathStr = pointsToSvgPath(pdfPoints);
          page.drawSvgPath(svgPathStr, {
            x: 0,
            y: 0,
            borderColor: colorObj,
            borderWidth: strokeWidth,
            opacity: item.type === "highlighter" ? (item.opacity || 0.35) : opacity
          });
        }

        totalAnnotationsPlaced++;
      }

      // 2. LINE ANNOTATION
      else if (item.type === "line") {
        const startPt = screenToPdfPoint({
          screenX: item.x || item.startX || 0,
          screenY: item.y || item.startY || 0,
          previewWidth: previewW,
          previewHeight: previewH,
          pdfPageWidth,
          pdfPageHeight,
          rotation
        });

        const endPt = screenToPdfPoint({
          screenX: (item.x || 0) + (item.width || item.endX || 0),
          screenY: (item.y || 0) + (item.height || item.endY || 0),
          previewWidth: previewW,
          previewHeight: previewH,
          pdfPageWidth,
          pdfPageHeight,
          rotation
        });

        page.drawLine({
          start: startPt,
          end: endPt,
          thickness: strokeWidth,
          color: colorObj,
          opacity
        });

        totalAnnotationsPlaced++;
      }

      // 3. ARROW ANNOTATION
      else if (item.type === "arrow") {
        const startPt = screenToPdfPoint({
          screenX: item.x || item.startX || 0,
          screenY: item.y || item.startY || 0,
          previewWidth: previewW,
          previewHeight: previewH,
          pdfPageWidth,
          pdfPageHeight,
          rotation
        });

        const endPt = screenToPdfPoint({
          screenX: (item.x || 0) + (item.width || item.endX || 0),
          screenY: (item.y || 0) + (item.height || item.endY || 0),
          previewWidth: previewW,
          previewHeight: previewH,
          pdfPageWidth,
          pdfPageHeight,
          rotation
        });

        // Draw main line
        page.drawLine({
          start: startPt,
          end: endPt,
          thickness: strokeWidth,
          color: colorObj,
          opacity
        });

        // Draw arrowhead arms
        const arrowGeo = calculateArrowGeometry({
          startX: startPt.x,
          startY: startPt.y,
          endX: endPt.x,
          endY: endPt.y,
          arrowSize: Math.max(10, strokeWidth * 3)
        });

        page.drawLine({
          start: endPt,
          end: arrowGeo.arrowLeft,
          thickness: strokeWidth,
          color: colorObj,
          opacity
        });

        page.drawLine({
          start: endPt,
          end: arrowGeo.arrowRight,
          thickness: strokeWidth,
          color: colorObj,
          opacity
        });

        totalAnnotationsPlaced++;
      }

      // 4. RECTANGLE ANNOTATION
      else if (item.type === "rectangle") {
        const normRect = normalizeRectangle({
          x: item.x || 0,
          y: item.y || 0,
          width: item.width || 0,
          height: item.height || 0
        });

        const topLeftPt = screenToPdfPoint({
          screenX: normRect.x,
          screenY: normRect.y,
          previewWidth: previewW,
          previewHeight: previewH,
          pdfPageWidth,
          pdfPageHeight,
          rotation
        });

        const bottomRightPt = screenToPdfPoint({
          screenX: normRect.x + normRect.width,
          screenY: normRect.y + normRect.height,
          previewWidth: previewW,
          previewHeight: previewH,
          pdfPageWidth,
          pdfPageHeight,
          rotation
        });

        const pdfX = Math.min(topLeftPt.x, bottomRightPt.x);
        const pdfY = Math.min(topLeftPt.y, bottomRightPt.y);
        const pdfW = Math.abs(topLeftPt.x - bottomRightPt.x);
        const pdfH = Math.abs(topLeftPt.y - bottomRightPt.y);

        page.drawRectangle({
          x: pdfX,
          y: pdfY,
          width: pdfW,
          height: pdfH,
          borderColor: colorObj,
          borderWidth: strokeWidth,
          color: fillColorObj,
          opacity
        });

        totalAnnotationsPlaced++;
      }

      // 5. CIRCLE / ELLIPSE ANNOTATION
      else if (item.type === "circle" || item.type === "ellipse") {
        const normRect = normalizeRectangle({
          x: item.x || 0,
          y: item.y || 0,
          width: item.width || 0,
          height: item.height || 0
        });

        const topLeftPt = screenToPdfPoint({
          screenX: normRect.x,
          screenY: normRect.y,
          previewWidth: previewW,
          previewHeight: previewH,
          pdfPageWidth,
          pdfPageHeight,
          rotation
        });

        const bottomRightPt = screenToPdfPoint({
          screenX: normRect.x + normRect.width,
          screenY: normRect.y + normRect.height,
          previewWidth: previewW,
          previewHeight: previewH,
          pdfPageWidth,
          pdfPageHeight,
          rotation
        });

        const pdfW = Math.abs(topLeftPt.x - bottomRightPt.x);
        const pdfH = Math.abs(topLeftPt.y - bottomRightPt.y);
        const pdfCx = Math.min(topLeftPt.x, bottomRightPt.x) + pdfW / 2;
        const pdfCy = Math.min(topLeftPt.y, bottomRightPt.y) + pdfH / 2;

        page.drawEllipse({
          x: pdfCx,
          y: pdfCy,
          xScale: pdfW / 2,
          yScale: pdfH / 2,
          borderColor: colorObj,
          borderWidth: strokeWidth,
          color: fillColorObj,
          opacity
        });

        totalAnnotationsPlaced++;
      }

      // 6. TEXT ANNOTATION
      else if (item.type === "text") {
        const textContent = item.text || "";
        if (!textContent.trim()) continue;

        const fontSize = item.fontSize || 14;
        const font = item.isBold ? fonts.HelveticaBold : fonts.Helvetica;

        const pdfPt = screenToPdfPoint({
          screenX: item.x || 0,
          screenY: item.y || 0,
          previewWidth: previewW,
          previewHeight: previewH,
          pdfPageWidth,
          pdfPageHeight,
          rotation
        });

        const lines = textContent.split("\n");
        let currentY = pdfPt.y - fontSize;

        for (const line of lines) {
          if (line) {
            page.drawText(line, {
              x: pdfPt.x,
              y: currentY,
              size: fontSize,
              font,
              color: colorObj,
              opacity
            });
          }
          currentY -= fontSize * 1.2;
        }

        totalAnnotationsPlaced++;
      }
    }
  }

  if (signal && signal.aborted) {
    throw new DrawPdfError("PDF export process was cancelled.", "CANCELLED");
  }

  reportProgress("exporting", 80, 100, "Saving annotated PDF binary...");

  let exportedBytes;
  try {
    exportedBytes = await pdfDoc.save();
  } catch (err) {
    throw new DrawPdfError("Failed to serialize exported PDF document.", "EXPORT_FAILED", err);
  }

  reportProgress("validating", 90, 100, "Verifying exported document integrity...");

  // Validate output by attempting to reload it with PDFDocument.load
  if (!exportedBytes || exportedBytes.length === 0) {
    throw new DrawPdfError("Generated PDF binary is empty.", "EXPORT_FAILED");
  }

  try {
    const verifiedDoc = await PDFDocument.load(exportedBytes);
    if (verifiedDoc.getPageCount() !== pageCount) {
      throw new DrawPdfError(
        `Exported page count (${verifiedDoc.getPageCount()}) does not match original page count (${pageCount}).`,
        "EXPORT_FAILED"
      );
    }
  } catch (err) {
    throw new DrawPdfError("Exported PDF integrity check failed.", "EXPORT_FAILED", err);
  }

  reportProgress("complete", 100, 100, "PDF export complete.");

  const outputFilename = sanitizeAnnotatedFilename(filename);

  return {
    success: true,
    pdfBytes: exportedBytes,
    pageCount,
    totalAnnotationsPlaced,
    filename: outputFilename
  };
};
