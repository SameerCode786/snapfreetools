/**
 * PowerPoint to PDF Conversion Engine
 * SnapFreeTools.com
 *
 * 100% Client-side PresentationML (.pptx) parser and PDF generator.
 * Analyzes presentation dimensions, parses slide elements (shapes, text, images, tables),
 * and creates a valid, high-fidelity PDF document.
 */

import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";

/**
 * Safety & processing limits
 */
export const PPTX_SAFETY_LIMITS = {
  MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024, // 50MB
  MAX_PAGES: 100,
  DEFAULT_SCALE: 1.5,
  HIGH_QUALITY_SCALE: 2.0
};

/**
 * Slide Dimensions Presets
 */
export const PAGE_SIZE_PRESETS = {
  MATCH: {
    id: "match",
    name: "Match Presentation",
    desc: "Uses exact PowerPoint slide dimensions with zero distortion"
  },
  A4: {
    id: "a4",
    name: "A4 Document",
    desc: "Standard international A4 format (8.27\" × 11.69\")",
    widthPt: 595.28,
    heightPt: 841.89
  },
  LETTER: {
    id: "letter",
    name: "US Letter",
    desc: "Standard North American Letter format (8.5\" × 11.0\")",
    widthPt: 612.0,
    heightPt: 792.0
  }
};

/**
 * Orientation Options
 */
export const ORIENTATION_OPTIONS = {
  MATCH: { id: "match", name: "Match Presentation" },
  LANDSCAPE: { id: "landscape", name: "Landscape" },
  PORTRAIT: { id: "portrait", name: "Portrait" }
};

/**
 * Quality Options
 */
export const QUALITY_OPTIONS = {
  STANDARD: {
    id: "standard",
    name: "Standard Quality",
    scale: 1.5,
    desc: "Optimized for fast conversion, crisp text, and compact file size"
  },
  HIGH: {
    id: "high",
    name: "High Quality",
    scale: 2.0,
    desc: "Ultra-sharp 2x resolution rendering for presentations with fine details"
  }
};

/**
 * XML Helpers that work safely across Browser (DOMParser) and Node.js
 */
function parseXmlDocument(xmlText) {
  if (typeof window !== "undefined" && window.DOMParser) {
    const parser = new DOMParser();
    return parser.parseFromString(xmlText, "application/xml");
  }
  // Fallback lightweight regex/string parser for Node.js / non-browser test environments
  return null;
}

/**
 * Validate PPTX File Input
 */
export async function validatePptxFile(file) {
  if (!file) {
    throw new Error("No presentation file selected. Please select a PowerPoint file.");
  }

  const filename = file.name || "";
  const isPptx = filename.toLowerCase().endsWith(".pptx");
  const isPpt = filename.toLowerCase().endsWith(".ppt");

  if (isPpt) {
    throw new Error(
      "Legacy .ppt files are not supported directly in the browser. Please save your presentation as modern .pptx in PowerPoint and try again."
    );
  }

  if (!isPptx) {
    throw new Error("Invalid file type. Please select a valid PowerPoint presentation (.pptx).");
  }

  // Check magic bytes for ZIP format (PK\x03\x04 = 0x50, 0x4B, 0x03, 0x04)
  let buffer;
  if (file.arrayBuffer) {
    buffer = await file.arrayBuffer();
  } else if (Buffer.isBuffer(file) || file instanceof Uint8Array) {
    buffer = file;
  } else {
    throw new Error("Unable to read presentation data buffer.");
  }

  const size = typeof file.size === "number" ? file.size : (buffer.byteLength ?? buffer.length ?? 0);
  if (size === 0) {
    throw new Error("The selected presentation file is empty (0 bytes).");
  }

  if (size > PPTX_SAFETY_LIMITS.MAX_FILE_SIZE_BYTES) {
    throw new Error("File exceeds the 50MB browser processing limit. Please use a smaller file.");
  }

  const bytes = new Uint8Array(buffer.slice ? buffer.slice(0, 4) : buffer.subarray(0, 4));
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;

  if (!isZip) {
    throw new Error(
      "Corrupted or invalid presentation. The file does not have a valid PowerPoint (.pptx) archive structure."
    );
  }

  return { valid: true, buffer };
}

/**
 * Parse Custom Page / Slide Range
 * Supports: "1-5", "1, 3, 7", "1-3, 6, 9-12", "all"
 */
