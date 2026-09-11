import { createWorker } from 'tesseract.js';

// Module‑scoped reference to the active Tesseract worker for cancellation.
let currentWorker = null;

export function cancelCurrentOcr() {
  if (currentWorker) {
    // Terminate the worker; subsequent calls to recognize will fail gracefully.
    currentWorker.terminate();
    currentWorker = null;
  }
}

/**
 * Perform OCR on a PDF.js page and return an array of word objects.
 * This function renders the page to a canvas, runs Tesseract OCR in the browser,
 * and returns the recognized words with text, bbox, and confidence.
 *
 * @param {Object} pdfPage - PDF.js Page object.
 * @returns {Promise<Object[]>} Array of word objects containing text, bbox, and confidence.
 */
export async function ocrPage(pdfPage) {
  // Render page to an off‑screen canvas at a reasonable scale for OCR.
  const scale = 2; // Higher scale improves OCR accuracy.
  const viewport = pdfPage.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  // Render the PDF page into the canvas.
  await pdfPage.render({ canvasContext: context, viewport }).promise;

  // Create Tesseract worker, load language, and initialize.
  // Store worker globally for cancellation.
  currentWorker = await createWorker();
  await currentWorker.loadLanguage('eng');
  await currentWorker.initialize('eng');
  const worker = await createWorker();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');

  try {
    const { data } = await currentWorker.recognize(canvas);
    const words = (data?.words || []).map((word) => ({
      text: word.text,
      x0: word.bbox.x0,
      y0: word.bbox.y0,
      x1: word.bbox.x1,
      y1: word.bbox.y1,
      confidence: word.confidence
    }));
    // Group words into rows by y-coordinate tolerance
    const yTolerance = 10;
    const rows = [];
    words.forEach((w) => {
      let row = rows.find((r) => Math.abs(r.y - w.y0) <= yTolerance);
      if (row) {
        row.words.push(w);
      } else {
        rows.push({ y: w.y0, words: [w] });
      }
    });
    // Sort rows top‑to‑bottom (PDF y decreases upward)
    rows.sort((a, b) => b.y - a.y);
    // Convert each row into ordered cell texts, merging close words
    const rowCells = rows.map((r) => {
      r.words.sort((a, b) => a.x0 - b.x0);
      const cells = [];
      r.words.forEach((w) => {
        if (cells.length === 0) {
          cells.push({ text: w.text, x1: w.x1 });
        } else {
          const prev = cells[cells.length - 1];
          const gap = w.x0 - prev.x1;
          if (gap <= 8) {
            prev.text += ` ${w.text}`;
            prev.x1 = w.x1;
          } else {
            cells.push({ text: w.text, x1: w.x1 });
          }
        }
      });
      return cells.map((c) => c.text);
    });
    // Compute average confidence across all words
    const avgConfidence =
      words.length > 0
        ? words.reduce((sum, w) => sum + w.confidence, 0) / words.length
        : 0;
    return { rows: rowCells, avgConfidence };
  } finally {
    // Ensure the worker is terminated and canvas removed to free memory.
    if (currentWorker) {
      await currentWorker.terminate();
      currentWorker = null;
    }
    canvas.remove();
  }
}
