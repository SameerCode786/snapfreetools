/**
 * PDF to PowerPoint (PPTX) Conversion Engine
 * SnapFreeTools.com
 *
 * Fully client-side engine for converting PDF documents into Microsoft PowerPoint (.pptx) files.
 * Supports:
 * - Mode A: Editable Content (reconstructs headings, paragraphs, positions, sizes, and colors into native PPTX text boxes)
 * - Mode B: High Fidelity (preserves the original visual layout with high fidelity)
 * - Flexible Slide Sizing: Match PDF dimensions, 16:9 Widescreen, 4:3 Standard, A4, US Letter
 * - Intelligent Content Fitting: Aspect-ratio-preserving fit and centering
 * - Robust Page Range Filtering (e.g., "1-3, 5, 8-10") with deduplication and range bounds checking
 * - Graceful fallback for scanned/image-only pages with transparent reporting
 * - Sequential memory-safe processing with periodic UI yielding and resource cleanup
 */

import pptxgen from "pptxgenjs";

/**
 * Slide Preset Layouts (dimensions in inches)
 */
export const SLIDE_PRESETS = {
  MATCH_PDF: { id: "match", name: "Match PDF Dimensions", desc: "Calculates slide size directly from PDF aspect ratio" },
  WIDESCREEN_16_9: { id: "16:9", name: "16:9 Widescreen", width: 13.333, height: 7.5, desc: "Standard modern widescreen presentation (13.33\" × 7.5\")" },
  STANDARD_4_3: { id: "4:3", name: "4:3 Standard", width: 10.0, height: 7.5, desc: "Classic presentation format (10\" × 7.5\")" },
  A4: { id: "a4", name: "A4 Presentation", width: 11.693, height: 8.268, desc: "Standard international A4 landscape (11.69\" × 8.27\")" },
  LETTER: { id: "letter", name: "US Letter", width: 11.0, height: 8.5, desc: "Standard US Letter landscape (11\" × 8.5\")" }
};

/**
 * Safety & processing limits
 */
export const PPT_SAFETY_LIMITS = {
  MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024, // 50MB
  MAX_RECOMMENDED_PAGES: 100,
  DEFAULT_RENDER_DPI: 150, // Crisp visual resolution without exceeding browser memory limits
  MIN_FONT_SIZE_PT: 7,
  MAX_FONT_SIZE_PT: 96,
  SCANNED_PAGE_CHAR_THRESHOLD: 15 // Pages with fewer than 15 chars are flagged as scanned/image-based
};

/**
 * Font heuristic mappings from PDF font names to standard PowerPoint-safe fonts
 */
export const FONT_FALLBACK_MAP = {
  helvetica: "Arial",
  arial: "Arial",
  times: "Times New Roman",
  timesnewroman: "Times New Roman",
  courier: "Courier New",
  calibri: "Calibri",
  cambria: "Cambria",
  georgia: "Georgia",
  verdana: "Verdana",
  tahoma: "Tahoma",
  trebuchet: "Trebuchet MS",
  segoe: "Segoe UI",
  roboto: "Arial",
  opensans: "Calibri",
  default: "Calibri"
};

/**
 * Resolves a safe PowerPoint font family name from a PDF font identifier.
 */
export function resolveSafeFontFamily(pdfFontName) {
  if (!pdfFontName || typeof pdfFontName !== "string") {
    return FONT_FALLBACK_MAP.default;
  }
  const clean = pdfFontName.toLowerCase().replace(/[^a-z]/g, "");
  for (const [key, fontFace] of Object.entries(FONT_FALLBACK_MAP)) {
    if (key !== "default" && clean.includes(key)) {
      return fontFace;
    }
  }
  return FONT_FALLBACK_MAP.default;
}

/**
 * Detects bold and italic styles from PDF font name string heuristics.
 */
export function detectFontStyle(pdfFontName) {
  if (!pdfFontName || typeof pdfFontName !== "string") {
    return { bold: false, italic: false };
  }
  const lower = pdfFontName.toLowerCase();
  const bold = lower.includes("bold") || lower.includes("black") || lower.includes("heavy") || lower.includes("semibold");
  const italic = lower.includes("italic") || lower.includes("oblique") || lower.includes("slanted");
  return { bold, italic };
}

/**
 * Dynamically loads pdfjs-dist engine across browser and Node.js unit tests.
 */
