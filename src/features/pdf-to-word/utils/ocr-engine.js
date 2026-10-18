/**
 * Modular OCR Engine for SnapFreeTools PDF to Word
 * 100% Client-Side In-Browser OCR using Tesseract.js v7.
 * Supports progress tracking, cancelability, memory optimization, and multilingual models.
 */

import { renderPageToCanvas, releaseCanvas } from "./pdf-page-renderer.js";
import { formatOCRText } from "./ocr-text-formatter.js";

export const MAX_OCR_PAGES = 10;

export const SUPPORTED_OCR_LANGUAGES = [
  { code: "eng", name: "English (Default & Offline)", isOffline: true },
  { code: "spa", name: "Spanish (Español)", isOffline: false },
  { code: "fra", name: "French (Français)", isOffline: false },
  { code: "deu", name: "German (Deutsch)", isOffline: false },
  { code: "ita", name: "Italian (Italiano)", isOffline: false },
  { code: "por", name: "Portuguese (Português)", isOffline: false },
];

export function isLanguageSupported(langCode) {
  return SUPPORTED_OCR_LANGUAGES.some((lang) => lang.code === langCode);
}

/**
 * Executes in-browser OCR on a PDF document.
 * 
 * @param {Object} params
 * @param {Object} params.pdfDoc - PDF.js document instance
 * @param {string} [params.lang="eng"] - OCR language code
 * @param {string} [params.quality="balanced"] - "balanced" (scale 2.0) | "fast" (scale 1.5) | "high" (scale 2.5)
 * @param {Object} [params.pageInspection] - Optional cached page inspection results from upload
 * @param {Function} [params.onProgress] - Progress callback: (status, current, total, percent) => void
 * @returns {{ promise: Promise<Object>, cancel: () => void }}
 */