export function parsePageRange(rangeStr, totalSlides) {
  if (!rangeStr || typeof rangeStr !== "string" || rangeStr.trim().toLowerCase() === "all") {
    return {
      valid: true,
      pages: Array.from({ length: totalSlides }, (_, i) => i + 1)
    };
  }

  const trimmed = rangeStr.trim();
  const parts = trimmed.split(/[,;\s]+/).filter(Boolean);
  const pagesSet = new Set();

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (isNaN(start) || isNaN(end) || start > end || start < 1 || end > totalSlides) {
        return {
          valid: false,
          pages: [],
          error: `Invalid range "${part}". Must be between 1 and ${totalSlides}.`
        };
      }

      for (let i = start; i <= end; i++) {
        pagesSet.add(i);
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (isNaN(pageNum) || pageNum < 1 || pageNum > totalSlides) {
        return {
          valid: false,
          pages: [],
          error: `Invalid slide number "${part}". Document only contains ${totalSlides} slides.`
        };
      }
      pagesSet.add(pageNum);
    }
  }

  const sortedPages = Array.from(pagesSet).sort((a, b) => a - b);
  if (sortedPages.length === 0) {
    return {
      valid: false,
      pages: [],
      error: "No valid slides specified in range."
    };
  }

  return {
    valid: true,
    pages: sortedPages
  };
}

/**
 * Sanitize Output PDF Filename
 */
export function sanitizePdfFilename(originalFilename = "presentation.pptx") {
  const base = originalFilename.replace(/\.(pptx|ppt)$/i, "");
  const sanitized = base.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim();
  return `${sanitized || "presentation"}.pdf`;
}

/**
 * Analyze PowerPoint Presentation Structure
 */
export async function parsePptxPresentation(inputBuffer) {
  const zip = await JSZip.loadAsync(inputBuffer);

  // 1. Verify [Content_Types].xml exists
  const contentTypesFile = zip.file("[Content_Types].xml");
  if (!contentTypesFile) {
    throw new Error("Invalid PowerPoint file: Missing [Content_Types].xml");
  }

  // 2. Read presentation.xml
  const presFile = zip.file("ppt/presentation.xml");
  if (!presFile) {
    throw new Error("Invalid PowerPoint file: Missing ppt/presentation.xml");
  }
  const presXmlText = await presFile.async("text");

  // 3. Detect Slide Dimensions
  // Standard EMU: 1 inch = 914400 EMUs, 1 pt = 12700 EMUs
  let cx = 9144000; // default 10 inches
  let cy = 5143500; // default 5.625 inches (16:9)

  const sldSzMatch = presXmlText.match(/<[a-zA-Z0-9:]*sldSz[^>]*cx="(\d+)"[^>]*cy="(\d+)"/i) ||
                     presXmlText.match(/<[a-zA-Z0-9:]*sldSz[^>]*cy="(\d+)"[^>]*cx="(\d+)"/i);

  if (sldSzMatch) {
    cx = parseInt(sldSzMatch[1], 10) || cx;
    cy = parseInt(sldSzMatch[2], 10) || cy;
  }

  const widthPt = Math.round((cx / 12700) * 100) / 100;
  const heightPt = Math.round((cy / 12700) * 100) / 100;
  const widthInches = Math.round((cx / 914400) * 100) / 100;
  const heightInches = Math.round((cy / 914400) * 100) / 100;

  const ratio = widthPt / heightPt;
  let aspectRatio = "16:9 Widescreen";
  if (Math.abs(ratio - 16 / 9) < 0.05) {
    aspectRatio = "16:9 Widescreen";
  } else if (Math.abs(ratio - 4 / 3) < 0.05) {
    aspectRatio = "4:3 Standard";
  } else if (Math.abs(ratio - 16 / 10) < 0.05) {
    aspectRatio = "16:10 Widescreen";
  } else if (ratio < 1) {
    aspectRatio = "Portrait Slide";
  } else {
    aspectRatio = `${widthInches}" × ${heightInches}" Custom`;
  }

  // 4. Resolve Slide List via Relationships
  const presRelsFile = zip.file("ppt/_rels/presentation.xml.rels");
  const relsMap = {};

  if (presRelsFile) {
    const relsText = await presRelsFile.async("text");
    const relRegex = /<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/gi;
    let match;
    while ((match = relRegex.exec(relsText)) !== null) {
      relsMap[match[1]] = match[2];
    }
  }

  // Find slide IDs from <p:sldIdLst> in presentation.xml
  const slideFiles = [];
  const sldIdRegex = /<[a-zA-Z0-9:]*sldId[^>]*r:id="([^"]+)"/gi;
  let sldMatch;

  while ((sldMatch = sldIdRegex.exec(presXmlText)) !== null) {
    const rId = sldMatch[1];
    let target = relsMap[rId];
    if (target) {
      // Clean path: slides/slide1.xml -> ppt/slides/slide1.xml
      if (!target.startsWith("ppt/")) {
        target = `ppt/${target.replace(/^\//, "")}`;
      }
      if (zip.file(target)) {
        slideFiles.push(target);
      }
    }
  }

  // Fallback: search zip directly for ppt/slides/slide{N}.xml
  if (slideFiles.length === 0) {
    const foundSlides = Object.keys(zip.files).filter(path =>
      /^ppt\/slides\/slide\d+\.xml$/i.test(path)
    );
    // Sort naturally: slide1, slide2, slide10
    foundSlides.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
      return numA - numB;
    });
    slideFiles.push(...foundSlides);
  }

  if (slideFiles.length === 0) {
    throw new Error(
      "No slides detected in the PowerPoint presentation. The file may be empty or corrupted."
    );
  }

  // Count embedded images in ppt/media/
  const mediaFiles = Object.keys(zip.files).filter(p => /^ppt\/media\//i.test(p) && !zip.files[p].dir);

  return {
    slideCount: slideFiles.length,
    slideFiles,
    widthPt,
    heightPt,
    widthInches,
    heightInches,
    aspectRatio,
    mediaCount: mediaFiles.length,
    zip
  };
}

