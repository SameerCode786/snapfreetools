import { PDFDocument, PDFName, PDFRawStream, PDFStream } from "pdf-lib";
import { formatFileSize, sanitizeFilename, calculateSavings } from "./formatters";

/**
 * Gets or initializes pdfjs-dist worker engine for thumbnail rendering.
 */
export const getPdfJsEngine = async () => {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  return pdfjs;
};

/**
 * Analyzes PDF file structure, detects content types, and generates a smart recommendation.
 */
export const parsePdfFileInfo = async (file) => {
  if (!file || !(file instanceof File)) {
    throw new Error("Please upload a valid PDF document.");
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Please upload a valid PDF document (.pdf).");
  }

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB Limit
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("This file exceeds the maximum supported size of 50 MB for client-side compression.");
  }

  const arrayBuffer = await file.arrayBuffer();

  // Load via pdfjs-dist for page count & thumbnail
  const pdfjs = await getPdfJsEngine();
  let pdfJsDoc;
  try {
    pdfJsDoc = await pdfjs.getDocument({ data: arrayBuffer.slice(0) }).promise;
  } catch (err) {
    if (err.name === "PasswordException" || (err.message && err.message.toLowerCase().includes("encrypted"))) {
      throw new Error(`"${file.name}" is password-protected. Please unlock it before compressing.`);
    }
    throw new Error(`We couldn't read "${file.name}". The file may be corrupted or use an unsupported structure.`);
  }

  const pageCount = pdfJsDoc.numPages;
  let firstPageThumbnail = null;

  if (pageCount > 0) {
    try {
      const page = await pdfJsDoc.getPage(1);
      const viewport = page.getViewport({ scale: 0.3 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: ctx, viewport }).promise;
      firstPageThumbnail = canvas.toDataURL("image/jpeg", 0.7);

      canvas.width = 0;
      canvas.height = 0;
    } catch (thumbErr) {
      console.warn("Thumbnail rendering skipped:", thumbErr);
    }
  }

  // Load via pdf-lib for object stream analysis
  let pdfLibDoc;
  let imageCount = 0;
  let approxImageBytes = 0;

  try {
    pdfLibDoc = await PDFDocument.load(arrayBuffer.slice(0), { ignoreEncryption: true });
    const indirectObjects = pdfLibDoc.context.enumerateIndirectObjects();
    for (const [, obj] of indirectObjects) {
      if (obj instanceof PDFRawStream || obj instanceof PDFStream) {
        const subtype = obj.dict.get(PDFName.of("Subtype"));
        if (subtype === PDFName.of("Image")) {
          imageCount++;
          if (obj.contents) {
            approxImageBytes += obj.contents.length;
          }
        }
      }
    }
  } catch (err) {
    // pdf-lib parsing fallback
  }

  // Determine smart recommendation based on image density
  let smartRecommendation = {
    recommendedLevel: "balanced",
    contentType: "mixed",
    reason: "Balanced compression is recommended for optimal text clarity and visual quality."
  };

  const imageRatio = file.size > 0 ? approxImageBytes / file.size : 0;

  if (imageCount > 0 && (imageRatio > 0.35 || imageCount >= pageCount)) {
    smartRecommendation = {
      recommendedLevel: "strong",
      contentType: "image-heavy",
      reason: `Detected ${imageCount} image(s) in this document. Strong compression will significantly reduce file size.`
    };
  } else if (imageCount === 0) {
    smartRecommendation = {
      recommendedLevel: "balanced",
      contentType: "text-vector",
      reason: "This PDF contains mostly text and vector graphics. Balanced stream optimization is recommended."
    };
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: file.name,
    size: file.size,
    pageCount,
    firstPageThumbnail,
    imageCount,
    smartRecommendation,
    rawFile: file,
    arrayBuffer
  };
};

/**
 * Helper to yield execution thread to keep browser UI smooth.
 */
const yieldThread = (ms = 40) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Converts a Blob or Uint8Array image into a recompressed JPEG Uint8Array using browser Canvas.
 */
const recompressImageInBrowser = async (uint8Array, maxDimension, quality) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  return new Promise((resolve) => {
    try {
      const blob = new Blob([uint8Array], { type: "image/jpeg" });
      const img = new Image();
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        URL.revokeObjectURL(url);
        let width = img.width;
        let height = img.height;

        // Downsample if dimensions exceed maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          async (compressedBlob) => {
            if (!compressedBlob) {
              resolve(null);
              return;
            }
            const buffer = await compressedBlob.arrayBuffer();
            canvas.width = 0;
            canvas.height = 0;
            resolve(new Uint8Array(buffer));
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };

      img.src = url;
    } catch (err) {
      resolve(null);
    }
  });
};

/**
 * 100% Client-side PDF Compression Engine.
 * Supports Balanced, Strong, and Maximum compression modes with real raster image recompression.
 */