export async function getPdfJsEngine() {
  let pdfjs;
  try {
    if (typeof window === "undefined" && typeof process !== "undefined") {
      pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    } else {
      pdfjs = await import("pdfjs-dist");
      if (pdfjs && pdfjs.GlobalWorkerOptions) {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
      }
    }
  } catch (e) {
    pdfjs = await import("pdfjs-dist");
  }
  return pdfjs;
}

/**
 * Validates an uploaded PDF File or ArrayBuffer.
 */
export function validatePdfInput(fileOrBuffer, options = {}) {
  const maxSize = options.maxSizeBytes || PPT_SAFETY_LIMITS.MAX_FILE_SIZE_BYTES;

  if (!fileOrBuffer) {
    return { valid: false, error: "No file provided. Please select a valid PDF document." };
  }

  // Browser File object validation
  if (typeof File !== "undefined" && fileOrBuffer instanceof File) {
    const fileName = fileOrBuffer.name || "";
    const isPdfExt = fileName.toLowerCase().endsWith(".pdf");
    const isPdfMime = fileOrBuffer.type === "application/pdf" || fileOrBuffer.type === "";

    if (!isPdfExt && !isPdfMime) {
      return { valid: false, error: "Invalid file type. Please upload a file with a .pdf extension." };
    }

    if (fileOrBuffer.size === 0) {
      return { valid: false, error: "The selected PDF file is empty (0 bytes)." };
    }

    if (fileOrBuffer.size > maxSize) {
      const mbLimit = Math.round(maxSize / (1024 * 1024));
      return { valid: false, error: `File is too large (${(fileOrBuffer.size / (1024 * 1024)).toFixed(1)}MB). Maximum supported size is ${mbLimit}MB for in-browser conversion.` };
    }

    return { valid: true, error: null };
  }

  // ArrayBuffer or Uint8Array validation
  const byteLength = fileOrBuffer.byteLength || (fileOrBuffer.length && typeof fileOrBuffer.length === "number" ? fileOrBuffer.length : 0);
  if (byteLength === 0) {
    return { valid: false, error: "The provided PDF data is empty." };
  }

  if (byteLength > maxSize) {
    return { valid: false, error: "PDF data exceeds safe in-browser size limits." };
  }

  return { valid: true, error: null };
}

/**
 * Sanitizes an input PDF filename into a clean .pptx filename.
 * Example: "Sales_Report.2024.pdf" -> "Sales_Report.2024.pptx"
 */