/**
 * Parse Slide Relationships (.rels)
 */
async function getSlideRelationships(zip, slidePath) {
  // e.g. ppt/slides/slide1.xml -> ppt/slides/_rels/slide1.xml.rels
  const parts = slidePath.split("/");
  const filename = parts.pop();
  const relsPath = `${parts.join("/")}/_rels/${filename}.rels`;

  const relsFile = zip.file(relsPath);
  if (!relsFile) return {};

  const relsText = await relsFile.async("text");
  const rels = {};
  const regex = /<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/gi;
  let match;
  while ((match = regex.exec(relsText)) !== null) {
    let target = match[2];
    if (target.startsWith("../")) {
      target = `ppt/${target.replace(/^\.\.\//, "")}`;
    } else if (!target.startsWith("ppt/")) {
      target = `ppt/slides/${target}`;
    }
    rels[match[1]] = target;
  }
  return rels;
}

/**
 * Extract XML color to HEX string
 */
function extractHexColor(elemXml) {
  const srgb = elemXml.match(/<[a-zA-Z0-9:]*srgbClr[^>]*val="([0-9A-Fa-f]{6})"/i);
  if (srgb) return `#${srgb[1]}`;

  // Theme/scheme colors fallback mapping
  if (/schemeClr[^>]*val="accent1"/i.test(elemXml)) return "#4472C4";
  if (/schemeClr[^>]*val="accent2"/i.test(elemXml)) return "#ED7D31";
  if (/schemeClr[^>]*val="accent3"/i.test(elemXml)) return "#A5A5A5";
  if (/schemeClr[^>]*val="accent4"/i.test(elemXml)) return "#FFC000";
  if (/schemeClr[^>]*val="accent5"/i.test(elemXml)) return "#5B9BD5";
  if (/schemeClr[^>]*val="accent6"/i.test(elemXml)) return "#70AD47";
  if (/schemeClr[^>]*val="dk1"/i.test(elemXml)) return "#000000";
  if (/schemeClr[^>]*val="lt1"/i.test(elemXml)) return "#FFFFFF";

  return null;
}

/**
 * Render a Single Slide onto an HTML5 Canvas
 */
