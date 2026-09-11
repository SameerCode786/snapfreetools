import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

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
 * Helper to identify password-protected or encrypted PDF errors from PDF.js or pdf-lib.
 */
export const isPasswordProtectedError = (err) => {
  if (!err) return false;
  if (err.name === "PasswordException" || err.name === "EncryptedPDFError") return true;
  if (err.code === 1 || err.code === 2) return true; // PDFJS PasswordResponses: NEED_PASSWORD / INCORRECT_PASSWORD
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
 * Parses basic metadata from an uploaded PDF file.
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
 * Numbering Style Converters (Arabic, Roman, Letter).
 */
export const toRomanLower = (num) => {
  const lookup = { m: 1000, cm: 900, d: 500, cd: 400, c: 100, xc: 90, l: 50, xl: 40, x: 10, ix: 9, v: 5, iv: 4, i: 1 };
  let roman = "";
  let n = Math.max(1, Math.floor(num));
  for (let i in lookup) {
    while (n >= lookup[i]) {
      roman += i;
      n -= lookup[i];
    }
  }
  return roman;
};

export const toRomanUpper = (num) => toRomanLower(num).toUpperCase();

export const toLetterLower = (num) => {
  let n = Math.max(1, Math.floor(num));
  let result = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    result = String.fromCharCode(97 + rem) + result;
    n = Math.floor((n - 1) / 26);
  }
  return result;
};

export const toLetterUpper = (num) => toLetterLower(num).toUpperCase();

export const formatNumberByStyle = (num, style = "arabic") => {
  const n = Math.max(1, Math.floor(num));
  switch (style) {
    case "roman-lower":
      return toRomanLower(n);
    case "roman-upper":
      return toRomanUpper(n);
    case "letter-lower":
      return toLetterLower(n);
    case "letter-upper":
      return toLetterUpper(n);
    case "arabic":
    default:
      return n.toString();
  }
};

/**
 * Page number text formatter.
 */
export const buildPageNumberText = ({
  num,
  total,
  format = "arabic", // 'arabic' | 'prefixed' | 'page-x-of-n' | 'x-slash-n' | 'custom'
  style = "arabic", // 'arabic' | 'roman-lower' | 'roman-upper' | 'letter-lower' | 'letter-upper'
  customTemplate = "Page {page} of {total}"
}) => {
  const numStr = formatNumberByStyle(num, style);
  const totalStr = formatNumberByStyle(total, style);

  switch (format) {
    case "prefixed":
      return `Page ${numStr}`;
    case "page-x-of-n":
      return `Page ${numStr} of ${totalStr}`;
    case "x-slash-n":
      return `${numStr} / ${totalStr}`;
    case "custom":
      return (customTemplate || "Page {page} of {total}")
        .replace(/\{page\}/gi, numStr)
        .replace(/\{total\}/gi, totalStr);
    case "arabic":
    default:
      return numStr;
  }
};

/**
 * Parses page range string and accounts for skipFirstN pages.
 */
