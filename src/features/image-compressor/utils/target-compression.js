/**
 * Native HTML5 Canvas image encoder with optional dimension scaling.
 * Preserves alpha transparency for PNG, WebP, and AVIF; fills white background only for JPEG.
 * Rejects if requested AVIF export silently falls back to a different MIME type in the browser.
 */
export async function compressCanvas(
  img,
  quality,
  mimeType,
  width = img.naturalWidth,
  height = img.naturalHeight
) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width));
    canvas.height = Math.max(1, Math.round(height));
    const ctx = canvas.getContext("2d");
    if (!ctx) return reject(new Error("Canvas context extraction failed"));

    if (mimeType === "image/jpeg") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("toBlob output empty"));
          return;
        }
        if (mimeType === "image/avif" && blob.type !== "image/avif") {
          reject(new Error("AVIF encoding unsupported by browser"));
          return;
        }
        resolve(blob);
      },
      mimeType,
      mimeType === "image/png" ? undefined : quality
    );
  });
}

/**
 * Lossless PNG compressor that preserves alpha transparency and adjusts pixel dimensions.
 */
export async function compressPNGScale(img, scale) {
  try {
    return await compressCanvas(
      img,
      undefined,
      "image/png",
      img.naturalWidth * scale,
      img.naturalHeight * scale
    );
  } catch {
    return null;
  }
}

async function encodeWithAvifFallback(img, quality, targetFormat, width, height) {
  try {
    const blob = await compressCanvas(img, quality, targetFormat, width, height);
    return {
      blob,
      actualFormat: blob.type || targetFormat,
      avifFallback: false
    };
  } catch {
    if (targetFormat === "image/avif") {
      const blob = await compressCanvas(img, quality, "image/webp", width, height);
      return {
        blob,
        actualFormat: blob.type || "image/webp",
        avifFallback: true
      };
    }
    throw new Error("Canvas encoding failed");
  }
}

function stepDimensionScaleDown(img, currentScale, targetBytes, currentSize) {
  const maxDim = Math.max(img.naturalWidth, img.naturalHeight);
  const minPossibleScale = 1 / maxDim;
  if (currentScale <= minPossibleScale) return minPossibleScale;

  const ratio = Math.sqrt(targetBytes / Math.max(1, currentSize)) * 0.94;
  let nextScale = Math.max(minPossibleScale, currentScale * Math.min(0.92, ratio));

  // Ensure at least a 1px reduction on the longest side while above 1x1
  const currentMaxPx = Math.max(1, Math.round(maxDim * currentScale));
  const nextMaxPx = Math.max(1, Math.round(maxDim * nextScale));
  if (nextMaxPx >= currentMaxPx && currentMaxPx > 1) {
    nextScale = Math.max(minPossibleScale, (currentMaxPx - 1) / maxDim);
  }
  return nextScale;
}

async function optimizePngToTarget({ img, targetBytes, initialBlob }) {
  let candidateBlob = initialBlob || (await compressPNGScale(img, 1.0));
  if (!candidateBlob) {
    return { blob: null, qualityUsed: 1.0, scaleUsed: 1.0 };
  }
  if (candidateBlob.size <= targetBytes) {
    return { blob: candidateBlob, qualityUsed: 1.0, scaleUsed: 1.0 };
  }

  const maxDim = Math.max(img.naturalWidth, img.naturalHeight);
  let minScale = Math.max(1 / maxDim, Math.min(0.05, 8 / maxDim));
  let maxScale = 0.98;
  let bestUnderBlob = null;
  let bestUnderScale = minScale;
  let smallestBlob = candidateBlob;
  let smallestScale = 1.0;

  for (let step = 0; step < 8; step++) {
    const mid = (minScale + maxScale) / 2;
    const tempBlob = await compressPNGScale(img, mid);
    if (!tempBlob) continue;

    if (tempBlob.size < smallestBlob.size) {
      smallestBlob = tempBlob;
      smallestScale = mid;
    }

    if (tempBlob.size <= targetBytes) {
      if (!bestUnderBlob || tempBlob.size > bestUnderBlob.size) {
        bestUnderBlob = tempBlob;
        bestUnderScale = mid;
      }
      minScale = mid;
    } else {
      maxScale = mid;
    }
  }

  candidateBlob = bestUnderBlob || smallestBlob;
  let currentScale = bestUnderBlob ? bestUnderScale : smallestScale;

  // Safe final validation loop for extreme resolution PNGs
  for (let iter = 0; iter < 8 && candidateBlob.size > targetBytes; iter++) {
    const nextScale = stepDimensionScaleDown(img, currentScale, targetBytes, candidateBlob.size);
    const retryBlob = await compressPNGScale(img, nextScale);
    if (!retryBlob) break;
    if (retryBlob.size < candidateBlob.size) {
      candidateBlob = retryBlob;
      currentScale = nextScale;
    } else if (nextScale === currentScale) {
      break;
    } else {
      currentScale = nextScale;
    }
    if (Math.round(maxDim * currentScale) <= 1) break;
  }

  return {
    blob: candidateBlob,
    qualityUsed: currentScale,
    scaleUsed: currentScale
  };
}

