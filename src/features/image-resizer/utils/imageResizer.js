/**
 * High-Performance Client-Side Image Resizing Engine
 * Uses HTML5 Canvas API with high-quality smoothing, memory safety, and format conversion.
 */

// Maximum safe total canvas pixel count (64 megapixels e.g. 8000x8000) to prevent memory crash
export const MAX_SAFE_CANVAS_PIXELS = 64 * 1024 * 1024;
export const MAX_DIMENSION_LIMIT = 12000;

/**
 * Calculate Greatest Common Divisor for Aspect Ratio
 */
export function getGCD(a, b) {
  return b === 0 ? a : getGCD(b, a % b);
}

/**
 * Get formatted aspect ratio string e.g. "16:9", "4:3", "1:1"
 */
export function getAspectRatioString(width, height) {
  if (!width || !height) return "1:1";
  const gcd = getGCD(width, height);
  const w = Math.round(width / gcd);
  const h = Math.round(height / gcd);
  if (w > 30 || h > 30) {
    const ratio = (width / height).toFixed(2);
    return `${ratio}:1`;
  }
  return `${w}:${h}`;
}

/**
 * Decode File into Image Element & extract metadata
 */
export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Selected file is not a valid image."));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      const gcd = getGCD(width, height);
      
      resolve({
        file,
        imgElement: img,
        objectUrl,
        name: file.name,
        type: file.type,
        size: file.size,
        width,
        height,
        aspectRatio: width / height,
        aspectRatioStr: getAspectRatioString(width, height)
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to decode image file in browser. The file might be corrupted or unsupported."));
    };

    img.src = objectUrl;
  });
}

/**
 * Calculate Target Dimensions based on Mode & Options
 */
export function calculateTargetDimensions(originalWidth, originalHeight, mode, options = {}) {
  const origRatio = originalWidth / originalHeight;

  switch (mode) {
    case "percentage": {
      const pct = Math.max(1, Math.min(500, Number(options.percentage) || 100)) / 100;
      const targetW = Math.max(1, Math.round(originalWidth * pct));
      const targetH = Math.max(1, Math.round(originalHeight * pct));
      return { width: targetW, height: targetH };
    }

    case "fit": {
      const maxW = Number(options.fitWidth) || originalWidth;
      const maxH = Number(options.fitHeight) || originalHeight;
      let targetW = originalWidth;
      let targetH = originalHeight;

      if (targetW > maxW) {
        targetW = maxW;
        targetH = Math.round(targetW / origRatio);
      }
      if (targetH > maxH) {
        targetH = maxH;
        targetW = Math.round(targetH * origRatio);
      }
      return { width: Math.max(1, targetW), height: Math.max(1, targetH) };
    }

    case "width-only": {
      const targetW = Math.max(1, Number(options.width) || originalWidth);
      const targetH = Math.max(1, Math.round(targetW / origRatio));
      return { width: targetW, height: targetH };
    }

    case "height-only": {
      const targetH = Math.max(1, Number(options.height) || originalHeight);
      const targetW = Math.max(1, Math.round(targetH * origRatio));
      return { width: targetW, height: targetH };
    }

    case "fill": {
      // Exact dimensions for cropping
      const targetW = Math.max(1, Number(options.width) || originalWidth);
      const targetH = Math.max(1, Number(options.height) || originalHeight);
      return { width: targetW, height: targetH, crop: true };
    }

    case "custom":
    default: {
      let targetW = Math.max(1, Number(options.width) || originalWidth);
      let targetH = Math.max(1, Number(options.height) || originalHeight);

      if (options.lockAspectRatio) {
        if (options.lastChanged === "height") {
          targetW = Math.max(1, Math.round(targetH * origRatio));
        } else {
          targetH = Math.max(1, Math.round(targetW / origRatio));
        }
      }
      return { width: targetW, height: targetH };
    }
  }
}

/**
 * Main Client-Side Image Resizing Canvas Processor
 */
