import { renderPageToCanvas } from "./pdf-page-renderer";
import { formatOCRText } from "./ocr-text-formatter";

export function runOCR({ pdfDoc, onProgress }) {
  let isCancelled = false;
  let activeWorker = null;

  const promise = (async () => {
    const numPages = pdfDoc.numPages;
    const ocrResults = [];
    let totalConfidence = 0;

    // Safety limit of 10 pages maximum for OCR
    const maxOcrPages = Math.min(numPages, 10);

    try {
      // 1. Preparing OCR engine stage
      if (isCancelled) throw new Error("cancelled");
      onProgress("Preparing OCR engine...", 1, maxOcrPages, 5);

      const { createWorker } = await import("tesseract.js");

      // 2. Loading English language model stage
      if (isCancelled) throw new Error("cancelled");
      onProgress("Loading English language model...", 1, maxOcrPages, 12);

      // Create worker using locally served assets
      activeWorker = await createWorker("eng", 1, {
        workerPath: "/ocr/worker.min.js",
        corePath: "/ocr/tesseract-core-lstm.wasm.js",
        langPath: "/ocr/",
        logger: (m) => {
          if (isCancelled) return;
          // Tesseract triggers logging updates. We map status "recognizing text" to progress updates.
          if (m && m.status === "recognizing text") {
            const currentPg = ocrResults.length + 1;
            const pageProgress = Math.round(m.progress * 100);
            
            // Map individual page progress to overall progress:
            // Loading is 15%. Remaining 75% progress is split across maxOcrPages.
            const pageWeight = 75 / maxOcrPages;
            const currentOcrProgress = Math.round(
              15 + (ocrResults.length * pageWeight) + (m.progress * pageWeight)
            );
            
            onProgress(
              `Scanning page ${currentPg} of ${maxOcrPages} — ${pageProgress}%`,
              currentPg,
              maxOcrPages,
              currentOcrProgress
            );
          }
        }
      });

      for (let i = 1; i <= maxOcrPages; i++) {
        if (isCancelled) throw new Error("cancelled");

        // 3. Rendering page i stage
        onProgress(`Rendering page ${i} of ${maxOcrPages}...`, i, maxOcrPages, Math.round(15 + ((i - 1) / maxOcrPages) * 75));

        const page = await pdfDoc.getPage(i);
        const canvas = await renderPageToCanvas(page);

        if (isCancelled) {
          // Release canvas immediately
          canvas.width = 0;
          canvas.height = 0;
          throw new Error("cancelled");
        }

        // 4. Scanning page i stage
        onProgress(`Scanning page ${i} of ${maxOcrPages}...`, i, maxOcrPages, Math.round(15 + ((i - 0.8) / maxOcrPages) * 75));

        const { data } = await activeWorker.recognize(canvas);
        
        // Clean canvas immediately to release GPU memory allocation
        canvas.width = 0;
        canvas.height = 0;

        ocrResults.push({
          pageNumber: i,
          paragraphs: formatOCRText(data.text),
          confidence: data.confidence || 0
        });

        totalConfidence += data.confidence || 0;
      }

      // Cleanup worker
      if (activeWorker) {
        await activeWorker.terminate();
        activeWorker = null;
      }

      if (isCancelled) throw new Error("cancelled");

      const averageConfidence = maxOcrPages > 0 ? Math.round(totalConfidence / maxOcrPages) : 0;
      return { ocrResults, averageConfidence };

    } catch (err) {
      if (activeWorker) {
        try {
          await activeWorker.terminate();
        } catch (e) {
          console.error("Failed to terminate worker on error:", e);
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
        activeWorker.terminate().catch(err => console.error("Worker termination on cancel failed:", err));
        activeWorker = null;
      }
    }
  };
}