async function optimizeLossyToTarget({ img, targetFormat, targetBytes }) {
  let currentFormat = targetFormat;
  let minQ = 0.12;
  let maxQ = 1.0;
  let bestUnderBlob = null;
  let bestUnderQ = 0.8;
  let smallestBlob = null;
  let smallestQ = 0.8;
  let avifFallback = false;

  // Phase 1: Quality bisection at full native dimensions
  for (let step = 0; step < 8; step++) {
    const q = (minQ + maxQ) / 2;
    const res = await encodeWithAvifFallback(
      img,
      q,
      currentFormat,
      img.naturalWidth,
      img.naturalHeight
    );
    if (res.avifFallback) {
      currentFormat = res.actualFormat;
      avifFallback = true;
    } else {
      currentFormat = res.actualFormat;
    }

    const tempBlob = res.blob;
    if (!tempBlob) continue;

    // Handle browsers falling back to lossless PNG for unsupported MIME types (e.g., BMP/GIF)
    if (currentFormat === "image/png") {
      const pngRes = await optimizePngToTarget({ img, targetBytes, initialBlob: tempBlob });
      return { ...pngRes, actualFormat: "image/png", avifFallback };
    }

    if (!smallestBlob || tempBlob.size < smallestBlob.size) {
      smallestBlob = tempBlob;
      smallestQ = q;
    }

    if (tempBlob.size <= targetBytes) {
      if (!bestUnderBlob || tempBlob.size > bestUnderBlob.size) {
        bestUnderBlob = tempBlob;
        bestUnderQ = q;
      }
      minQ = q;
    } else {
      maxQ = q;
    }
  }

  if (bestUnderBlob) {
    return {
      blob: bestUnderBlob,
      qualityUsed: bestUnderQ,
      actualFormat: currentFormat,
      scaleUsed: 1.0,
      avifFallback
    };
  }

  // Phase 2: Dimension scaling search at readable quality (0.65)
  const scaleQuality = 0.65;
  const maxDim = Math.max(img.naturalWidth, img.naturalHeight);
  let scaleMin = Math.max(1 / maxDim, 0.08);
  let scaleMax = 0.95;
  let scaleUnderBlob = null;
  let scaleUnderVal = 0.5;
  let scaledSmallestBlob = smallestBlob;
  let scaledSmallestVal = 1.0;
  let scaledSmallestQ = smallestQ;

  for (let s = 0; s < 7; s++) {
    const scale = (scaleMin + scaleMax) / 2;
    const res = await encodeWithAvifFallback(
      img,
      scaleQuality,
      currentFormat,
      img.naturalWidth * scale,
      img.naturalHeight * scale
    );
    currentFormat = res.actualFormat;
    const sBlob = res.blob;
    if (!sBlob) continue;

    if (!scaledSmallestBlob || sBlob.size < scaledSmallestBlob.size) {
      scaledSmallestBlob = sBlob;
      scaledSmallestVal = scale;
      scaledSmallestQ = scaleQuality;
    }

    if (sBlob.size <= targetBytes) {
      if (!scaleUnderBlob || sBlob.size > scaleUnderBlob.size) {
        scaleUnderBlob = sBlob;
        scaleUnderVal = scale;
      }
      scaleMin = scale;
    } else {
      scaleMax = scale;
    }
  }

  let candidateBlob = scaleUnderBlob || scaledSmallestBlob;
  let currentScale = scaleUnderBlob ? scaleUnderVal : scaledSmallestVal;
  let currentQuality = scaleUnderBlob ? scaleQuality : scaledSmallestQ;

  // Phase 3: Safe Final Validation Loop (maintains currentScale so dimensions never inflate back)
  if (candidateBlob && candidateBlob.size > targetBytes) {
    // Try stepping quality down at the active scale first
    if (currentQuality > 0.15) {
      for (
        let qTry = currentQuality - 0.12;
        qTry >= 0.05 && candidateBlob.size > targetBytes;
        qTry -= 0.12
      ) {
        const clampedQ = Math.max(0.05, qTry);
        const res = await encodeWithAvifFallback(
          img,
          clampedQ,
          currentFormat,
          img.naturalWidth * currentScale,
          img.naturalHeight * currentScale
        );
        if (res.blob && res.blob.size < candidateBlob.size) {
          candidateBlob = res.blob;
          currentQuality = clampedQ;
        }
      }
    }

    // If still over targetBytes, adaptively scale dimensions downward
    for (let iter = 0; iter < 8 && candidateBlob.size > targetBytes; iter++) {
      const nextScale = stepDimensionScaleDown(img, currentScale, targetBytes, candidateBlob.size);
      const retryQuality = Math.round(maxDim * nextScale) < 64 ? 0.25 : Math.min(currentQuality, 0.55);
      const res = await encodeWithAvifFallback(
        img,
        retryQuality,
        currentFormat,
        img.naturalWidth * nextScale,
        img.naturalHeight * nextScale
      );
      if (!res.blob) break;
      if (res.blob.size < candidateBlob.size) {
        candidateBlob = res.blob;
        currentScale = nextScale;
        currentQuality = retryQuality;
      } else if (nextScale === currentScale) {
        break;
      } else {
        currentScale = nextScale;
      }
      if (Math.round(maxDim * currentScale) <= 1) break;
    }
  }

  return {
    blob: candidateBlob,
    qualityUsed: currentQuality,
    actualFormat: currentFormat,
    scaleUsed: currentScale,
    avifFallback
  };
}