export async function processImageResize({
  imgElement,
  originalFile,
  targetWidth,
  targetHeight,
  outputFormat = "original",
  quality = 0.90,
  backgroundColor = "#FFFFFF",
  crop = false,
  targetSizeKb = null
}) {
  if (!imgElement) throw new Error("No image loaded for processing.");

  // Canvas Size & Safety Checks
  if (targetWidth > MAX_DIMENSION_LIMIT || targetHeight > MAX_DIMENSION_LIMIT) {
    throw new Error(`Target dimensions (${targetWidth}×${targetHeight}) exceed max limit of ${MAX_DIMENSION_LIMIT}px.`);
  }

  const totalPixels = targetWidth * targetHeight;
  if (totalPixels > MAX_SAFE_CANVAS_PIXELS) {
    throw new Error(`Target canvas memory requirements (${Math.round(totalPixels / 1e6)}MP) exceed browser safe limit.`);
  }

  // Determine Output MIME type & Extension
  let mimeType = originalFile.type || "image/jpeg";
  let extension = originalFile.name.split(".").pop() || "jpg";

  if (outputFormat === "jpeg") {
    mimeType = "image/jpeg";
    extension = "jpg";
  } else if (outputFormat === "png") {
    mimeType = "image/png";
    extension = "png";
  } else if (outputFormat === "webp") {
    mimeType = "image/webp";
    extension = "webp";
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d", { alpha: mimeType !== "image/jpeg" });
  if (!ctx) throw new Error("Could not initialize 2D canvas context.");

  // High quality smoothing setup
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Fill background if converting to JPEG (which lacks alpha) or if explicit non-transparent color requested
  if (mimeType === "image/jpeg") {
    ctx.fillStyle = (backgroundColor && backgroundColor !== "transparent") ? backgroundColor : "#FFFFFF";
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  } else if (backgroundColor && backgroundColor !== "transparent") {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  // Draw image (Normal or Center Crop)
  if (crop) {
    const srcW = imgElement.naturalWidth || imgElement.width;
    const srcH = imgElement.naturalHeight || imgElement.height;
    const srcRatio = srcW / srcH;
    const targetRatio = targetWidth / targetHeight;

    let renderW = srcW;
    let renderH = srcH;
    let cropX = 0;
    let cropY = 0;

    if (srcRatio > targetRatio) {
      renderW = srcH * targetRatio;
      cropX = (srcW - renderW) / 2;
    } else {
      renderH = srcW / targetRatio;
      cropY = (srcH - renderH) / 2;
    }

    ctx.drawImage(imgElement, cropX, cropY, renderW, renderH, 0, 0, targetWidth, targetHeight);
  } else {
    ctx.drawImage(imgElement, 0, 0, targetWidth, targetHeight);
  }

  // Target KB size optimization loop (for lossy formats JPEG/WebP)
  let effectiveQuality = quality;
  if (targetSizeKb && (mimeType === "image/jpeg" || mimeType === "image/webp")) {
    const targetBytes = targetSizeKb * 1024;
    let minQ = 0.1;
    let maxQ = 1.0;
    let bestBlob = null;

    for (let i = 0; i < 5; i++) {
      const midQ = (minQ + maxQ) / 2;
      const testBlob = await new Promise(resolve => canvas.toBlob(resolve, mimeType, midQ));
      if (!testBlob) break;
      bestBlob = testBlob;
      if (testBlob.size > targetBytes) {
        maxQ = midQ;
      } else {
        minQ = midQ;
      }
    }
    if (bestBlob) {
      const blobUrl = URL.createObjectURL(bestBlob);
      const originalBaseName = originalFile.name.substring(0, originalFile.name.lastIndexOf(".")) || "image";
      const outFilename = `${originalBaseName}-resized.${extension}`;
      return buildResultObject(bestBlob, blobUrl, outFilename, targetWidth, targetHeight, mimeType, originalFile.size);
    }
  }

  // Default export blob
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Failed to export image canvas to Blob."));
      },
      mimeType,
      effectiveQuality
    );
  });

  const blobUrl = URL.createObjectURL(blob);
  const originalBaseName = originalFile.name.substring(0, originalFile.name.lastIndexOf(".")) || "image";
  const outFilename = `${originalBaseName}-resized.${extension}`;

  return buildResultObject(blob, blobUrl, outFilename, targetWidth, targetHeight, mimeType, originalFile.size);
}

function buildResultObject(blob, blobUrl, filename, width, height, type, originalSize) {
  const newSize = blob.size;
  const isSaved = newSize < originalSize;
  const diffBytes = Math.abs(originalSize - newSize);
  const percentChange = Math.round((diffBytes / originalSize) * 100);

  return {
    blob,
    blobUrl,
    filename,
    width,
    height,
    size: newSize,
    type,
    aspectRatioStr: getAspectRatioString(width, height),
    isSaved,
    percentChange,
    diffBytes
  };
}
