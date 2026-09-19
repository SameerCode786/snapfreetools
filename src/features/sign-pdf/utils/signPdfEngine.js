import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import {
  screenToPdfCoords,
  hexToNormalizedRgb,
  formatDateValue
} from "./fieldCoordinateMath.js";

/**
 * Gets or initializes pdfjs-dist worker engine.
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
 * Parses basic metadata and dimensions from an uploaded PDF file.
 */
export const parsePdfMetadata = async (file) => {
  const pdfjs = await getPdfJsEngine();
  const rawArrayBuffer = await file.arrayBuffer();
  const pdfJsBytes = new Uint8Array(rawArrayBuffer.slice(0));

  let pdfDoc;
  try {
    pdfDoc = await pdfjs.getDocument({ data: pdfJsBytes }).promise;
  } catch (err) {
    if (isPasswordProtectedError(err)) {
      const customErr = new Error("This PDF is password-protected. Please unlock it using our Unlock PDF tool first.");
      customErr.isPasswordProtected = true;
      throw customErr;
    }
    throw err;
  }

  const pageCount = pdfDoc.numPages;
  const pageDimensions = [];

  for (let p = 1; p <= pageCount; p++) {
    const page = await pdfDoc.getPage(p);
    const viewport = page.getViewport({ scale: 1.0 });
    pageDimensions.push({
      pageNumber: p,
      width: viewport.width,
      height: viewport.height,
      rotation: viewport.rotation
    });
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: file.name,
    size: file.size,
    pageCount,
    pageDimensions,
    rawFile: file
  };
};

/**
 * Renders a single page canvas thumbnail or high-resolution preview and returns data URL.
 */
export const renderSinglePage = async (pdfDoc, pageNum, scale = 1.0) => {
  try {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport
    }).promise;

    const dataUrl = canvas.toDataURL("image/jpeg", scale > 1.0 ? 0.9 : 0.75);

    // Free canvas memory buffer
    canvas.width = 0;
    canvas.height = 0;

    return {
      dataUrl,
      width: viewport.width,
      height: viewport.height
    };
  } catch (err) {
    console.error(`Failed to render page ${pageNum}:`, err);
    return null;
  }
};

/**
 * Batch renders page thumbnails for multi-page document navigation strip.
 */