export async function renderSlideToCanvas(zip, slidePath, slideWidthPt, slideHeightPt, scale = 1.5, signal = null) {
  if (typeof document === "undefined") {
    throw new Error("renderSlideToCanvas requires a browser DOM environment.");
  }

  if (signal?.aborted) throw new Error("Conversion cancelled by user.");

  const canvasWidth = Math.round(slideWidthPt * scale);
  const canvasHeight = Math.round(slideHeightPt * scale);

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");

  // Coordinate conversion factor: EMUs to canvas pixels
  // 1 EMU = (1 / 12700) pt * scale
  const emuToPx = (emu) => (emu / 12700) * scale;

  // 1. Read slide XML and relationships
  const slideFile = zip.file(slidePath);
  if (!slideFile) throw new Error(`Missing slide file: ${slidePath}`);
  const slideXmlText = await slideFile.async("text");
  const rels = await getSlideRelationships(zip, slidePath);

  // 2. Render Slide Background
  let bgColor = "#FFFFFF";
  const bgMatch = slideXmlText.match(/<[a-zA-Z0-9:]*bg>([\s\S]*?)<\/[a-zA-Z0-9:]*bg>/i) ||
                  slideXmlText.match(/<[a-zA-Z0-9:]*bgPr>([\s\S]*?)<\/[a-zA-Z0-9:]*bgPr>/i);
  if (bgMatch) {
    const detectedBg = extractHexColor(bgMatch[1]);
    if (detectedBg) bgColor = detectedBg;
  }
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 3. Parse Shapes, Pictures, Tables, and Elements in document order
  const doc = parseXmlDocument(slideXmlText);
  if (!doc) {
    return canvas;
  }

  const spTree = doc.getElementsByTagName("p:spTree")[0] || doc.getElementsByTagName("spTree")[0];
  if (!spTree) return canvas;

  const childNodes = Array.from(spTree.childNodes);

  for (const node of childNodes) {
    if (signal?.aborted) throw new Error("Conversion cancelled by user.");

    const nodeName = node.nodeName.toLowerCase();

    // --- A. SHAPES (<p:sp>) ---
    if (nodeName.endsWith("sp") && !nodeName.endsWith("grpsp") && !nodeName.endsWith("cxnsp")) {
      const spPr = node.getElementsByTagName("p:spPr")[0] || node.getElementsByTagName("spPr")[0];
      const xfrm = spPr ? (spPr.getElementsByTagName("a:xfrm")[0] || spPr.getElementsByTagName("xfrm")[0]) : null;

      if (!xfrm) continue;

      const off = xfrm.getElementsByTagName("a:off")[0] || xfrm.getElementsByTagName("off")[0];
      const ext = xfrm.getElementsByTagName("a:ext")[0] || xfrm.getElementsByTagName("ext")[0];

      if (!off || !ext) continue;

      const x = emuToPx(parseInt(off.getAttribute("x") || "0", 10));
      const y = emuToPx(parseInt(off.getAttribute("y") || "0", 10));
      const w = emuToPx(parseInt(ext.getAttribute("cx") || "0", 10));
      const h = emuToPx(parseInt(ext.getAttribute("cy") || "0", 10));

      const spPrXml = spPr.outerHTML || "";
      const shapeColor = extractHexColor(spPrXml);
      const isNoFill = /<[a-zA-Z0-9:]*noFill\/>/i.test(spPrXml);

      // Handle shape rotation if specified
      const rotAttr = xfrm.getAttribute("rot");
      const hasRot = Boolean(rotAttr && rotAttr !== "0");

      if (hasRot) {
        ctx.save();
        const degrees = parseInt(rotAttr, 10) / 60000;
        const rad = (degrees * Math.PI) / 180;
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate(rad);
        ctx.translate(-(x + w / 2), -(y + h / 2));
      }

      // Check Shape Geometry
      const prstGeom = spPr.getElementsByTagName("a:prstGeom")[0] || spPr.getElementsByTagName("prstGeom")[0];
      const geomType = prstGeom ? prstGeom.getAttribute("prst") : "rect";

      // Draw Shape Background Fill
      if (!isNoFill && shapeColor) {
        ctx.save();
        ctx.fillStyle = shapeColor;

        if (geomType === "ellipse") {
          ctx.beginPath();
          ctx.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (geomType === "roundRect") {
          const radius = Math.min(w, h) * 0.1;
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(x, y, w, h, radius) : ctx.rect(x, y, w, h);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, w, h);
        }
        ctx.restore();
      }

      // Draw Shape Outline Border if defined
      const ln = spPr.getElementsByTagName("a:ln")[0] || spPr.getElementsByTagName("ln")[0];
      if (ln) {
        const lnXml = ln.outerHTML || "";
        const lnColor = extractHexColor(lnXml);
        const lnW = ln.getAttribute("w");
        if (lnColor) {
          ctx.save();
          ctx.strokeStyle = lnColor;
          ctx.lineWidth = Math.max(1, emuToPx(parseInt(lnW || "12700", 10)));
          ctx.strokeRect(x, y, w, h);
          ctx.restore();
        }
      }

      // Draw Text inside Shape (<p:txBody>)
      const txBody = node.getElementsByTagName("p:txBody")[0] || node.getElementsByTagName("txBody")[0];
      if (txBody) {
        const bodyPr = txBody.getElementsByTagName("a:bodyPr")[0] || txBody.getElementsByTagName("bodyPr")[0];
        let topPad = 6 * scale;
        let leftPad = 8 * scale;
        let rightPad = 8 * scale;

        if (bodyPr) {
          const tIns = bodyPr.getAttribute("tIns");
          const lIns = bodyPr.getAttribute("lIns");
          const rIns = bodyPr.getAttribute("rIns");
          if (tIns) topPad = Math.max(2, emuToPx(parseInt(tIns, 10)));
          if (lIns) leftPad = Math.max(2, emuToPx(parseInt(lIns, 10)));
          if (rIns) rightPad = Math.max(2, emuToPx(parseInt(rIns, 10)));
        }

        const paragraphs = Array.from(txBody.getElementsByTagName("a:p") || txBody.getElementsByTagName("p"));
        let currentY = y + topPad;

        for (const p of paragraphs) {
          const pPr = p.getElementsByTagName("a:pPr")[0] || p.getElementsByTagName("pPr")[0];
          const align = pPr ? (pPr.getAttribute("algn") || "l") : "l";

          const runs = Array.from(p.getElementsByTagName("a:r") || p.getElementsByTagName("r"));
          let paraText = "";
          let fontSizePt = 16;
          let fontColor = "#1e293b";
          let isBold = false;
          let isItalic = false;

          for (const r of runs) {
            const rPr = r.getElementsByTagName("a:rPr")[0] || r.getElementsByTagName("rPr")[0];
            if (rPr) {
              const sz = rPr.getAttribute("sz");
              if (sz) fontSizePt = parseInt(sz, 10) / 100;
              isBold = rPr.getAttribute("b") === "1";
              isItalic = rPr.getAttribute("i") === "1";
              const detectedColor = extractHexColor(rPr.outerHTML || "");
              if (detectedColor) fontColor = detectedColor;
            }

            const tElem = r.getElementsByTagName("a:t")[0] || r.getElementsByTagName("t")[0];
            if (tElem && tElem.textContent) {
              paraText += tElem.textContent;
            }
          }

          if (paraText.trim()) {
            ctx.save();
            const pxFontSize = Math.max(10, fontSizePt * scale * 1.33);
            const fontStyle = `${isItalic ? "italic " : ""}${isBold ? "bold " : ""}${Math.round(pxFontSize)}px Inter, system-ui, sans-serif`;
            ctx.font = fontStyle;
            ctx.fillStyle = fontColor;
            ctx.textBaseline = "top";

            let startX = x + leftPad;
            if (align === "ctr") {
              ctx.textAlign = "center";
              startX = x + w / 2;
            } else if (align === "r") {
              ctx.textAlign = "right";
              startX = x + w - rightPad;
            } else {
              ctx.textAlign = "left";
            }

            // Word wrap inside container width
            const maxWidth = Math.max(40, w - (leftPad + rightPad));
            const words = paraText.split(" ");
            let line = "";

            for (let n = 0; n < words.length; n++) {
              const testLine = line + words[n] + " ";
              const metrics = ctx.measureText(testLine);
              const testWidth = metrics.width;

              if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, startX, currentY);
                line = words[n] + " ";
                currentY += pxFontSize * 1.25;
              } else {
                line = testLine;
              }
            }
            ctx.fillText(line, startX, currentY);
            currentY += pxFontSize * 1.35;
            ctx.restore();
          }
        }
      }

      if (hasRot) {
        ctx.restore();
      }
    }

    // --- B. PICTURES (<p:pic>) ---
    if (nodeName.endsWith("pic")) {
      const blip = node.getElementsByTagName("a:blip")[0] || node.getElementsByTagName("blip")[0];
      const rId = blip ? (blip.getAttribute("r:embed") || blip.getAttribute("embed")) : null;

      const spPr = node.getElementsByTagName("p:spPr")[0] || node.getElementsByTagName("spPr")[0];
      const xfrm = spPr ? (spPr.getElementsByTagName("a:xfrm")[0] || spPr.getElementsByTagName("xfrm")[0]) : null;

      if (rId && rels[rId] && xfrm) {
        const off = xfrm.getElementsByTagName("a:off")[0] || xfrm.getElementsByTagName("off")[0];
        const ext = xfrm.getElementsByTagName("a:ext")[0] || xfrm.getElementsByTagName("ext")[0];

        if (off && ext) {
          const imgX = emuToPx(parseInt(off.getAttribute("x") || "0", 10));
          const imgY = emuToPx(parseInt(off.getAttribute("y") || "0", 10));
          const imgW = emuToPx(parseInt(ext.getAttribute("cx") || "0", 10));
          const imgH = emuToPx(parseInt(ext.getAttribute("cy") || "0", 10));

          const imgPath = rels[rId];
          const imgZipFile = zip.file(imgPath);

          if (imgZipFile) {
            try {
              const imgData = await imgZipFile.async("base64");
              const extMatch = imgPath.match(/\.([a-zA-Z0-9]+)$/);
              const fileExt = extMatch ? extMatch[1].toLowerCase() : "png";
              let mimeType = "image/png";
              if (fileExt === "jpg" || fileExt === "jpeg") mimeType = "image/jpeg";
              else if (fileExt === "webp") mimeType = "image/webp";
              else if (fileExt === "svg") mimeType = "image/svg+xml";
              else if (fileExt === "gif") mimeType = "image/gif";

              const dataUrl = `data:${mimeType};base64,${imgData}`;

              await new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                  ctx.drawImage(img, imgX, imgY, imgW, imgH);
                  resolve();
                };
                img.onerror = () => resolve();
                img.src = dataUrl;
              });
            } catch {
              // Graceful continuation on damaged image
            }
          }
        }
      }
    }

    // --- C. TABLES (<p:graphicFrame> with <a:tbl>) ---
    if (nodeName.endsWith("graphicframe")) {
      const xfrm = node.getElementsByTagName("p:xfrm")[0] || node.getElementsByTagName("xfrm")[0];
      if (!xfrm) continue;

      const off = xfrm.getElementsByTagName("a:off")[0] || xfrm.getElementsByTagName("off")[0];
      const ext = xfrm.getElementsByTagName("a:ext")[0] || xfrm.getElementsByTagName("ext")[0];
      if (!off || !ext) continue;

      const tableX = emuToPx(parseInt(off.getAttribute("x") || "0", 10));
      const tableY = emuToPx(parseInt(off.getAttribute("y") || "0", 10));
      const tableW = emuToPx(parseInt(ext.getAttribute("cx") || "0", 10));
      const tableH = emuToPx(parseInt(ext.getAttribute("cy") || "0", 10));

      const tbl = node.getElementsByTagName("a:tbl")[0] || node.getElementsByTagName("tbl")[0];
      if (tbl) {
        const gridCols = Array.from(tbl.getElementsByTagName("a:gridCol") || tbl.getElementsByTagName("gridCol"));
        const colWidths = gridCols.map((col) => emuToPx(parseInt(col.getAttribute("w") || "0", 10)));
        const rows = Array.from(tbl.getElementsByTagName("a:tr") || tbl.getElementsByTagName("tr"));
        let currY = tableY;

        for (let rIdx = 0; rIdx < rows.length; rIdx++) {
          const row = rows[rIdx];
          const rowHeight = row.getAttribute("h")
            ? emuToPx(parseInt(row.getAttribute("h"), 10))
            : tableH / Math.max(1, rows.length);
          const cells = Array.from(row.getElementsByTagName("a:tc") || row.getElementsByTagName("tc"));
          let currX = tableX;

          for (let cIdx = 0; cIdx < cells.length; cIdx++) {
            const cell = cells[cIdx];
            const cellW = colWidths[cIdx] || tableW / Math.max(1, cells.length);

            // Cell Background Fill
            const tcPr = cell.getElementsByTagName("a:tcPr")[0] || cell.getElementsByTagName("tcPr")[0];
            const cellFill = tcPr ? extractHexColor(tcPr.outerHTML || "") : null;
            if (cellFill) {
              ctx.save();
              ctx.fillStyle = cellFill;
              ctx.fillRect(currX, currY, cellW, rowHeight);
              ctx.restore();
            }

            // Cell Border
            ctx.save();
            ctx.strokeStyle = "#CBD5E1";
            ctx.lineWidth = Math.max(1, 0.75 * scale);
            ctx.strokeRect(currX, currY, cellW, rowHeight);
            ctx.restore();

            // Cell Text
            const cellTxBody = cell.getElementsByTagName("a:txBody")[0] || cell.getElementsByTagName("txBody")[0];
            if (cellTxBody) {
              const paras = Array.from(cellTxBody.getElementsByTagName("a:p") || cellTxBody.getElementsByTagName("p"));
              let cellTextY = currY + 6 * scale;

              for (const p of paras) {
                const pPr = p.getElementsByTagName("a:pPr")[0] || p.getElementsByTagName("pPr")[0];
                const align = pPr ? (pPr.getAttribute("algn") || "l") : "l";

                const runs = Array.from(p.getElementsByTagName("a:r") || p.getElementsByTagName("r"));
                let cellText = "";
                let fontSizePt = 12;
                let isBold = false;
                let isItalic = false;
                let fontColor = "#0F172A";

                for (const r of runs) {
                  const rPr = r.getElementsByTagName("a:rPr")[0] || r.getElementsByTagName("rPr")[0];
                  if (rPr) {
                    const sz = rPr.getAttribute("sz");
                    if (sz) fontSizePt = parseInt(sz, 10) / 100;
                    isBold = rPr.getAttribute("b") === "1";
                    isItalic = rPr.getAttribute("i") === "1";
                    const c = extractHexColor(rPr.outerHTML || "");
                    if (c) fontColor = c;
                  }
                  const tElem = r.getElementsByTagName("a:t")[0] || r.getElementsByTagName("t")[0];
                  if (tElem?.textContent) cellText += tElem.textContent;
                }

                if (cellText.trim()) {
                  ctx.save();
                  const pxFontSize = Math.max(9, fontSizePt * scale * 1.33);
                  ctx.font = `${isItalic ? "italic " : ""}${isBold ? "bold " : ""}${Math.round(pxFontSize)}px Inter, system-ui, sans-serif`;
                  ctx.fillStyle = fontColor;
                  ctx.textBaseline = "top";

                  let textX = currX + 6 * scale;
                  if (align === "ctr") {
                    ctx.textAlign = "center";
                    textX = currX + cellW / 2;
                  } else if (align === "r") {
                    ctx.textAlign = "right";
                    textX = currX + cellW - 6 * scale;
                  } else {
                    ctx.textAlign = "left";
                  }

                  ctx.fillText(cellText, textX, cellTextY, Math.max(20, cellW - 12 * scale));
                  cellTextY += pxFontSize * 1.25;
                  ctx.restore();
                }
              }
            }

            currX += cellW;
          }
          currY += rowHeight;
        }
      }
    }

    // --- D. CONNECTORS & LINES (<p:cxnSp>) ---
    if (nodeName.endsWith("cxnsp")) {
      const spPr = node.getElementsByTagName("p:spPr")[0] || node.getElementsByTagName("spPr")[0];
      const xfrm = spPr ? (spPr.getElementsByTagName("a:xfrm")[0] || spPr.getElementsByTagName("xfrm")[0]) : null;
      if (xfrm) {
        const off = xfrm.getElementsByTagName("a:off")[0] || xfrm.getElementsByTagName("off")[0];
        const ext = xfrm.getElementsByTagName("a:ext")[0] || xfrm.getElementsByTagName("ext")[0];
        if (off && ext) {
          const lx = emuToPx(parseInt(off.getAttribute("x") || "0", 10));
          const ly = emuToPx(parseInt(off.getAttribute("y") || "0", 10));
          const lcx = emuToPx(parseInt(ext.getAttribute("cx") || "0", 10));
          const lcy = emuToPx(parseInt(ext.getAttribute("cy") || "0", 10));
          const ln = spPr.getElementsByTagName("a:ln")[0] || spPr.getElementsByTagName("ln")[0];
          const lnColor = ln ? extractHexColor(ln.outerHTML || "") || "#94A3B8" : "#94A3B8";
          const lnW = ln ? emuToPx(parseInt(ln.getAttribute("w") || "12700", 10)) : 1;

          ctx.save();
          ctx.strokeStyle = lnColor;
          ctx.lineWidth = Math.max(1, lnW);
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(lx + lcx, ly + lcy);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  return canvas;
}

/**
 * Main Conversion Pipeline: PowerPoint (.pptx) to PDF
 */
export async function convertPowerpointToPdf({
  file,
  options = {},
  onProgress = () => {},
  signal = null
}) {
  const {
    pageSizePreset = "match",
    orientation = "match",
    quality = "standard",
    pageRange = "all"
  } = options;

  // 1. Initial Validation
  onProgress({ percent: 5, stage: "Validating presentation file...", message: "Checking presentation integrity" });
  if (signal?.aborted) throw new Error("Conversion cancelled by user.");

  const { buffer } = await validatePptxFile(file);

  // 2. Parse Presentation Structure
  onProgress({ percent: 15, stage: "Analyzing slides...", message: "Detecting presentation dimensions and slide layout" });
  if (signal?.aborted) throw new Error("Conversion cancelled by user.");

  const presentation = await parsePptxPresentation(buffer);
  const { slideCount, slideFiles, widthPt, heightPt, zip } = presentation;

  // 3. Filter Target Slide Range
  const rangeResult = parsePageRange(pageRange, slideCount);
  if (!rangeResult.valid || rangeResult.pages.length === 0) {
    throw new Error(rangeResult.error || "No valid slides selected in range.");
  }
  const selectedPages = rangeResult.pages;
  const totalSelected = selectedPages.length;

  // 4. Initialize PDF Document
  onProgress({ percent: 25, stage: "Initializing PDF document...", message: `Preparing ${totalSelected} slide pages` });
  const pdfDoc = await PDFDocument.create();

  // Determine DPI Scale
  const qualityScale = quality === "high" ? QUALITY_OPTIONS.HIGH.scale : QUALITY_OPTIONS.STANDARD.scale;

  // 5. Sequential Slide Rendering & PDF Generation
  for (let index = 0; index < totalSelected; index++) {
    if (signal?.aborted) throw new Error("Conversion cancelled by user.");

    const slideNumber = selectedPages[index];
    const slidePath = slideFiles[slideNumber - 1];

    const currentPercent = 25 + Math.round(((index + 1) / totalSelected) * 65);
    onProgress({
      current: index + 1,
      total: totalSelected,
      percent: currentPercent,
      stage: `Rendering slide ${slideNumber} of ${slideCount}...`,
      message: `Converting slide ${index + 1} of ${totalSelected} into PDF page`
    });

    // Render slide onto high-resolution canvas
    const canvas = await renderSlideToCanvas(zip, slidePath, widthPt, heightPt, qualityScale, signal);

    // Export canvas to JPEG image blob
    const imgDataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const base64Data = imgDataUrl.split(",")[1];
    const imgBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Embed image into PDF
    const embeddedImg = await pdfDoc.embedJpg(imgBytes);

    // Determine target PDF page dimensions
    let targetWidth = widthPt;
    let targetHeight = heightPt;

    if (pageSizePreset === "a4") {
      const isLandscape = orientation === "portrait" ? false : (orientation === "landscape" ? true : widthPt > heightPt);
      targetWidth = isLandscape ? PAGE_SIZE_PRESETS.A4.heightPt : PAGE_SIZE_PRESETS.A4.widthPt;
      targetHeight = isLandscape ? PAGE_SIZE_PRESETS.A4.widthPt : PAGE_SIZE_PRESETS.A4.heightPt;
    } else if (pageSizePreset === "letter") {
      const isLandscape = orientation === "portrait" ? false : (orientation === "landscape" ? true : widthPt > heightPt);
      targetWidth = isLandscape ? PAGE_SIZE_PRESETS.LETTER.heightPt : PAGE_SIZE_PRESETS.LETTER.widthPt;
      targetHeight = isLandscape ? PAGE_SIZE_PRESETS.LETTER.widthPt : PAGE_SIZE_PRESETS.LETTER.heightPt;
    }

    // Add page to PDF
    const page = pdfDoc.addPage([targetWidth, targetHeight]);

    // Fit and center image on page
    const scaleFactor = Math.min(targetWidth / widthPt, targetHeight / heightPt);
    const drawWidth = widthPt * scaleFactor;
    const drawHeight = heightPt * scaleFactor;
    const drawX = (targetWidth - drawWidth) / 2;
    const drawY = (targetHeight - drawHeight) / 2;

    page.drawImage(embeddedImg, {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight
    });

    // Free canvas memory immediately
    canvas.width = 1;
    canvas.height = 1;

    // Yield to browser event loop
    await new Promise((r) => setTimeout(r, 0));
  }

  // 6. Save & Finalize PDF
  onProgress({ percent: 95, stage: "Compiling PDF document...", message: "Assembling final PDF pages and metadata" });
  if (signal?.aborted) throw new Error("Conversion cancelled by user.");

  pdfDoc.setTitle(file.name ? file.name.replace(/\.[^/.]+$/, "") : "Presentation");
  pdfDoc.setCreator("SnapFreeTools PowerPoint to PDF Converter");
  pdfDoc.setProducer("SnapFreeTools (https://www.snapfreetools.com)");

  const pdfBytes = await pdfDoc.save();
  const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
  const outputFilename = sanitizePdfFilename(file.name || "presentation.pptx");

  onProgress({ percent: 100, stage: "Conversion Complete!", message: "Your PDF is ready for download" });

  return {
    blob: pdfBlob,
    filename: outputFilename,
    pageCount: totalSelected,
    fileSize: pdfBlob.size,
    slideWidth: widthPt,
    slideHeight: heightPt,
    aspectRatio: presentation.aspectRatio
  };
}