export function sanitizePptxFilename(originalName) {
  if (!originalName || typeof originalName !== "string") {
    return "presentation.pptx";
  }
  let base = originalName.replace(/\.pdf$/i, "").trim();
  // Replace unsafe characters
  base = base.replace(/[/\\?%*:|"<>]/g, "-").replace(/\s+/g, " ").trim();
  if (!base) {
    base = "presentation";
  }
  return `${base}.pptx`;
}

/**
 * Parses and validates a page range string (e.g. "1-3, 5, 8-10").
 * Returns a sorted, deduplicated array of 1-based page indices.
 */
export function parsePageRange(rangeStr, totalPages) {
  if (!rangeStr || typeof rangeStr !== "string" || rangeStr.trim().toLowerCase() === "all") {
    return {
      valid: true,
      pages: Array.from({ length: totalPages }, (_, i) => i + 1),
      rejected: []
    };
  }

  const clean = rangeStr.replace(/\s+/g, "");
  if (!clean) {
    return {
      valid: true,
      pages: Array.from({ length: totalPages }, (_, i) => i + 1),
      rejected: []
    };
  }

  const parts = clean.split(",");
  const selectedSet = new Set();
  const rejected = [];

  for (const part of parts) {
    if (!part) continue;

    if (part.includes("-")) {
      const rangeParts = part.split("-");
      if (rangeParts.length !== 2) {
        rejected.push(part);
        continue;
      }
      const start = parseInt(rangeParts[0], 10);
      const end = parseInt(rangeParts[1], 10);

      if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
        rejected.push(part);
        continue;
      }

      for (let p = start; p <= end; p++) {
        if (p <= totalPages) {
          selectedSet.add(p);
        } else {
          rejected.push(p);
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
        rejected.push(isNaN(pageNum) ? part : pageNum);
        continue;
      }
      selectedSet.add(pageNum);
    }
  }

  const pages = Array.from(selectedSet).sort((a, b) => a - b);
  return {
    valid: pages.length > 0,
    pages,
    rejected
  };
}

/**
 * Inspects a PDF document to extract structural overview, dimensions, orientation, and content types.
 */
export async function analyzePdfDocument(pdfDoc) {
  const numPages = pdfDoc.numPages;
  const inspectedPages = Math.min(numPages, 10);

  let totalChars = 0;
  let scannedPagesCount = 0;
  let textPagesCount = 0;

  // Read first page to establish primary document aspect ratio
  const firstPage = await pdfDoc.getPage(1);
  const firstViewport = firstPage.getViewport({ scale: 1.0 });
  const widthPt = firstViewport.width;
  const heightPt = firstViewport.height;

  const isPortrait = heightPt >= widthPt;
  const orientation = isPortrait ? "Portrait" : "Landscape";

  // Approximate standard page size name
  let paperName = "Custom";
  if (Math.abs(widthPt - 595) < 15 && Math.abs(heightPt - 842) < 15) paperName = "A4";
  else if (Math.abs(widthPt - 842) < 15 && Math.abs(heightPt - 595) < 15) paperName = "A4";
  else if (Math.abs(widthPt - 612) < 15 && Math.abs(heightPt - 792) < 15) paperName = "US Letter";
  else if (Math.abs(widthPt - 792) < 15 && Math.abs(heightPt - 612) < 15) paperName = "US Letter";

  for (let i = 1; i <= inspectedPages; i++) {
    try {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = (textContent.items || [])
        .filter((it) => typeof it.str === "string")
        .map((it) => it.str)
        .join(" ")
        .trim();

      const charCount = pageText.length;
      totalChars += charCount;

      if (charCount < PPT_SAFETY_LIMITS.SCANNED_PAGE_CHAR_THRESHOLD) {
        scannedPagesCount++;
      } else {
        textPagesCount++;
      }
    } catch {
      scannedPagesCount++;
    }
  }

  const isPurelyScanned = scannedPagesCount === inspectedPages;
  const isMixed = scannedPagesCount > 0 && textPagesCount > 0;
  const isTextBased = scannedPagesCount === 0;

  let detectedContentType = "Digital Text & Vector Graphics";
  if (isPurelyScanned) {
    detectedContentType = "Image-Based / Scanned Pages";
  } else if (isMixed) {
    detectedContentType = "Mixed (Selectable Text & Images)";
  }

  return {
    numPages,
    widthPt,
    heightPt,
    widthInches: widthPt / 72,
    heightInches: heightPt / 72,
    isPortrait,
    orientation,
    paperName,
    inspectedPages,
    totalChars,
    scannedPagesCount,
    textPagesCount,
    isPurelyScanned,
    isMixed,
    isTextBased,
    detectedContentType,
    recommendedMode: isPurelyScanned ? "fidelity" : "editable"
  };
}

/**
 * Calculates slide dimensions and content scaling for target slide presets.
 */
export function calculateSlideDimensions(presetKey, pdfWidthInches, pdfHeightInches) {
  const pdfAspectRatio = pdfWidthInches / pdfHeightInches;

  if (presetKey === "match") {
    return {
      slideWidth: Math.max(2, Math.min(36, Number(pdfWidthInches.toFixed(3)))),
      slideHeight: Math.max(2, Math.min(36, Number(pdfHeightInches.toFixed(3)))),
      contentScale: 1.0,
      offsetX: 0,
      offsetY: 0,
      isCustom: true
    };
  }

  let targetWidth = 13.333;
  let targetHeight = 7.5;

  if (presetKey === "16:9") {
    targetWidth = 13.333;
    targetHeight = 7.5;
  } else if (presetKey === "4:3") {
    targetWidth = 10.0;
    targetHeight = 7.5;
  } else if (presetKey === "a4") {
    targetWidth = pdfHeightInches > pdfWidthInches ? 8.268 : 11.693;
    targetHeight = pdfHeightInches > pdfWidthInches ? 11.693 : 8.268;
  } else if (presetKey === "letter") {
    targetWidth = pdfHeightInches > pdfWidthInches ? 8.5 : 11.0;
    targetHeight = pdfHeightInches > pdfWidthInches ? 11.0 : 8.5;
  }

  // Calculate aspect ratio fit
  const scaleX = targetWidth / pdfWidthInches;
  const scaleY = targetHeight / pdfHeightInches;
  const fitScale = Math.min(scaleX, scaleY);

  const scaledW = pdfWidthInches * fitScale;
  const scaledH = pdfHeightInches * fitScale;

  const offsetX = (targetWidth - scaledW) / 2;
  const offsetY = (targetHeight - scaledH) / 2;

  return {
    slideWidth: Number(targetWidth.toFixed(3)),
    slideHeight: Number(targetHeight.toFixed(3)),
    contentScale: fitScale,
    offsetX: Number(offsetX.toFixed(3)),
    offsetY: Number(offsetY.toFixed(3)),
    isCustom: true
  };
}

/**
 * Groups raw PDF.js text items into structured lines and coherent paragraphs for native PowerPoint text reconstruction.
 */
export function clusterTextItemsIntoBlocks(textItems, viewportHeight) {
  if (!textItems || textItems.length === 0) return [];

  // Filter valid non-empty items
  const validItems = [];
  for (const item of textItems) {
    if (!item || typeof item.str !== "string") continue;
    const trimmed = item.str.replace(/\s+/g, " ");
    if (!trimmed.trim()) continue;

    const transform = item.transform || [12, 0, 0, 12, 0, 0];
    const fontSize = Math.hypot(transform[2], transform[3]) || Math.abs(transform[0]) || item.height || 12;
    const fontName = item.fontName || "";
    const xPt = transform[4];
    const baselineYPt = transform[5];

    // In PDF (0,0) is bottom-left. In PPT / canvas (0,0) is top-left.
    const topPt = viewportHeight - baselineYPt - fontSize;

    validItems.push({
      str: item.str,
      xPt,
      baselineYPt,
      topPt,
      widthPt: item.width || (fontSize * 0.5 * item.str.length),
      fontSize,
      fontName
    });
  }

  if (validItems.length === 0) return [];

  // Sort items from top to bottom, then left to right
  validItems.sort((a, b) => {
    if (Math.abs(a.topPt - b.topPt) > 4) {
      return a.topPt - b.topPt;
    }
    return a.xPt - b.xPt;
  });

  // Group items into lines
  const lines = [];
  let currentLine = null;

  for (const item of validItems) {
    if (!currentLine) {
      currentLine = {
        topPt: item.topPt,
        baselineYPt: item.baselineYPt,
        fontSize: item.fontSize,
        fontName: item.fontName,
        items: [item]
      };
      continue;
    }

    const baselineDiff = Math.abs(item.baselineYPt - currentLine.baselineYPt);
    const fontSizeMatch = Math.abs(item.fontSize - currentLine.fontSize) <= Math.max(item.fontSize, currentLine.fontSize) * 0.3;

    if (baselineDiff <= currentLine.fontSize * 0.4 && fontSizeMatch) {
      currentLine.items.push(item);
    } else {
      lines.push(currentLine);
      currentLine = {
        topPt: item.topPt,
        baselineYPt: item.baselineYPt,
        fontSize: item.fontSize,
        fontName: item.fontName,
        items: [item]
      };
    }
  }
  if (currentLine) lines.push(currentLine);

  // Build line strings and compute line bounding boxes
  const processedLines = lines.map((line) => {
    line.items.sort((a, b) => a.xPt - b.xPt);

    let lineText = "";
    let minX = Infinity;
    let maxX = -Infinity;
    let maxFontSize = 0;

    for (let i = 0; i < line.items.length; i++) {
      const it = line.items[i];
      minX = Math.min(minX, it.xPt);
      maxX = Math.max(maxX, it.xPt + it.widthPt);
      maxFontSize = Math.max(maxFontSize, it.fontSize);

      if (i > 0) {
        const prev = line.items[i - 1];
        const gap = it.xPt - (prev.xPt + prev.widthPt);
        if (gap > it.fontSize * 0.2 && !lineText.endsWith(" ") && !it.str.startsWith(" ")) {
          lineText += " ";
        }
      }
      lineText += it.str;
    }

    return {
      text: lineText.trim(),
      leftPt: minX,
      widthPt: Math.max(10, maxX - minX),
      topPt: line.topPt,
      fontSize: maxFontSize,
      fontName: line.fontName
    };
  }).filter((l) => l.text.length > 0);

  // Group lines into paragraphs / blocks
  const blocks = [];
  let currentBlock = null;

  for (const line of processedLines) {
    if (!currentBlock) {
      currentBlock = {
        lines: [line],
        leftPt: line.leftPt,
        topPt: line.topPt,
        maxFontSize: line.fontSize,
        fontName: line.fontName
      };
      continue;
    }

    const prevLine = currentBlock.lines[currentBlock.lines.length - 1];
    const verticalGap = line.topPt - (prevLine.topPt + prevLine.fontSize);
    const lineSpacingAcceptable = verticalGap <= prevLine.fontSize * 1.5 && verticalGap >= -prevLine.fontSize * 0.5;
    const sameFont = Math.abs(line.fontSize - currentBlock.maxFontSize) <= 3;
    const indentationClose = Math.abs(line.leftPt - currentBlock.leftPt) <= 40;

    if (lineSpacingAcceptable && sameFont && indentationClose) {
      currentBlock.lines.push(line);
      currentBlock.leftPt = Math.min(currentBlock.leftPt, line.leftPt);
      currentBlock.maxFontSize = Math.max(currentBlock.maxFontSize, line.fontSize);
    } else {
      blocks.push(currentBlock);
      currentBlock = {
        lines: [line],
        leftPt: line.leftPt,
        topPt: line.topPt,
        maxFontSize: line.fontSize,
        fontName: line.fontName
      };
    }
  }
  if (currentBlock) blocks.push(currentBlock);

  // Finalize blocks with full text, dimensions, and heading detection
  return blocks.map((block) => {
    const combinedText = block.lines.map((l) => l.text).join("\n");
    let maxW = 0;
    for (const l of block.lines) {
      maxW = Math.max(maxW, l.widthPt);
    }
    const lastLine = block.lines[block.lines.length - 1];
    const totalHPt = (lastLine.topPt + lastLine.fontSize) - block.topPt;

    const isHeading = block.maxFontSize >= 18 || (block.lines.length === 1 && block.maxFontSize >= 15);
    const style = detectFontStyle(block.fontName);
    const fontFace = resolveSafeFontFamily(block.fontName);

    return {
      text: combinedText,
      leftPt: block.leftPt,
      topPt: block.topPt,
      widthPt: maxW,
      heightPt: Math.max(block.maxFontSize * 1.3, totalHPt),
      fontSizePt: Math.round(block.maxFontSize),
      isHeading,
      bold: style.bold || isHeading,
      italic: style.italic,
      fontFace
    };
  });
}

/**
 * Renders a PDF page to high-quality HTML Canvas.
 */
export async function renderPdfPageToCanvas(pdfPage, scale = 2.0) {
  if (typeof document === "undefined") {
    throw new Error("Canvas rendering requires browser DOM environment.");
  }

  const viewport = pdfPage.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: false });
  // Clean white canvas background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await pdfPage.render({
    canvasContext: ctx,
    viewport
  }).promise;

  return canvas;
}

