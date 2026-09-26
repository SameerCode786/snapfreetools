/**
 * SnapFreeTools PDF to Text Extraction Engine
 * Uses browser-local pdfjs-dist via Web Workers for 100% client-side privacy.
 */

async function getPdfJsEngine() {
  let pdfjsModule;
  try {
    pdfjsModule = await import("pdfjs-dist");
  } catch {
    pdfjsModule = await import("pdfjs-dist/build/pdf.mjs");
  }
  const pdfjs = pdfjsModule.default || pdfjsModule;
  if (typeof window !== "undefined" && pdfjs.GlobalWorkerOptions) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  }
  return pdfjs;
}

import { ocrPage, cancelCurrentOcr } from "@/features/pdf-to-excel/utils/ocrHelper";

export { cancelCurrentOcr };

/**
 * Extracts plain text from an ArrayBuffer representing a PDF file natively.
 * 
 * @param {ArrayBuffer} arrayBuffer - Raw PDF file bytes
 * @param {Object} options - Extraction options
 * @param {Function} [options.onProgress] - Callback for progress (pageIndex, totalPages)
 * @returns {Promise<Object>} Extraction result containing pages, fullText, wordCount, characterCount, isScannedPDF
 */
export async function extractPdfText(arrayBuffer, options = {}) {
  const { onProgress } = options;

  let pdfjs;
  try {
    pdfjs = await getPdfJsEngine();
  } catch (err) {
    throw new Error("Failed to initialize browser PDF processing engine. Please refresh and try again.");
  }

  let pdfDoc;
  try {
    pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  } catch (err) {
    const errName = err?.name || "";
    const errMsg = err?.message || "";
    if (errName === "PasswordException" || errMsg.includes("Password") || errMsg.includes("encrypted")) {
      const passwordErr = new Error("PASSWORD_PROTECTED");
      passwordErr.code = "PASSWORD_PROTECTED";
      throw passwordErr;
    }
    const corruptErr = new Error("INVALID_OR_CORRUPT_PDF");
    corruptErr.code = "INVALID_OR_CORRUPT_PDF";
    throw corruptErr;
  }

  const numPages = pdfDoc.numPages;
  if (numPages === 0) {
    throw new Error("The selected PDF document contains no pages.");
  }

  const pages = [];
  let combinedText = "";

  for (let i = 1; i <= numPages; i++) {
    if (onProgress) {
      onProgress({
        current: i,
        total: numPages,
        percent: Math.round((i / numPages) * 100)
      });
    }

    try {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      
      let pageText = "";
      let lastY = null;

      if (textContent && textContent.items && textContent.items.length > 0) {
        for (const item of textContent.items) {
          if (!item.str) continue;

          // Check line break based on vertical offset (transform matrix Y-pos)
          if (lastY !== null && item.transform && Math.abs(item.transform[5] - lastY) > 6) {
            pageText += "\n";
          } else if (pageText.length > 0 && !pageText.endsWith("\n") && !pageText.endsWith(" ")) {
            pageText += " ";
          }

          pageText += item.str;

          if (item.transform) {
            lastY = item.transform[5];
          }
        }
      }

      const trimmedPageText = pageText.trim();
      pages.push({
        pageNumber: i,
        text: trimmedPageText
      });

      if (trimmedPageText) {
        if (combinedText) {
          combinedText += `\n\n--- Page ${i} ---\n\n`;
        }
        combinedText += trimmedPageText;
      }
    } catch (pageErr) {
      // Individual page extract warning fallback
      pages.push({
        pageNumber: i,
        text: `[Page ${i}: Unable to parse text content]`
      });
    }
  }

  const characterCount = combinedText.length;
  // Word count calculation using regex split on whitespace
  const words = combinedText.trim() ? combinedText.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  // Detect scanned / image-only PDFs (no digital text extracted across pages)
  const isScannedPDF = characterCount < 10 && numPages > 0;

  return {
    pages,
    fullText: combinedText,
    pageCount: numPages,
    wordCount,
    characterCount,
    isScannedPDF,
    isOcrResult: false
  };
}

