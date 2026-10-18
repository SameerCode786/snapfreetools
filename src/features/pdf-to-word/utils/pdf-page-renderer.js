/**
 * PDF Page Renderer for OCR and Image Conversion
 * Renders PDF.js page onto an off-screen HTML canvas safely with memory protection.
 */

export async function renderPageToCanvas(pdfPage, customScale = 2.0, enhanceContrast = true) {
  if (typeof document === "undefined") {
    throw new Error("Canvas rendering requires a browser environment.");
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });

  const scale = customScale;
  const viewport = pdfPage.getViewport({ scale });
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await pdfPage.render(renderContext).promise;

  // Lightweight contrast enhancement for scanned pages:
  // Cleans scanner background noise (gray tints, paper texture) to pure white,
  // preventing phantom "L i" artifacts and sharpening letter curves ('c' vs 'e').
  if (enhanceContrast && canvas.width > 0 && canvas.height > 0) {
    try {
      const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const len = data.length;

      // Single-pass background normalization
      for (let i = 0; i < len; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Fast luminance
        const lum = (r * 299 + g * 587 + b * 114) / 1000;

        // If background pixel is near white (> 220), clamp to pure white 255
        // This eliminates paper texture smudges and scanner edge dust
        if (lum > 220) {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        } else if (lum < 100) {
          // Deepen dark text strokes slightly for crisp recognition
          data[i] = Math.max(0, r * 0.85);
          data[i + 1] = Math.max(0, g * 0.85);
          data[i + 2] = Math.max(0, b * 0.85);
        }
      }

      context.putImageData(imgData, 0, 0);
    } catch (e) {
      // If getImageData fails (e.g. cross-origin canvas), safely retain original canvas
      console.warn("Canvas preprocessing skipped:", e);
    }
  }

  return canvas;
}

export function releaseCanvas(canvas) {
  if (!canvas) return;
  try {
    canvas.width = 0;
    canvas.height = 0;
    if (typeof canvas.remove === "function") {
      canvas.remove();
    }
  } catch (err) {
    console.warn("Error releasing canvas:", err);
  }
}
