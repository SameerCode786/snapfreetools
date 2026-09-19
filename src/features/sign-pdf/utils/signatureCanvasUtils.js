/**
 * Utility functions for signature creation, canvas drawing, auto-trimming,
 * and converting typed/drawn signatures to clean PNG data URLs.
 */

/**
 * Trims transparent whitespace margins around an image on a canvas.
 * Returns a new canvas tightly cropped to the signature bounding box.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number} [padding=10]
 * @returns {string} Trimmed PNG data URL
 */
export function trimCanvasWhitespace(canvas, padding = 8) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  if (width === 0 || height === 0) {
    return canvas.toDataURL("image/png");
  }

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let hasPixels = false;

  // Scan through alpha channel to find non-transparent bounding box
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alphaIndex = (y * width + x) * 4 + 3;
      const alpha = data[alphaIndex];

      if (alpha > 10) {
        hasPixels = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!hasPixels) {
    return canvas.toDataURL("image/png");
  }

  // Add padding around signature
  const cropX = Math.max(0, minX - padding);
  const cropY = Math.max(0, minY - padding);
  const cropWidth = Math.min(width - cropX, (maxX - minX + 1) + padding * 2);
  const cropHeight = Math.min(height - cropY, (maxY - minY + 1) + padding * 2);

  const trimmedCanvas = document.createElement("canvas");
  trimmedCanvas.width = cropWidth;
  trimmedCanvas.height = cropHeight;

  const trimmedCtx = trimmedCanvas.getContext("2d");
  trimmedCtx.drawImage(
    canvas,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  const dataUrl = trimmedCanvas.toDataURL("image/png");

  // Free memory
  trimmedCanvas.width = 0;
  trimmedCanvas.height = 0;

  return dataUrl;
}

/**
 * Signature calligraphy styles for typed signatures.
 */
export const SIGNATURE_FONTS = [
  {
    id: "cursive-1",
    name: "Classic Script",
    fontFamily: "'Brush Script MT', 'Segoe Script', 'Great Vibes', cursive",
    weight: "normal",
    slant: "italic",
    sizeMultiplier: 1.0
  },
  {
    id: "cursive-2",
    name: "Elegant Calligraphy",
    fontFamily: "'Lucida Handwriting', 'Snell Roundhand', 'Dancing Script', cursive",
    weight: "bold",
    slant: "italic",
    sizeMultiplier: 0.95
  },
  {
    id: "cursive-3",
    name: "Modern Flow",
    fontFamily: "'Caveat', 'Segoe Print', 'Comic Sans MS', cursive",
    weight: "600",
    slant: "normal",
    sizeMultiplier: 1.1
  },
  {
    id: "cursive-4",
    name: "Executive Signature",
    fontFamily: "'Monotype Corsiva', 'Apple Chancery', 'Brush Script MT', cursive",
    weight: "normal",
    slant: "italic",
    sizeMultiplier: 1.05
  }
];

/**
 * Generates a high-DPI transparent PNG data URL from a typed name and font style.
 *
 * @param {string} text
 * @param {Object} fontConfig
 * @param {string} [color="#0f172a"]
 * @returns {string} PNG Data URL
 */
export function generateTypedSignatureDataUrl(text, fontConfig = SIGNATURE_FONTS[0], color = "#0f172a") {
  const trimmedText = (text || "").trim();
  if (!trimmedText) return null;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // High-DPI render dimensions for ultra-crisp output in PDF
  const baseFontSize = 72 * (fontConfig.sizeMultiplier || 1.0);
  ctx.font = `${fontConfig.slant || "normal"} ${fontConfig.weight || "normal"} ${baseFontSize}px ${fontConfig.fontFamily}`;

  const textMetrics = ctx.measureText(trimmedText);
  const textWidth = Math.ceil(textMetrics.width);
  const textHeight = Math.ceil(baseFontSize * 1.5);

  canvas.width = textWidth + 80;
  canvas.height = textHeight + 40;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${fontConfig.slant || "normal"} ${fontConfig.weight || "normal"} ${baseFontSize}px ${fontConfig.fontFamily}`;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  ctx.fillText(trimmedText, canvas.width / 2, canvas.height / 2);

  // Trim whitespace
  const dataUrl = trimCanvasWhitespace(canvas, 10);

  canvas.width = 0;
  canvas.height = 0;

  return dataUrl;
}

/**
 * Validates and processes an uploaded signature image file (PNG / JPG).
 * Trims transparent whitespace and returns PNG data URL with dimensions.
 *
 * @param {File} file
 * @returns {Promise<{ dataUrl: string, width: number, height: number }>}
 */
export function processUploadedSignatureImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.match(/^image\/(png|jpeg|jpg|webp)$/i)) {
      return reject(new Error("Please upload a valid PNG, JPG, or WebP image file."));
    }

    if (file.size > 10 * 1024 * 1024) {
      return reject(new Error("Signature image file size must be less than 10 MB."));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Cap image to maximum 1200px width/height to prevent excessive memory usage
        let drawWidth = img.width;
        let drawHeight = img.height;
        const maxDimension = 1200;

        if (drawWidth > maxDimension || drawHeight > maxDimension) {
          if (drawWidth > drawHeight) {
            drawHeight = Math.round((drawHeight * maxDimension) / drawWidth);
            drawWidth = maxDimension;
          } else {
            drawWidth = Math.round((drawWidth * maxDimension) / drawHeight);
            drawHeight = maxDimension;
          }
        }

        canvas.width = drawWidth;
        canvas.height = drawHeight;
        ctx.drawImage(img, 0, 0, drawWidth, drawHeight);

        const dataUrl = trimCanvasWhitespace(canvas, 6);

        canvas.width = 0;
        canvas.height = 0;

        resolve({
          dataUrl,
          width: drawWidth,
          height: drawHeight
        });
      };
      img.onerror = () => {
        reject(new Error("Failed to decode image data."));
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read image file."));
    };
    reader.readAsDataURL(file);
  });
}