/**
 * Extracts plain text from a scanned/image PDF using in-browser Tesseract.js OCR engine.
 * 
 * @param {ArrayBuffer} arrayBuffer - Raw PDF file bytes
 * @param {Object} options - Extraction options including onProgress callback
 * @returns {Promise<Object>} Extraction result containing pages, fullText, wordCount, characterCount, avgConfidence, isLowConfidence
 */
export async function extractPdfTextWithOcr(arrayBuffer, options = {}) {
  const { onProgress } = options;

  let pdfjs;
  try {
    pdfjs = await getPdfJsEngine();
  } catch (err) {
    throw new Error("Failed to initialize browser PDF processing engine. Please refresh and try again.");
  }

  let pdfDoc;
  try {
    pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  } catch (err) {
    const errName = err?.name || "";
    const errMsg = err?.message || "";
    if (errName === "PasswordException" || errMsg.includes("Password") || errMsg.includes("encrypted")) {
      const passwordErr = new Error("PASSWORD_PROTECTED");
      passwordErr.code = "PASSWORD_PROTECTED";
      throw passwordErr;
    }
    const corruptErr = new Error("INVALID_OR_CORRUPT_PDF");
    corruptErr.code = "INVALID_OR_CORRUPT_PDF";
    throw corruptErr;
  }

  const numPages = pdfDoc.numPages;
  if (numPages === 0) {
    throw new Error("The selected PDF document contains no pages.");
  }

  const pages = [];
  let combinedText = "";
  let totalConfidenceSum = 0;
  let pagesWithTextCount = 0;

  if (onProgress) {
    onProgress({
      message: "Preparing OCR engine...",
      current: 0,
      total: numPages,
      percent: 5
    });
  }

  for (let i = 1; i <= numPages; i++) {
    if (onProgress) {
      onProgress({
        message: `Rendering page ${i} of ${numPages}...`,
        current: i,
        total: numPages,
        percent: Math.round(5 + ((i - 0.8) / numPages) * 85)
      });
    }

    const page = await pdfDoc.getPage(i);

    if (onProgress) {
      onProgress({
        message: `Recognizing text on page ${i} of ${numPages}...`,
        current: i,
        total: numPages,
        percent: Math.round(5 + ((i - 0.3) / numPages) * 85)
      });
    }

    const ocrRes = await ocrPage(page, {
      onProgress: (subMsg) => {
        if (onProgress) {
          onProgress({
            message: `Page ${i}/${numPages}: ${subMsg}`,
            current: i,
            total: numPages,
            percent: Math.round(5 + ((i - 0.5) / numPages) * 85)
          });
        }
      }
    });

    const pageText = (ocrRes.text || "").trim();
    const conf = ocrRes.avgConfidence || 0;

    pages.push({
      pageNumber: i,
      text: pageText,
      confidence: conf
    });

    if (pageText.length > 0 || conf > 0) {
      totalConfidenceSum += conf;
      pagesWithTextCount++;
    }

    if (pageText) {
      if (combinedText) {
        combinedText += `\n\n--- Page ${i} ---\n\n`;
      }
      combinedText += pageText;
    }
  }

  if (onProgress) {
    onProgress({
      message: "Combining extracted text...",
      current: numPages,
      total: numPages,
      percent: 95
    });
  }

  const characterCount = combinedText.length;
  const words = combinedText.trim() ? combinedText.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  if (characterCount === 0) {
    const noTextErr = new Error("NO_OCR_TEXT_FOUND");
    noTextErr.code = "NO_OCR_TEXT_FOUND";
    throw noTextErr;
  }

  const overallAvgConfidence = pagesWithTextCount > 0
    ? Math.round(totalConfidenceSum / pagesWithTextCount)
    : 0;

  if (onProgress) {
    onProgress({
      message: "Finalizing result...",
      current: numPages,
      total: numPages,
      percent: 100
    });
  }

  return {
    pages,
    fullText: combinedText,
    pageCount: numPages,
    wordCount,
    characterCount,
    isScannedPDF: false,
    isOcrResult: true,
    avgConfidence: overallAvgConfidence,
    isLowConfidence: overallAvgConfidence < 70
  };
}