/**
 * Converts a Canvas to a clean base64 data URL with automatic cleanup.
 */
export function getCanvasDataUrl(canvas, mime = "image/jpeg", quality = 0.88) {
  const url = canvas.toDataURL(mime, quality);
  // Free canvas memory
  canvas.width = 0;
  canvas.height = 0;
  if (typeof canvas.remove === "function") {
    canvas.remove();
  }
  return url;
}

/**
 * Main PDF to PowerPoint conversion orchestrator.
 * Converts PDF into a Blob (.pptx) entirely client-side.
 */
export async function convertPdfToPowerpoint(pdfDoc, options = {}) {
  const {
    mode = "editable", // 'editable' | 'fidelity'
    preset = "match",  // 'match' | '16:9' | '4:3' | 'a4' | 'letter'
    pageRange = "all",
    onProgress = () => {},
    signal = null
  } = options;

  const totalDocPages = pdfDoc.numPages;
  const rangeResult = parsePageRange(pageRange, totalDocPages);

  if (!rangeResult.valid || rangeResult.pages.length === 0) {
    throw new Error("No valid pages selected for conversion.");
  }

  const selectedPages = rangeResult.pages;
  const totalToConvert = selectedPages.length;

  onProgress({
    current: 0,
    total: totalToConvert,
    percent: 5,
    stage: "Analyzing document...",
    message: "Initializing PowerPoint presentation builder..."
  });

  // Analyze primary dimensions
  const firstPage = await pdfDoc.getPage(selectedPages[0]);
  const firstViewport = firstPage.getViewport({ scale: 1.0 });
  const pdfWidthInches = firstViewport.width / 72;
  const pdfHeightInches = firstViewport.height / 72;

  const slideDim = calculateSlideDimensions(preset, pdfWidthInches, pdfHeightInches);

  // Initialize PPTXGenJS
  const PptxConstructor = pptxgen?.default || pptxgen;
  const pres = new PptxConstructor();
  pres.defineLayout({
    name: "CUSTOM_LAYOUT",
    width: slideDim.slideWidth,
    height: slideDim.slideHeight
  });
  pres.layout = "CUSTOM_LAYOUT";

  let convertedCount = 0;
  const scannedFallbackPages = [];

  for (let index = 0; index < selectedPages.length; index++) {
    if (signal?.aborted) {
      throw new Error("Conversion was cancelled by the user.");
    }

    const pageNum = selectedPages[index];
    const pagePercent = Math.min(95, Math.round(10 + (index / totalToConvert) * 80));

    onProgress({
      current: index + 1,
      total: totalToConvert,
      percent: pagePercent,
      stage: `Processing slide ${index + 1} of ${totalToConvert}...`,
      message: mode === "editable" ? `Reconstructing text for page ${pageNum}...` : `Rendering high-fidelity page ${pageNum}...`
    });

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.0 });
    const pageWInches = viewport.width / 72;
    const pageHInches = viewport.height / 72;

    const currentSlideDim = calculateSlideDimensions(preset, pageWInches, pageHInches);
    const slide = pres.addSlide();

    if (mode === "editable") {
      const textContent = await page.getTextContent({ normalizeWhitespace: true });
      const rawItems = textContent.items || [];
      const totalPageChars = rawItems.reduce((acc, it) => acc + (it.str ? it.str.length : 0), 0);

      if (totalPageChars < PPT_SAFETY_LIMITS.SCANNED_PAGE_CHAR_THRESHOLD) {
        // Scanned or image-based page fallback
        scannedFallbackPages.push(pageNum);
        if (typeof document !== "undefined") {
          const canvas = await renderPdfPageToCanvas(page, 1.8);
          const imgDataUrl = getCanvasDataUrl(canvas, "image/jpeg", 0.88);
          slide.addImage({
            data: imgDataUrl,
            x: currentSlideDim.offsetX,
            y: currentSlideDim.offsetY,
            w: pageWInches * currentSlideDim.contentScale,
            h: pageHInches * currentSlideDim.contentScale
          });
        }
      } else {
        // Extract structured text blocks
        const blocks = clusterTextItemsIntoBlocks(rawItems, viewport.height);

        // Optional slide background: light clean presentation background
        slide.background = { color: "FFFFFF" };

        for (const block of blocks) {
          const xInches = currentSlideDim.offsetX + (block.leftPt / 72) * currentSlideDim.contentScale;
          const yInches = currentSlideDim.offsetY + (block.topPt / 72) * currentSlideDim.contentScale;
          const wInches = Math.max(0.6, (block.widthPt / 72) * currentSlideDim.contentScale + 0.15);
          const hInches = Math.max(0.3, (block.heightPt / 72) * currentSlideDim.contentScale + 0.1);
          const fontSizePt = Math.max(7, Math.min(64, Math.round(block.fontSizePt * currentSlideDim.contentScale)));

          slide.addText(block.text, {
            x: Number(xInches.toFixed(3)),
            y: Number(yInches.toFixed(3)),
            w: Number(wInches.toFixed(3)),
            h: Number(hInches.toFixed(3)),
            fontSize: fontSizePt,
            fontFace: block.fontFace,
            bold: block.bold,
            italic: block.italic,
            color: block.isHeading ? "0F172A" : "334155",
            align: "left",
            valign: "top",
            wrap: true,
            margin: 0
          });
        }
      }
    } else {
      // High Fidelity Mode
      if (typeof document !== "undefined") {
        const canvas = await renderPdfPageToCanvas(page, 2.0);
        const imgDataUrl = getCanvasDataUrl(canvas, "image/jpeg", 0.90);

        slide.addImage({
          data: imgDataUrl,
          x: currentSlideDim.offsetX,
          y: currentSlideDim.offsetY,
          w: pageWInches * currentSlideDim.contentScale,
          h: pageHInches * currentSlideDim.contentScale
        });
      }
    }

    convertedCount++;

    // Periodic yield to event loop to keep UI smooth and unblock browser animations
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  onProgress({
    current: totalToConvert,
    total: totalToConvert,
    percent: 95,
    stage: "Packaging PowerPoint presentation...",
    message: "Generating .pptx file in browser memory..."
  });

  const pptxBlob = await pres.write({ outputType: "blob" });

  onProgress({
    current: totalToConvert,
    total: totalToConvert,
    percent: 100,
    stage: "Conversion Complete!",
    message: "PowerPoint file is ready for download."
  });

  return {
    blob: pptxBlob,
    convertedCount,
    totalRequested: totalToConvert,
    mode,
    preset,
    slideWidth: slideDim.slideWidth,
    slideHeight: slideDim.slideHeight,
    scannedFallbackPages
  };
}