export const parseNumberingRange = ({ totalPages, skipFirstN = 0, rangeMode = "all", specificPagesStr = "" }) => {
  const skipCount = Math.max(0, Math.min(skipFirstN, totalPages));
  let candidateIndices = [];

  if (rangeMode === "all") {
    candidateIndices = Array.from({ length: totalPages }, (_, i) => i);
  } else {
    const parts = specificPagesStr.split(",").map(s => s.trim()).filter(Boolean);
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

    candidateIndices = Array.from(selectedIndicesSet).sort((a, b) => a - b);
    var invalidPages = Array.from(invalidPagesSet).sort((a, b) => a - b);
  }

  // Filter out skipped pages
  const validIndices = candidateIndices.filter(idx => idx >= skipCount);
  const skippedIndices = candidateIndices.filter(idx => idx < skipCount);

  let warningMessage = null;
  let errorMessage = null;

  if (invalidPages && invalidPages.length > 0) {
    warningMessage = `Page ${invalidPages.join(", ")} ${invalidPages.length === 1 ? "is" : "are"} out of bounds (document has ${totalPages} ${totalPages === 1 ? "page" : "pages"}).`;
  }

  if (validIndices.length === 0) {
    errorMessage = `No valid pages selected for numbering. Total pages: ${totalPages}, Skipped first: ${skipCount}.`;
  }

  return {
    validIndices,
    skippedIndices,
    invalidPages: invalidPages || [],
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
 * Map font name to pdf-lib StandardFonts.
 */
export const fontNameToPdfFont = (fontName = "helvetica") => {
  switch (fontName) {
    case "helvetica-bold":
      return StandardFonts.HelveticaBold;
    case "helvetica-oblique":
      return StandardFonts.HelveticaOblique;
    case "times":
      return StandardFonts.TimesRoman;
    case "courier":
      return StandardFonts.Courier;
    case "helvetica":
    default:
      return StandardFonts.Helvetica;
  }
};

/**
 * Calculate (x, y) coordinates for page numbers on dynamic page sizes.
 */
export const calculatePageNumberPosition = ({ position, pageWidth, pageHeight, textWidth, textHeight, marginX = 30, marginY = 30 }) => {
  let x = (pageWidth - textWidth) / 2;
  let y = marginY;

  switch (position) {
    case "bottom-left":
      x = marginX;
      y = marginY;
      break;
    case "bottom-right":
      x = pageWidth - textWidth - marginX;
      y = marginY;
      break;
    case "bottom-center":
      x = (pageWidth - textWidth) / 2;
      y = marginY;
      break;
    case "top-left":
      x = marginX;
      y = pageHeight - textHeight - marginY;
      break;
    case "top-right":
      x = pageWidth - textWidth - marginX;
      y = pageHeight - textHeight - marginY;
      break;
    case "top-center":
      x = (pageWidth - textWidth) / 2;
      y = pageHeight - textHeight - marginY;
      break;
  }

  // Safety clamp to ensure text stays inside page bounds
  const clampedX = Math.max(10, Math.min(pageWidth - textWidth - 10, x));
  const clampedY = Math.max(10, Math.min(pageHeight - textHeight - 10, y));

  return { x: clampedX, y: clampedY };
};

/**
 * Sanitize output filename (e.g. numbered-document.pdf)
 */
export const sanitizeNumberedFilename = (originalName) => {
  if (!originalName) return "numbered-document.pdf";
  const lastDot = originalName.lastIndexOf(".");
  if (lastDot === -1) return `${originalName}-numbered.pdf`;
  const name = originalName.substring(0, lastDot);
  return `${name}-numbered.pdf`;
};

/**
 * Executes PDF Page Numbering natively using pdf-lib.
 * Modifies pages structurally with zero rasterization.
 */
export const executeAddPageNumbers = async ({
  file,
  format = "arabic",
  style = "arabic",
  customTemplate = "Page {page} of {total}",
  startNumber = 1,
  skipFirstN = 0,
  rangeMode = "all",
  specificPagesStr = "",
  totalSemantics = "document", // 'document' | 'numbered'
  position = "bottom-center",
  fontName = "helvetica",
  fontSize = 12,
  color = "#374151",
  opacity = 1.0,
  marginX = 30,
  marginY = 30,
  bgBoxType = "none", // 'none' | 'white' | 'semi-white' | 'custom'
  bgBoxColor = "#FFFFFF",
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
    throw new Error("Unable to read valid PDF bytes for page numbering.");
  }

  // Independent byte copy dedicated to pdf-lib
  const pdfLibBytes = new Uint8Array(rawArrayBuffer.slice(0));

  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(pdfLibBytes, { ignoreEncryption: false });
  } catch (err) {
    if (isPasswordProtectedError(err)) {
      const customErr = new Error("This PDF is password-protected. Please unlock it using our Unlock PDF tool first.");
      customErr.isPasswordProtected = true;
      throw customErr;
    }
    throw err;
  }

  const totalPages = pdfDoc.getPageCount();

  // Validate Page Numbering Range & Skip Pages
  const rangeResult = parseNumberingRange({
    totalPages,
    skipFirstN,
    rangeMode,
    specificPagesStr
  });

  if (rangeResult.errorMessage) {
    throw new Error(rangeResult.errorMessage);
  }

  const validIndices = rangeResult.validIndices;

  if (onProgress) onProgress("Preparing font and page numbering configuration...");

  const stdFontEnum = fontNameToPdfFont(fontName);
  const embeddedFont = await pdfDoc.embedFont(stdFontEnum);
  const textColorObj = hexToPdfColor(color);

  const totalForDisplay = totalSemantics === "numbered" ? validIndices.length : totalPages;
  const pages = pdfDoc.getPages();

  if (onProgress) onProgress(`Numbering pages (0 of ${validIndices.length})...`);

  validIndices.forEach((pageIndex, sequenceIndex) => {
    if (onProgress && sequenceIndex % 10 === 0) {
      onProgress(`Processing page ${sequenceIndex + 1} of ${validIndices.length}...`);
    }

    const page = pages[pageIndex];
    const { width: pageWidth, height: pageHeight } = page.getSize();

    const currentPrintNum = startNumber + sequenceIndex;
    const pageText = buildPageNumberText({
      num: currentPrintNum,
      total: totalForDisplay,
      format,
      style,
      customTemplate
    });

    const textWidth = embeddedFont.widthOfTextAtSize(pageText, fontSize);
    const textHeight = embeddedFont.heightAtSize(fontSize);

    const { x, y } = calculatePageNumberPosition({
      position,
      pageWidth,
      pageHeight,
      textWidth,
      textHeight,
      marginX,
      marginY
    });

    // Optional Background Knockout Box
    if (bgBoxType !== "none") {
      const paddingX = 6;
      const paddingY = 4;
      let boxColorObj = rgb(1, 1, 1);
      let boxOpacity = 1.0;

      if (bgBoxType === "semi-white") {
        boxOpacity = 0.75;
      } else if (bgBoxType === "custom") {
        boxColorObj = hexToPdfColor(bgBoxColor);
      }

      page.drawRectangle({
        x: x - paddingX,
        y: y - paddingY,
        width: textWidth + paddingX * 2,
        height: textHeight + paddingY * 2,
        color: boxColorObj,
        opacity: boxOpacity
      });
    }

    // Draw Page Number Text
    page.drawText(pageText, {
      x,
      y,
      size: fontSize,
      font: embeddedFont,
      color: textColorObj,
      opacity
    });
  });

  if (onProgress) onProgress("Saving numbered PDF document...");

  const pdfBytes = await pdfDoc.save();

  if (onProgress) onProgress("Finalizing document...");

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const downloadUrl = URL.createObjectURL(blob);
  const filename = sanitizeNumberedFilename(file.name);

  return {
    filename,
    outputFilename: filename,
    downloadUrl,
    blob,
    originalPageCount: totalPages,
    numberedPageCount: validIndices.length,
    warningMessage: rangeResult.warningMessage,
    formatApplied: format,
    startingNumber: startNumber,
    positionApplied: position,
    originalName: file.name
  };
};
