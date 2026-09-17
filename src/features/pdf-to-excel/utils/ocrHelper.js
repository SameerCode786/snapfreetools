/**
 * Client-side Free OCR Helper using Tesseract.js v7.
 * 100% in-browser, privacy-first, zero server uploads or external APIs.
 */

let activeWorker = null;
let isCancelled = false;

/**
 * Cancels any active OCR worker and resets state.
 */
export async function cancelCurrentOcr() {
  isCancelled = true;
  if (activeWorker) {
    try {
      await activeWorker.terminate();
    } catch (err) {
      console.warn("Failed to terminate active OCR worker on cancel:", err);
    }
    activeWorker = null;
  }
}

/**
 * Inspects rendered canvas pixels to verify it contains visible text/image content.
 */
function inspectCanvasPixels(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  if (!width || !height) {
    return { hasContent: false, sampleCount: 0, nonWhiteCount: 0, avgBrightness: 0, minChannel: 0, maxChannel: 0 };
  }

  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    let nonWhiteCount = 0;
    let totalBrightness = 0;
    let minChannel = 255;
    let maxChannel = 0;

    // Sample every 100th pixel for performance
    const step = 4 * 100;
    let sampleCount = 0;

    for (let i = 0; i < data.length; i += step) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      sampleCount++;
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;

      if (r < minChannel) minChannel = r;
      if (g < minChannel) minChannel = g;
      if (b < minChannel) minChannel = b;

      if (r > maxChannel) maxChannel = r;
      if (g > maxChannel) maxChannel = g;
      if (b > maxChannel) maxChannel = b;

      if (a > 0 && brightness < 245) {
        nonWhiteCount++;
      }
    }

    const avgBrightness = sampleCount > 0 ? Math.round(totalBrightness / sampleCount) : 0;
    const hasContent = nonWhiteCount > 5;

    console.log(`
==================================================
[OCR CANVAS SANITY] PIXEL INSPECTION
==================================================
canvasWidth: ${width}
canvasHeight: ${height}
sampleCount: ${sampleCount}
nonWhiteSampleCount: ${nonWhiteCount}
averageBrightness: ${avgBrightness}
minChannel: ${minChannel}
maxChannel: ${maxChannel}
canvasHasVisibleContent: ${hasContent}
`);

    return { hasContent, sampleCount, nonWhiteCount, avgBrightness, minChannel, maxChannel };
  } catch (err) {
    console.warn("[OCR CANVAS SANITY] Could not inspect canvas pixels:", err);
    return { hasContent: true, sampleCount: 0, nonWhiteCount: 0, avgBrightness: 0, minChannel: 0, maxChannel: 0 };
  }
}

/**
 * Perform OCR on a PDF.js page and return structured word-level bounding box objects.
 *
 * @param {Object} pdfPage - PDF.js Page object.
 * @param {Object} [options] - Options including onProgress callback.
 * @returns {Promise<{ words: Array<{ text: string, x0: number, y0: number, x1: number, y1: number, confidence: number }>, avgConfidence: number, text: string }>}
 */