export const renderPageThumbnailsBatch = async (file, scale = 0.25, onProgress = null) => {
  const pdfjs = await getPdfJsEngine();
  const rawFile = file.rawFile || file;
  const rawArrayBuffer = await rawFile.arrayBuffer();
  const pdfJsBytes = new Uint8Array(rawArrayBuffer.slice(0));

  const pdfDoc = await pdfjs.getDocument({ data: pdfJsBytes }).promise;
  const totalPages = pdfDoc.numPages;
  const thumbnails = [];

  for (let p = 1; p <= totalPages; p++) {
    const renderRes = await renderSinglePage(pdfDoc, p, scale);
    thumbnails.push({
      pageNumber: p,
      pageIndex: p - 1,
      thumbnailUrl: renderRes ? renderRes.dataUrl : null
    });

    if (onProgress) {
      onProgress({
        current: p,
        total: totalPages
      });
    }

    if (p % 5 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  return thumbnails;
};

/**
 * Maps browser preview coordinates (top-left origin) to PDF page coordinates (bottom-left origin).
 */
export const mapPreviewCoordsToPdfCoords = ({
  previewWidth,
  previewHeight,
  pdfPageWidth,
  pdfPageHeight,
  sigX,
  sigY,
  sigWidth,
  sigHeight,
  rotation = 0
}) => {
  return screenToPdfCoords({
    screenX: sigX,
    screenY: sigY,
    screenWidth: sigWidth,
    screenHeight: sigHeight,
    previewWidth,
    previewHeight,
    pdfPageWidth,
    pdfPageHeight,
    rotation
  });
};

/**
 * Converts a data URL into a Uint8Array byte buffer.
 */
export const dataUrlToUint8Array = (dataUrl) => {
  const base64 = dataUrl.split(",")[1];
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Sanitizes output filename (e.g. "contract-signed.pdf").
 */
export const sanitizeSignedFilename = (originalName = "document.pdf") => {
  const baseName = originalName.replace(/\.pdf$/i, "").replace(/[^\w\s-]/gi, "");
  return `${baseName || "document"}-signed.pdf`;
};

/**
 * Helper to wrap text into multiple lines given a max width and font size.
 */
function wrapText(text, font, fontSize, maxWidth) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (testWidth <= maxWidth || !currentLine) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Executes PDF signing & field placement entirely in the browser using pdf-lib.
 * Preserves original PDF text, vectors, images, and structure without rasterization.
 *
 * @param {Object} params
 * @param {File|Object} params.file - The uploaded PDF file metadata/rawFile
 * @param {Record<number, Array<Object>>} [params.fieldsByPage] - Fields keyed by pageNumber (1-indexed)
 * @param {Record<number, Array<Object>>} [params.signaturesByPage] - Backward compatible fallback
 * @param {Function} [params.onProgress] - Progress callback
 * @returns {Promise<Object>} Result object with downloadUrl, blob, metadata
 */
export const executePdfSigning = async ({
  file,
  fieldsByPage = {},
  signaturesByPage = {},
  onProgress = null
}) => {
  const rawFile = file.rawFile || (file instanceof File || file instanceof Blob ? file : null);

  let rawArrayBuffer;
  if (rawFile && typeof rawFile.arrayBuffer === "function") {
    rawArrayBuffer = await rawFile.arrayBuffer();
  } else if (file.arrayBuffer && typeof file.arrayBuffer === "function") {
    rawArrayBuffer = await file.arrayBuffer();
  } else {
    throw new Error("Unable to read valid PDF binary data.");
  }

  const pdfLibBytes = new Uint8Array(rawArrayBuffer.slice(0));

  if (onProgress) onProgress("Reading PDF structure...");
  const pdfDoc = await PDFDocument.load(pdfLibBytes, { ignoreEncryption: false });
  const totalPages = pdfDoc.getPageCount();
  const pages = pdfDoc.getPages();

  if (onProgress) onProgress("Embedding fonts and field assets...");
  
  // Embed standard typography fonts
  const fonts = {
    Helvetica: await pdfDoc.embedFont(StandardFonts.Helvetica),
    HelveticaBold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    Times: await pdfDoc.embedFont(StandardFonts.TimesRoman),
    Courier: await pdfDoc.embedFont(StandardFonts.Courier)
  };

  // Cache embedded signature/stamp images by data URL to avoid redundant embedding
  const imageCache = new Map();

  let totalFieldsPlaced = 0;
  const modifiedPagesSet = new Set();

  // Merge fieldsByPage and legacy signaturesByPage
  const activeFieldsByPage = { ...signaturesByPage, ...fieldsByPage };

  for (const [pageNumStr, fieldList] of Object.entries(activeFieldsByPage)) {
    const pageNum = parseInt(pageNumStr, 10);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) continue;

    const page = pages[pageNum - 1];
    const { width: pdfPageWidth, height: pdfPageHeight } = page.getSize();

    if (fieldList && fieldList.length > 0) {
      modifiedPagesSet.add(pageNum);

      for (const field of fieldList) {
        const fieldType = field.type || "signature";

        // Map preview coordinates to PDF coordinates
        const mapped = screenToPdfCoords({
          screenX: field.x,
          screenY: field.y,
          screenWidth: field.width,
          screenHeight: field.height,
          previewWidth: field.previewWidth,
          previewHeight: field.previewHeight,
          pdfPageWidth,
          pdfPageHeight,
          rotation: field.rotation || 0
        });

        // 1. IMAGE-BASED FIELDS: Signature, Initials, Company Stamp
        if (fieldType === "signature" || fieldType === "initials" || fieldType === "stamp") {
          if (!field.dataUrl) continue;

          let embeddedImage = imageCache.get(field.dataUrl);
          if (!embeddedImage) {
            const imageBytes = dataUrlToUint8Array(field.dataUrl);
            // Check if PNG or JPG
            if (field.dataUrl.startsWith("data:image/jpeg") || field.dataUrl.startsWith("data:image/jpg")) {
              embeddedImage = await pdfDoc.embedJpg(imageBytes);
            } else {
              embeddedImage = await pdfDoc.embedPng(imageBytes);
            }
            imageCache.set(field.dataUrl, embeddedImage);
          }

          page.drawImage(embeddedImage, {
            x: mapped.x,
            y: mapped.y,
            width: mapped.width,
            height: mapped.height,
            rotate: degrees(mapped.rotation || 0),
            opacity: typeof field.opacity === "number" ? field.opacity : 1.0
          });

          totalFieldsPlaced++;
        }

        // 2. NAME FIELD
        else if (fieldType === "name") {
          const font = fonts[field.style?.fontFamily] || fonts.Helvetica;
          const fontSize = field.style?.fontSize || 12;
          const colorObj = hexToNormalizedRgb(field.style?.color || "#0f172a");
          const textColor = rgb(colorObj.r, colorObj.g, colorObj.b);
          const nameText = field.value || "Your Name";

          const textWidth = font.widthOfTextAtSize(nameText, fontSize);
          let textX = mapped.x;
          if (field.style?.align === "center") {
            textX = mapped.x + Math.max(0, (mapped.width - textWidth) / 2);
          } else if (field.style?.align === "right") {
            textX = mapped.x + Math.max(0, mapped.width - textWidth);
          }

          // In PDF text drawing, Y is baseline
          const textY = mapped.y + Math.max(2, (mapped.height - fontSize) / 2);

          page.drawText(nameText, {
            x: textX,
            y: textY,
            size: fontSize,
            font,
            color: textColor
          });

          totalFieldsPlaced++;
        }

        // 3. DATE FIELD
        else if (fieldType === "date") {
          const font = fonts.Helvetica;
          const fontSize = field.style?.fontSize || 11;
          const colorObj = hexToNormalizedRgb(field.style?.color || "#0f172a");
          const textColor = rgb(colorObj.r, colorObj.g, colorObj.b);
          const dateText = formatDateValue(field.value || new Date(), field.style?.dateFormat || "YYYY-MM-DD");

          const textWidth = font.widthOfTextAtSize(dateText, fontSize);
          let textX = mapped.x;
          if (field.style?.align === "center") {
            textX = mapped.x + Math.max(0, (mapped.width - textWidth) / 2);
          } else if (field.style?.align === "right") {
            textX = mapped.x + Math.max(0, mapped.width - textWidth);
          }

          const textY = mapped.y + Math.max(2, (mapped.height - fontSize) / 2);

          page.drawText(dateText, {
            x: textX,
            y: textY,
            size: fontSize,
            font,
            color: textColor
          });

          totalFieldsPlaced++;
        }

        // 4. GENERAL TEXT FIELD
        else if (fieldType === "text") {
          const font = fonts[field.style?.fontFamily] || fonts.Helvetica;
          const fontSize = field.style?.fontSize || 12;
          const colorObj = hexToNormalizedRgb(field.style?.color || "#0f172a");
          const textColor = rgb(colorObj.r, colorObj.g, colorObj.b);
          const rawText = field.value || "";

          if (rawText.trim()) {
            const lineHeight = fontSize * 1.25;
            // Split raw paragraphs first, then wrap words
            const paragraphs = rawText.split("\n");
            const allLines = [];
            for (const p of paragraphs) {
              const wrapped = wrapText(p, font, fontSize, mapped.width);
              if (wrapped.length > 0) {
                allLines.push(...wrapped);
              } else {
                allLines.push(""); // blank line
              }
            }

            let lineY = mapped.y + mapped.height - fontSize;
            for (const line of allLines) {
              if (lineY < mapped.y - fontSize) break; // Avoid overflowing bottom
              if (line) {
                const textWidth = font.widthOfTextAtSize(line, fontSize);
                let textX = mapped.x;
                if (field.style?.align === "center") {
                  textX = mapped.x + Math.max(0, (mapped.width - textWidth) / 2);
                } else if (field.style?.align === "right") {
                  textX = mapped.x + Math.max(0, mapped.width - textWidth);
                }

                page.drawText(line, {
                  x: textX,
                  y: lineY,
                  size: fontSize,
                  font,
                  color: textColor
                });
              }
              lineY -= lineHeight;
            }
          }

          totalFieldsPlaced++;
        }
      }
    }
  }

  if (onProgress) onProgress("Saving signed PDF document...");
  const signedBytes = await pdfDoc.save();

  if (onProgress) onProgress("Finalizing document...");
  const blob = new Blob([signedBytes], { type: "application/pdf" });
  const downloadUrl = URL.createObjectURL(blob);
  const filename = sanitizeSignedFilename(file.name);

  return {
    filename,
    outputFilename: filename,
    downloadUrl,
    blob,
    originalSize: file.size || rawArrayBuffer.byteLength,
    signedSize: blob.size,
    totalPages,
    signedPageCount: modifiedPagesSet.size,
    totalSignaturesPlaced: totalFieldsPlaced,
    totalFieldsPlaced,
    originalName: file.name
  };
};
