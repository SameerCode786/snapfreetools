import { jsPDF } from "jspdf";
import { calculatePageLayout } from "./layoutCalculator";

/**
 * Load an image from a URL/DataURL
 * @param {string} src 
 * @returns {Promise<HTMLImageElement>}
 */
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error("Failed to load image: " + e.message));
    img.src = src;
  });
};

/**
 * Convert an image to JPEG data URL using a Canvas
 * This standardizes format and allows compression
 * @param {HTMLImageElement} img 
 * @param {number} quality (0.1 to 1.0)
 * @returns {string}
 */
const compressImageToJpeg = (img, quality = 0.85) => {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  
  const ctx = canvas.getContext("2d");
  // Fill background with white in case of transparent PNGs
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  
  return canvas.toDataURL("image/jpeg", quality);
};

/**
 * Generate PDF from a list of image files
 * @param {Array<{id: string, url: string, name: string, type: string}>} images 
 * @param {object} settings { pageSize, orientation, margin, quality }
 * @param {function} onProgress (progressVal)
 * @returns {Promise<Blob>}
 */
export const generatePdfFromImages = async (images, settings, onProgress) => {
  const { pageSize = "fit", orientation = "auto", margin = "none", quality = 0.85 } = settings;
  
  // Calculate margin in mm
  let marginMm = 0;
  if (margin === "small") marginMm = 10;
  if (margin === "large") marginMm = 20;

  let doc = null;
  const total = images.length;

  for (let i = 0; i < total; i++) {
    onProgress(Math.round(((i + 0.1) / total) * 100));
    const imgData = images[i];
    
    // Load image
    const img = await loadImage(imgData.url);
    
    // Get natural dimensions
    const widthPx = img.naturalWidth || img.width;
    const heightPx = img.naturalHeight || img.height;
    
    const {
      pageWidth,
      pageHeight,
      pageOrientation,
      drawX,
      drawY,
      drawWidth,
      drawHeight
    } = calculatePageLayout(widthPx, heightPx, settings);

    // Initialize document or add page
    if (i === 0) {
      doc = new jsPDF({
        orientation: (pageSize === "a4" || pageSize === "letter") ? pageOrientation : "p",
        unit: "mm",
        format: (pageSize === "a4" || pageSize === "letter") ? pageSize : [pageWidth, pageHeight]
      });
    } else {
      doc.addPage(
        (pageSize === "a4" || pageSize === "letter") ? pageSize : [pageWidth, pageHeight],
        (pageSize === "a4" || pageSize === "letter") ? pageOrientation : "p"
      );
    }

    // Compress image to JPEG to keep size reasonable and standardize transparency
    const compressedDataUrl = compressImageToJpeg(img, quality);
    
    // Add to doc
    doc.addImage(compressedDataUrl, "JPEG", drawX, drawY, drawWidth, drawHeight, undefined, "FAST");
    
    onProgress(Math.round(((i + 1) / total) * 100));
  }

  if (!doc) {
    throw new Error("No images were provided for PDF generation.");
  }

  return doc.output("blob");
};