export function runOCR({
  pdfDoc,
  lang = "eng",
  quality = "balanced",
  pageInspection = null,
  onProgress = () => {},
}) {
  let isCancelled = false;
  let activeWorker = null;

  const promise = (async () => {
    // 1. Language validation
    const targetLang = (lang || "eng").toLowerCase().trim();
    if (!isLanguageSupported(targetLang)) {
      const err = new Error(
        `The selected language '${targetLang}' is not supported. Supported languages are: ${SUPPORTED_OCR_LANGUAGES.map((l) => l.name).join(", ")}.`
      );
      err.code = "UNSUPPORTED_LANGUAGE";
      throw err;
    }

    const numPages = pdfDoc.numPages;

    // 2. Page limit validation (10 pages)
    if (numPages > MAX_OCR_PAGES) {
      const err = new Error(
        `This free in-browser OCR version supports up to ${MAX_OCR_PAGES} pages per document to prevent memory exhaustion. Please split larger documents and convert in batches.`
      );
      err.code = "LIMIT_EXCEEDED";
      throw err;
    }

    // Determine render scale and DPI based on quality setting
    let renderScale = 2.0;
    let targetDpi = "150";
    if (quality === "fast") {
      renderScale = 1.5;
      targetDpi = "110";
    } else if (quality === "high") {
      renderScale = 2.5;
      targetDpi = "180";
    }

    const ocrResults = [];
    let totalConfidence = 0;
    let confidencePageCount = 0;

    try {
      if (isCancelled) throw new Error("cancelled");

      // 3. Stage 1: Initializing OCR engine
      onProgress("Initializing local OCR engine...", 1, numPages, 5);

      const { createWorker } = await import("tesseract.js");

      if (isCancelled) throw new Error("cancelled");

      // 4. Configure asset paths
      // If English, use locally bundled files in /ocr/ (100% offline, zero network requests)
      // If another language, use official CDN for that traineddata model
      const isEnglish = targetLang === "eng";
      const workerPath = "/ocr/worker.min.js";
      const corePath = "/ocr/tesseract-core-lstm.wasm.js";
      const langPath = isEnglish ? "/ocr/" : "https://tessdata.projectnaptha.com/4.0.0/";

      onProgress(
        isEnglish ? "Loading local English OCR model..." : `Loading ${targetLang.toUpperCase()} language model...`,
        1,
        numPages,
        12
      );

      try {
        activeWorker = await createWorker(targetLang, 1, {
          workerPath,
          corePath,
          langPath,
          logger: (m) => {
            if (isCancelled) return;
            if (m && m.status === "recognizing text") {
              const currentPg = ocrResults.length + 1;
              const pagePct = Math.round((m.progress || 0) * 100);
              const pageWeight = 75 / numPages;
              const overallPercent = Math.min(
                90,
                Math.round(15 + ocrResults.length * pageWeight + (m.progress || 0) * pageWeight)
              );

              onProgress(
                `Scanning page ${currentPg} of ${numPages} (${pagePct}%)...`,
                currentPg,
                numPages,
                overallPercent
              );
            }
          },
        });

        // Configure Tesseract layout parameters for typography
        await activeWorker.setParameters({
          user_defined_dpi: targetDpi,
          preserve_interword_spaces: "1",
        });
      } catch (workerInitErr) {
        if (isCancelled) throw new Error("cancelled");
        console.error("Worker initialization error:", workerInitErr);
        const err = new Error(
          isEnglish
            ? "Failed to initialize local OCR engine. Please refresh and try again."
            : `Failed to load OCR language model for '${targetLang}'. Please ensure you have an internet connection or select English.`
        );
        err.code = "LANGUAGE_LOAD_FAILED";
        throw err;
      }

      if (isCancelled) throw new Error("cancelled");

      // 5. Process each page sequentially to conserve browser memory
      for (let i = 1; i <= numPages; i++) {
        if (isCancelled) throw new Error("cancelled");

        const page = await pdfDoc.getPage(i);

        // Check if page already has native digital text
        // Optimize: If pageInspection already confirmed purely scanned, skip getTextContent
        let hasNativeDigitalText = false;
        let nativeText = "";

        if (pageInspection && pageInspection.isPurelyScanned) {
          hasNativeDigitalText = false;
        } else {
          const textContent = await page.getTextContent();
          nativeText = (textContent.items || [])
            .filter((item) => typeof item.str === "string")
            .map((item) => item.str)
            .join(" ")
            .trim();

          if (nativeText.length >= 50) {
            hasNativeDigitalText = true;
          }
        }

        // If page has substantial selectable text (mixed PDF), preserve native text directly
        if (hasNativeDigitalText) {
          onProgress(`Processing native text for page ${i} of ${numPages}...`, i, numPages, Math.round(15 + ((i - 0.5) / numPages) * 75));
          
          const paragraphs = formatOCRText(nativeText);
          ocrResults.push({
            pageNumber: i,
            paragraphs,
            confidence: 100,
            isOcr: false,
          });
          continue;
        }

        // Page is scanned or has no text: render to canvas and perform OCR
        onProgress(`Rendering page ${i} of ${numPages}...`, i, numPages, Math.round(15 + ((i - 0.9) / numPages) * 75));

        let canvas = null;
        try {
          canvas = await renderPageToCanvas(page, renderScale, true);

          if (isCancelled) {
            releaseCanvas(canvas);
            throw new Error("cancelled");
          }

          onProgress(`Scanning page ${i} of ${numPages}...`, i, numPages, Math.round(15 + ((i - 0.5) / numPages) * 75));

          const { data } = await activeWorker.recognize(
            canvas,
            {},
            { text: true, blocks: true }
          );

          // Clean canvas immediately to release GPU/tab memory
          releaseCanvas(canvas);
          canvas = null;

          const pageConfidence = typeof data.confidence === "number" ? data.confidence : 0;
          totalConfidence += pageConfidence;
          confidencePageCount++;

          const paragraphs = formatOCRText(data.text || "");

          ocrResults.push({
            pageNumber: i,
            paragraphs,
            confidence: Math.round(pageConfidence),
            isOcr: true,
          });
        } catch (pageErr) {
          if (canvas) releaseCanvas(canvas);
          if (pageErr.message === "cancelled") throw pageErr;
          console.warn(`OCR failed on page ${i}:`, pageErr);
          // Fallback to empty page result so document compilation can continue
          ocrResults.push({
            pageNumber: i,
            paragraphs: [],
            confidence: 0,
            isOcr: true,
          });
        }
      }

      // Cleanup worker upon completion
      if (activeWorker) {
        await activeWorker.terminate();
        activeWorker = null;
      }

      if (isCancelled) throw new Error("cancelled");

      // Check if any readable text was extracted
      let totalTextLength = 0;
      for (const res of ocrResults) {
        for (const p of res.paragraphs) {
          const text = typeof p === "string" ? p : (p?.text || "");
          totalTextLength += text.trim().length;
        }
      }

      if (totalTextLength === 0) {
        const err = new Error(
          "OCR completed, but no readable text was detected. The scanned pages may be blank, faint, or low resolution. Please try a clearer scan."
        );
        err.code = "NO_TEXT_FOUND";
        throw err;
      }

      const averageConfidence =
        confidencePageCount > 0 ? Math.round(totalConfidence / confidencePageCount) : 100;

      return {
        ocrResults,
        averageConfidence,
        pageCount: numPages,
      };
    } catch (err) {
      if (activeWorker) {
        try {
          await activeWorker.terminate();
        } catch (e) {
          console.warn("Failed to terminate active worker on error:", e);
        }
        activeWorker = null;
      }
      throw err;
    }
  })();

  return {
    promise,
    cancel: () => {
      isCancelled = true;
      if (activeWorker) {
        activeWorker.terminate().catch((err) => console.warn("Worker termination on cancel failed:", err));
        activeWorker = null;
      }
    },
  };
}