/**
 * Compresses an image to meet actualFileSize <= targetBytes wherever technically possible.
 * Never inflates files already smaller than targetBytes and preserves PNG transparency.
 */
export async function compressToTargetSize({
  img,
  originalFile,
  originalFormat,
  targetFormat,
  targetBytes
}) {
  const isSameFormat =
    (targetFormat === "image/jpeg" && originalFormat === "JPG") ||
    (targetFormat === "image/png" && originalFormat === "PNG") ||
    (targetFormat === "image/webp" && originalFormat === "WEBP") ||
    (targetFormat === "image/avif" && originalFormat === "AVIF");

  // Do not inflate or degrade files already <= targetBytes
  if (originalFile.size <= targetBytes) {
    if (isSameFormat) {
      return {
        blob: originalFile,
        qualityUsed: 1.0,
        actualFormat: targetFormat,
        scaleUsed: 1.0,
        targetMet: true,
        preservedOriginal: true,
        avifFallback: false
      };
    }

    const res =
      targetFormat === "image/png"
        ? { blob: await compressPNGScale(img, 1.0), actualFormat: "image/png", avifFallback: false }
        : await encodeWithAvifFallback(img, 0.95, targetFormat, img.naturalWidth, img.naturalHeight);

    if (res.blob && res.blob.size <= targetBytes) {
      return {
        blob: res.blob,
        qualityUsed: 0.95,
        actualFormat: res.actualFormat,
        scaleUsed: 1.0,
        targetMet: true,
        preservedOriginal: false,
        avifFallback: res.avifFallback
      };
    }
    // Otherwise fall through so converted output is still reduced <= targetBytes
  }

  if (targetFormat === "image/png") {
    const pngRes = await optimizePngToTarget({ img, targetBytes });
    return {
      ...pngRes,
      actualFormat: "image/png",
      targetMet: Boolean(pngRes.blob && pngRes.blob.size <= targetBytes),
      preservedOriginal: false,
      avifFallback: false
    };
  }

  const lossyRes = await optimizeLossyToTarget({ img, targetFormat, targetBytes });
  return {
    ...lossyRes,
    targetMet: Boolean(lossyRes.blob && lossyRes.blob.size <= targetBytes),
    preservedOriginal: false
  };
}