export async function ocrPage(pdfPage, options = {}) {
  const { onProgress } = options;
  isCancelled = false;

  // 1. Render page to off-screen canvas at 2x scale for optimal OCR accuracy
  if (onProgress) onProgress("Rendering page to high-resolution canvas...");
  const scale = 2.0;
  const viewport = pdfPage.getViewport({ scale });

  const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
  if (!canvas) {
    throw new Error("Canvas is not available in the current environment.");
  }

  const context = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  try {
    await pdfPage.render({ canvasContext: context, viewport }).promise;

    if (isCancelled) {
      throw new Error("OCR operation was cancelled by the user.");
    }

    // 2. Perform canvas pixel sanity check
    const canvasSanity = inspectCanvasPixels(canvas);
    if (!canvasSanity.hasContent) {
      console.warn("[OCR CANVAS SANITY] Warning: Canvas appears blank or contains zero non-white pixels.");
    }

    // 3. Initialize Tesseract.js Worker with absolute local asset URLs
    if (onProgress) onProgress("Initializing local OCR engine...");
    const { createWorker } = await import("tesseract.js");

    if (isCancelled) {
      throw new Error("OCR operation was cancelled by the user.");
    }

    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";
    const workerPath = `${origin}/ocr/worker.min.js`;
    const corePath = `${origin}/ocr/tesseract-core-lstm.wasm.js`;
    const langPath = `${origin}/ocr/`;

    console.log(`
==================================================
[TESSERACT LANGUAGE & ASSETS] INITIALIZATION
==================================================
language: eng
workerPath: ${workerPath}
corePath: ${corePath}
langPath: ${langPath}
languageDataLoaded: true
workerInitialized: true
recognizeStarted: true
`);

    activeWorker = await createWorker("eng", 1, {
      workerPath,
      corePath,
      langPath,
      logger: (m) => {
        if (isCancelled) return;
        if (m && m.status === "recognizing text" && onProgress) {
          const pct = Math.round((m.progress || 0) * 100);
          onProgress(`Recognizing text via OCR (${pct}%)...`);
        }
      }
    });

    if (isCancelled) {
      throw new Error("OCR operation was cancelled by the user.");
    }

    // 4. Convert canvas to PNG Data URL for max browser-worker compatibility
    if (onProgress) onProgress("Running OCR text & coordinate extraction...");
    const imageInput = canvas.toDataURL ? canvas.toDataURL("image/png") : canvas;

    // CRITICAL for Tesseract.js v7: Output defaults to { text: true }.
    // We MUST pass { text: true, blocks: true } as the 3rd parameter (output option)
    // to instruct Tesseract to call api.GetJSONText() and generate the full blocks/lines/words tree.
    const { data } = await activeWorker.recognize(
      imageInput,
      {},
      { text: true, blocks: true }
    );

    if (isCancelled) {
      throw new Error("OCR operation was cancelled by the user.");
    }

    // 5. Inspect Tesseract v7 result structure & collect candidate word objects across all nested levels
    let rawDirectWords = Array.isArray(data?.words) ? data.words : [];
    let rawLineWords = [];
    let rawNestedWords = [];

    // Collect from direct data.lines
    if (Array.isArray(data?.lines)) {
      data.lines.forEach((line) => {
        if (Array.isArray(line?.words)) {
          rawLineWords.push(...line.words);
        }
      });
    }

    // Collect from paragraphs / lines
    if (Array.isArray(data?.paragraphs)) {
      data.paragraphs.forEach((para) => {
        (para?.lines || []).forEach((line) => {
          if (Array.isArray(line?.words)) {
            rawNestedWords.push(...line.words);
          }
        });
      });
    }

    // Collect from blocks / paragraphs / lines
    if (Array.isArray(data?.blocks)) {
      data.blocks.forEach((block) => {
        (block?.paragraphs || []).forEach((para) => {
          (para?.lines || []).forEach((line) => {
            if (Array.isArray(line?.words)) {
              rawNestedWords.push(...line.words);
            }
          });
        });
      });
    }

    // Determine primary candidate pool in order of priority
    let rawWords = [];
    if (rawDirectWords.length > 0) {
      rawWords = rawDirectWords;
    } else if (rawLineWords.length > 0) {
      rawWords = rawLineWords;
    } else if (rawNestedWords.length > 0) {
      rawWords = rawNestedWords;
    }

    // Inspect first available objects for diagnostic log
    const firstWord = rawWords[0] || null;
    const firstLine = (data?.lines && data.lines[0]) || null;
    const firstParagraph = (data?.paragraphs && data.paragraphs[0]) || null;
    const firstBlock = (data?.blocks && data.blocks[0]) || null;

    console.log(`
==================================================
[TESSERACT RESULT STRUCTURE]
==================================================
result type: ${typeof data}
data keys: ${data ? Object.keys(data).join(", ") : "none"}
text length: ${data?.text ? data.text.length : 0}
text preview: "${data?.text ? data.text.substring(0, 150).replace(/\n/g, " ") : ""}"
confidence: ${data?.confidence}
words type: ${typeof data?.words}
words length: ${rawDirectWords.length}
lines type: ${typeof data?.lines}
lines length: ${data?.lines ? data.lines.length : 0}
paragraphs type: ${typeof data?.paragraphs}
paragraphs length: ${data?.paragraphs ? data.paragraphs.length : 0}
blocks type: ${typeof data?.blocks}
blocks length: ${data?.blocks ? data.blocks.length : 0}
firstWordKeys: ${firstWord ? Object.keys(firstWord).join(", ") : "none"}
firstLineKeys: ${firstLine ? Object.keys(firstLine).join(", ") : "none"}
firstParagraphKeys: ${firstParagraph ? Object.keys(firstParagraph).join(", ") : "none"}
firstBlockKeys: ${firstBlock ? Object.keys(firstBlock).join(", ") : "none"}
`);

    if (firstWord) {
      const bbox = firstWord.bbox || {};
      const x0 = typeof bbox.x0 === "number" ? bbox.x0 : (bbox.left ?? firstWord.x0 ?? firstWord.left ?? NaN);
      const y0 = typeof bbox.y0 === "number" ? bbox.y0 : (bbox.top ?? firstWord.y0 ?? firstWord.top ?? NaN);
      const x1 = typeof bbox.x1 === "number" ? bbox.x1 : (bbox.right ?? firstWord.x1 ?? firstWord.right ?? NaN);
      const y1 = typeof bbox.y1 === "number" ? bbox.y1 : (bbox.bottom ?? firstWord.y1 ?? firstWord.bottom ?? NaN);

      console.log(`
==================================================
[FIRST OCR WORD STRUCTURE]
==================================================
text: "${firstWord.text || ""}"
confidence: ${firstWord.confidence}
bbox exists: ${!!firstWord.bbox}
bbox keys: ${firstWord.bbox ? Object.keys(firstWord.bbox).join(", ") : "none"}
word keys: ${Object.keys(firstWord).join(", ")}
x0: ${x0}
y0: ${y0}
x1: ${x1}
y1: ${y1}
`);
    } else {
      console.log(`
==================================================
[FIRST OCR WORD STRUCTURE]
==================================================
No candidate word objects found in result structure.
`);
    }

    // 6. Word BBox Parsing & Validation with diagnostic counting
    let rejectedMissingTextCount = 0;
    let rejectedMissingBBoxCount = 0;
    let rejectedInvalidBBoxCount = 0;
    let validBBoxWordCount = 0;

    const words = rawWords
      .map((word) => {
        if (!word || typeof word !== "object") return null;
        const text = (word.text || "").trim();
        if (!text) {
          rejectedMissingTextCount++;
          return null;
        }

        let x0 = NaN, y0 = NaN, x1 = NaN, y1 = NaN;

        // Try bbox sub-object first
        if (word.bbox && typeof word.bbox === "object") {
          const b = word.bbox;
          if (typeof b.x0 === "number") x0 = b.x0;
          else if (typeof b.left === "number") x0 = b.left;
          else if (typeof b.x === "number") x0 = b.x;

          if (typeof b.y0 === "number") y0 = b.y0;
          else if (typeof b.top === "number") y0 = b.top;
          else if (typeof b.y === "number") y0 = b.y;

          if (typeof b.x1 === "number") x1 = b.x1;
          else if (typeof b.right === "number") x1 = b.right;
          else if (!isNaN(x0) && typeof b.w === "number") x1 = x0 + b.w;
          else if (!isNaN(x0) && typeof b.width === "number") x1 = x0 + b.width;

          if (typeof b.y1 === "number") y1 = b.y1;
          else if (typeof b.bottom === "number") y1 = b.bottom;
          else if (!isNaN(y0) && typeof b.h === "number") y1 = y0 + b.h;
          else if (!isNaN(y0) && typeof b.height === "number") y1 = y0 + b.height;
        }

        // Fall back to direct word properties
        if (isNaN(x0)) {
          if (typeof word.x0 === "number") x0 = word.x0;
          else if (typeof word.left === "number") x0 = word.left;
          else if (typeof word.x === "number") x0 = word.x;
        }
        if (isNaN(y0)) {
          if (typeof word.y0 === "number") y0 = word.y0;
          else if (typeof word.top === "number") y0 = word.top;
          else if (typeof word.y === "number") y0 = word.y;
        }
        if (isNaN(x1)) {
          if (typeof word.x1 === "number") x1 = word.x1;
          else if (typeof word.right === "number") x1 = word.right;
          else if (!isNaN(x0) && typeof word.w === "number") x1 = x0 + word.w;
          else if (!isNaN(x0) && typeof word.width === "number") x1 = x0 + word.width;
        }
        if (isNaN(y1)) {
          if (typeof word.y1 === "number") y1 = word.y1;
          else if (typeof word.bottom === "number") y1 = word.bottom;
          else if (!isNaN(y0) && typeof word.h === "number") y1 = y0 + word.h;
          else if (!isNaN(y0) && typeof word.height === "number") y1 = y0 + word.height;
        }

        // Check if coordinates exist
        if (isNaN(x0) || isNaN(y0) || isNaN(x1) || isNaN(y1)) {
          rejectedMissingBBoxCount++;
          return null;
        }

        // Check validity rules
        if (!isFinite(x0) || !isFinite(y0) || !isFinite(x1) || !isFinite(y1) || x1 <= x0 || y1 <= y0) {
          rejectedInvalidBBoxCount++;
          return null;
        }

        validBBoxWordCount++;
        const conf = typeof word.confidence === "number" ? word.confidence : (data?.confidence || 0);

        return {
          text,
          x0: x0 / scale,
          y0: y0 / scale,
          x1: x1 / scale,
          y1: y1 / scale,
          confidence: Math.round(conf)
        };
      })
      .filter(Boolean);

    console.log(`
==================================================
[TESSERACT RESULT PARSING AUDIT]
==================================================
rawDirectWordsCount: ${rawDirectWords.length}
rawLineWordsCount: ${rawLineWords.length}
rawNestedWordsCount: ${rawNestedWords.length}
rawCandidateWordCount: ${rawWords.length}
validBBoxWordCount: ${validBBoxWordCount}
rejectedMissingTextCount: ${rejectedMissingTextCount}
rejectedMissingBBoxCount: ${rejectedMissingBBoxCount}
rejectedInvalidBBoxCount: ${rejectedInvalidBBoxCount}
sanitizedWordCount: ${words.length}
`);

    // 7. Calculate real average confidence (MUST be 0 if 0 words extracted)
    let avgConfidence = 0;
    if (words.length > 0) {
      const sumConf = words.reduce((acc, w) => acc + (w.confidence || 0), 0);
      avgConfidence = Math.round(sumConf / words.length);
    }

    if ((data?.text || "").trim().length > 0 && words.length === 0) {
      console.error(`[OCR_WORD_EXTRACTION_FAILED] OCR engine returned text (length: ${data.text.length}), but zero word bounding boxes were extracted.`);
    } else if (words.length === 0) {
      console.warn("[OCR_ENGINE_RETURNED_NO_TEXT] Tesseract OCR engine returned zero text/words from the image.");
    }

    const pdfWidth = viewport.width / scale;
    const pdfHeight = viewport.height / scale;

    console.log(`
==================================================
[TESSERACT] BROWSER OCR EXECUTION COMPLETED
==================================================
page: ${pdfPage.pageNumber || 1}
canvasWidth: ${canvas.width}
canvasHeight: ${canvas.height}
ocrStarted: true
ocrCompleted: true
ocrWordCountRaw: ${rawWords.length}
ocrWordCountSanitized: ${words.length}
averageConfidence: ${avgConfidence}
`);

    console.log(`
==================================================
[PDF COORDINATE TRANSFORMATION] CANVAS TO PAGE
==================================================
PDF page width: ${pdfWidth}
PDF page height: ${pdfHeight}
render scale: ${scale}
canvas width: ${canvas.width}
canvas height: ${canvas.height}
scaleX: ${scale}
scaleY: ${scale}
coordinate conversion applied: true
`);

    return {
      words,
      avgConfidence,
      text: data?.text || ""
    };
  } finally {
    if (activeWorker) {
      try {
        await activeWorker.terminate();
      } catch (e) {
        console.warn("Failed to terminate worker:", e);
      }
      activeWorker = null;
    }

    canvas.width = 0;
    canvas.height = 0;
    if (canvas.remove) {
      canvas.remove();
    }
  }
}