export const compressPdfFile = async ({ fileInfo, level = "balanced", onProgress }) => {
  if (!fileInfo || !fileInfo.rawFile) {
    throw new Error("No PDF document selected for compression.");
  }

  const rawFile = fileInfo.rawFile;
  const originalSize = rawFile.size;
  const baseName = sanitizeFilename(rawFile.name);

  // Compression presets config
  const configs = {
    balanced: { maxDimension: 1600, quality: 0.75, name: "Balanced" },
    strong: { maxDimension: 1200, quality: 0.60, name: "Strong" },
    maximum: { maxDimension: 900, quality: 0.45, name: "Maximum" }
  };

  const config = configs[level] || configs.balanced;

  // Step 1: Reading PDF
  if (onProgress) {
    onProgress({ step: "Reading PDF document...", percent: 15 });
  }
  await yieldThread(50);

  const arrayBuffer = await rawFile.arrayBuffer();

  // Step 2: Loading PDF Structure
  if (onProgress) {
    onProgress({ step: "Analyzing document & images...", percent: 35 });
  }
  await yieldThread(50);

  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch (err) {
    if (err.message && err.message.toLowerCase().includes("encrypted")) {
      throw new Error(`"${rawFile.name}" is password-protected. Please unlock it before compressing.`);
    }
    throw new Error(`We couldn't process "${rawFile.name}". The file may be corrupted or encrypted.`);
  }

  // Step 3: Recompressing Embedded Images
  if (onProgress) {
    onProgress({ step: `Optimizing raster images (${config.name} mode)...`, percent: 55 });
  }
  await yieldThread(50);

  let imagesOptimizedCount = 0;

  try {
    const indirectObjects = pdfDoc.context.enumerateIndirectObjects();
    const imageObjects = [];

    for (const [ref, obj] of indirectObjects) {
      if (obj instanceof PDFRawStream || obj instanceof PDFStream) {
        const subtype = obj.dict.get(PDFName.of("Subtype"));
        if (subtype === PDFName.of("Image") && obj.contents && obj.contents.length > 5000) {
          imageObjects.push({ ref, obj });
        }
      }
    }

    // Process image XObjects (recompress if savings achieved)
    for (let i = 0; i < imageObjects.length; i++) {
      const { obj } = imageObjects[i];
      const filter = obj.dict.get(PDFName.of("Filter"));
      const isJpeg = filter === PDFName.of("DCTDecode") || (Array.isArray(filter) && filter.includes(PDFName.of("DCTDecode")));

      if (isJpeg || filter === PDFName.of("FlateDecode")) {
        const recompressedBytes = await recompressImageInBrowser(
          obj.contents,
          config.maxDimension,
          config.quality
        );

        if (recompressedBytes && recompressedBytes.length < obj.contents.length * 0.95) {
          try {
            const replacementImg = await pdfDoc.embedJpg(recompressedBytes);
            await replacementImg.embed();

            const replacementStream = pdfDoc.context.lookup(replacementImg.ref);
            if (replacementStream && replacementStream.contents) {
              obj.contents = replacementStream.contents;
              obj.dict = replacementStream.dict;
              pdfDoc.context.delete(replacementImg.ref);
              imagesOptimizedCount++;
            }
          } catch (embedErr) {
            // Keep original image stream if embedding fails
          }
        }
      }
    }
  } catch (imgErr) {
    console.warn("Image recompression pass skipped:", imgErr);
  }

  // Step 4: Optimizing Metadata & Object Streams
  if (onProgress) {
    onProgress({ step: "Compressing PDF object streams...", percent: 80 });
  }
  await yieldThread(50);

  try {
    pdfDoc.setTitle(pdfDoc.getTitle() || baseName);
    pdfDoc.setProducer("SnapFreeTools PDF Compressor Engine");
  } catch (metaErr) {
    // Ignore minor metadata setting errors
  }

  // Save PDF using Flate-compressed object streams
  const compressedPdfBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false
  });

  // Step 5: Verification & Savings Calculation
  if (onProgress) {
    onProgress({ step: "Verifying compressed output...", percent: 95 });
  }
  await yieldThread(50);

  const compressedSize = compressedPdfBytes.length;
  const savings = calculateSavings(originalSize, compressedSize);

  let finalBlob;
  let finalUrl;
  let isReduced = false;
  let outputFilename = `${baseName}-compressed.pdf`;

  if (savings.isReduced) {
    isReduced = true;
    finalBlob = new Blob([compressedPdfBytes], { type: "application/pdf" });
    finalUrl = URL.createObjectURL(finalBlob);
  } else {
    // Fallback: If compressed output size >= original size, provide original file
    isReduced = false;
    finalBlob = new Blob([arrayBuffer], { type: "application/pdf" });
    finalUrl = URL.createObjectURL(finalBlob);
    outputFilename = rawFile.name;
  }

  if (onProgress) {
    onProgress({ step: "Finalizing...", percent: 100 });
  }
  await yieldThread(30);

  return {
    originalSize,
    compressedSize: isReduced ? compressedSize : originalSize,
    formattedOriginalSize: formatFileSize(originalSize),
    formattedCompressedSize: formatFileSize(isReduced ? compressedSize : originalSize),
    percentageSaved: savings.percentage,
    bytesSaved: savings.bytesSaved,
    formattedBytesSaved: formatFileSize(savings.bytesSaved),
    isReduced,
    blob: finalBlob,
    url: finalUrl,
    filename: outputFilename,
    pageCount: fileInfo.pageCount || pdfDoc.getPageCount(),
    levelUsed: level,
    levelName: config.name,
    imagesOptimizedCount
  };
};
