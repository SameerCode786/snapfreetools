/**
 * Extract PDF Images Engine (Phase F Hardened Edition)
 * Hybrid client-side PDF image extraction engine using pdf-lib and pdfjs-dist.
 * 
 * Supports:
 * - Direct byte-exact JPEG recovery from /DCTDecode PDF XObject streams
 * - Lossless PNG encoding for standard Flate, Grayscale, and RGBA images
 * - Pure CMYK -> RGB color space conversion & PNG encoding
 * - PDF.js operator fallback for JPXDecode (JPEG2000), Indexed palettes, SMask transparency, & Inline Images (BI/ID/EI)
 * - Recursive /Form XObject traversal with cycle detection (visitedSet)
 * - Page-range extraction (e.g., "1-3, 5")
 * - Indirect object deduplication and page association mapping
 * - AbortSignal cancellation support & detailed progress callbacks
 * - 100% Client-side privacy (zero server uploads)
 */

import { PDFDocument, PDFName, PDFRef } from "pdf-lib";
import zlib from "zlib";

/**
 * Custom Error Class for PDF Extraction Operations
 */
export class PdfExtractionError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = "PdfExtractionError";
    this.code = code;
    this.details = details;
  }
}

/**
 * Helper to dynamically load pdfjs-dist engine across Node.js unit tests and Browser runtimes.
 */
export async function getPdfJsEngine() {
  let pdfjs;
  try {
    if (typeof window === "undefined" && typeof process !== "undefined") {
      pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    } else {
      pdfjs = await import("pdfjs-dist");
      if (pdfjs && pdfjs.GlobalWorkerOptions) {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
      }
    }
  } catch (e) {
    pdfjs = await import("pdfjs-dist");
  }
  return pdfjs;
}

/**
 * Validates whether a Uint8Array contains a valid JPEG image (SOI: 0xFFD8).
 */
export function isJpegValid(bytes) {
  if (!bytes || bytes.length < 4) return false;
  return bytes[0] === 0xff && bytes[1] === 0xd8;
}

/**
 * Validates whether a Uint8Array contains a valid PNG image signature (0x89504E47).
 */
export function isPngValid(bytes) {
  if (!bytes || bytes.length < 8) return false;
  return (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  );
}

/**
 * Decompresses FlateDecode zlib stream bytes safely.
 */
function decompressFlateStream(rawBytes) {
  if (!rawBytes || rawBytes.length === 0) return null;
  try {
    if (typeof zlib !== "undefined" && typeof zlib.inflateSync === "function") {
      return zlib.inflateSync(rawBytes);
    }
  } catch (e) {
    // If zlib fails or header mismatch, return raw bytes
  }
  return rawBytes;
}

/**
 * Pure JS CMYK (4 bytes/pixel) to RGB (3 bytes/pixel) color converter.
 */
export function convertCmykToRgb(cmykBuffer, width, height) {
  if (!cmykBuffer || width <= 0 || height <= 0) return new Uint8Array(0);
  const pixelCount = width * height;
  const rgbBuffer = new Uint8Array(pixelCount * 3);

  for (let i = 0; i < pixelCount; i++) {
    const srcIdx = i * 4;
    const c = (cmykBuffer[srcIdx] || 0) / 255;
    const m = (cmykBuffer[srcIdx + 1] || 0) / 255;
    const y = (cmykBuffer[srcIdx + 2] || 0) / 255;
    const k = (cmykBuffer[srcIdx + 3] || 0) / 255;

    rgbBuffer[i * 3] = Math.round(255 * (1 - c) * (1 - k));
    rgbBuffer[i * 3 + 1] = Math.round(255 * (1 - m) * (1 - k));
    rgbBuffer[i * 3 + 2] = Math.round(255 * (1 - y) * (1 - k));
  }

  return rgbBuffer;
}

/**
 * Pure JS PNG Encoder Helper for RGBA/RGB/Grayscale pixel buffers.
 * Enables deterministic PNG creation in both Node.js unit tests and Browser runtimes.
 */
function createCrc32Table() {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

const CRC32_TABLE = createCrc32Table();

function computeCrc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = CRC32_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ -1) >>> 0;
}

function deflateRawScanlines(data) {
  const maxBlockSize = 65535;
  const numBlocks = Math.ceil(data.length / maxBlockSize);
  const headerSize = 2; // zlib header (0x78 0x01)
  const footerSize = 4; // adler32
  const blockSizeOverhead = 5;

  const totalSize =
    headerSize + data.length + numBlocks * blockSizeOverhead + footerSize;
  const out = new Uint8Array(totalSize);

  out[0] = 0x78;
  out[1] = 0x01;
  let outIdx = 2;

  let inIdx = 0;
  for (let b = 0; b < numBlocks; b++) {
    const blockLen = Math.min(data.length - inIdx, maxBlockSize);
    const isFinal = b === numBlocks - 1 ? 1 : 0;
    out[outIdx++] = isFinal;

    out[outIdx++] = blockLen & 0xff;
    out[outIdx++] = (blockLen >> 8) & 0xff;

    const nlen = ~blockLen & 0xffff;
    out[outIdx++] = nlen & 0xff;
    out[outIdx++] = (nlen >> 8) & 0xff;

    out.set(data.subarray(inIdx, inIdx + blockLen), outIdx);
    outIdx += blockLen;
    inIdx += blockLen;
  }

  let s1 = 1;
  let s2 = 0;
  for (let i = 0; i < data.length; i++) {
    s1 = (s1 + data[i]) % 65521;
    s2 = (s2 + s1) % 65521;
  }
  const adler = ((s2 << 16) | s1) >>> 0;
  out[outIdx++] = (adler >>> 24) & 0xff;
  out[outIdx++] = (adler >>> 16) & 0xff;
  out[outIdx++] = (adler >>> 8) & 0xff;
  out[outIdx++] = adler & 0xff;

  return out;
}

/**
 * Encodes RGBA, RGB, or Grayscale Uint8Array pixel buffers to a valid PNG Uint8Array.
 */
export function encodePixelsToPng(width, height, pixelBuffer, isRgba = true) {
  if (!pixelBuffer || width <= 0 || height <= 0) return new Uint8Array(0);

  let bytesPerPixel = isRgba ? 4 : 3;
  let colorType = isRgba ? 6 : 2; // 6: RGBA, 2: RGB
  let srcBuf = pixelBuffer;

  // Handle Grayscale (1 byte per pixel) by expanding to RGB (3 bytes per pixel)
  if (pixelBuffer.length === width * height) {
    srcBuf = new Uint8Array(width * height * 3);
    for (let i = 0; i < pixelBuffer.length; i++) {
      const g = pixelBuffer[i];
      srcBuf[i * 3] = g;
      srcBuf[i * 3 + 1] = g;
      srcBuf[i * 3 + 2] = g;
    }
    bytesPerPixel = 3;
    colorType = 2;
  }

  const scanlineLength = width * bytesPerPixel + 1;
  const rawData = new Uint8Array(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    rawData[y * scanlineLength] = 0; // Filter byte: 0 (None)
    const srcOffset = y * width * bytesPerPixel;
    const destOffset = y * scanlineLength + 1;
    const chunkLen = Math.min(width * bytesPerPixel, srcBuf.length - srcOffset);
    if (chunkLen > 0) {
      rawData.set(srcBuf.subarray(srcOffset, srcOffset + chunkLen), destOffset);
    }
  }

  const compressedData = deflateRawScanlines(rawData);
  const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = new Uint8Array(13);
  const view = new DataView(ihdrData.buffer);
  view.setUint32(0, width, false);
  view.setUint32(4, height, false);
  ihdrData[8] = 8;
  ihdrData[9] = colorType;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdrChunk = createPngChunk("IHDR", ihdrData);
  const idatChunk = createPngChunk("IDAT", compressedData);
  const iendChunk = createPngChunk("IEND", new Uint8Array(0));

  const totalLength =
    signature.length + ihdrChunk.length + idatChunk.length + iendChunk.length;
  const pngBytes = new Uint8Array(totalLength);

  let offset = 0;
  pngBytes.set(signature, offset);
  offset += signature.length;
  pngBytes.set(ihdrChunk, offset);
  offset += ihdrChunk.length;
  pngBytes.set(idatChunk, offset);
  offset += idatChunk.length;
  pngBytes.set(iendChunk, offset);

  return pngBytes;
}

function createPngChunk(type, data) {
  const len = data.length;
  const chunk = new Uint8Array(4 + 4 + len + 4);
  const view = new DataView(chunk.buffer);

  view.setUint32(0, len, false);

  for (let i = 0; i < 4; i++) {
    chunk[4 + i] = type.charCodeAt(i);
  }

  chunk.set(data, 8);

  const crcData = chunk.subarray(4, 8 + len);
  const crc = computeCrc32(crcData);
  view.setUint32(8 + len, crc, false);

  return chunk;
}

/**
 * Normalizes input source into Uint8Array buffer.
 */
export async function normalizeToUint8Array(source) {
  if (!source) {
    throw new PdfExtractionError(
      "No PDF file or buffer provided.",
      "INVALID_SOURCE"
    );
  }

  if (source instanceof Uint8Array) {
    return source;
  }

  if (source instanceof ArrayBuffer) {
    return new Uint8Array(source);
  }

  if (typeof Blob !== "undefined" && source instanceof Blob) {
    const arrayBuffer = await source.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }

  if (source && source.buffer instanceof ArrayBuffer) {
    return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
  }

  throw new PdfExtractionError(
    "Unsupported input source format. Expected File, Blob, or ArrayBuffer.",
    "INVALID_SOURCE"
  );
}

/**
 * Parses user-provided page range string into a Set of 1-indexed page numbers.
 * Examples: "all", "1-5", "2,4,8", "3-7, 10"
 */
export function parsePageRange(rangeStr, totalPages) {
  if (
    !rangeStr ||
    typeof rangeStr !== "string" ||
    rangeStr.trim() === "" ||
    rangeStr.trim().toLowerCase() === "all"
  ) {
    const allPages = new Set();
    for (let i = 1; i <= totalPages; i++) allPages.add(i);
    return allPages;
  }

  const selectedPages = new Set();
  const parts = rangeStr.split(",");

  for (let part of parts) {
    part = part.trim();
    if (!part) continue;

    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = parseInt(startStr.trim(), 10);
      const end = parseInt(endStr.trim(), 10);

      if (!isNaN(start) && !isNaN(end)) {
        const minP = Math.max(1, Math.min(start, end));
        const maxP = Math.min(totalPages, Math.max(start, end));
        for (let p = minP; p <= maxP; p++) selectedPages.add(p);
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        selectedPages.add(p);
      }
    }
  }

  if (selectedPages.size === 0) {
    for (let i = 1; i <= totalPages; i++) selectedPages.add(i);
  }

  return selectedPages;
}

/**
 * Helper to safely extract integer values from pdf-lib PDFNumber dictionary entries.
 */
function getDictNumber(dict, keyName) {
  if (!dict) return 0;
  const obj = dict.get(PDFName.of(keyName));
  if (!obj) return 0;
  if (typeof obj.numberValue === "number") return obj.numberValue;
  if (typeof obj.value === "number") return obj.value;
  if (typeof obj.value === "function") return obj.value();
  return 0;
}

/**
 * Recursively scans PDF Resource dictionaries for Image and Form XObjects with cycle detection.
 */
function scanResourcesForImages(
  resourcesDict,
  pageNum,
  pdfContext,
  imageMap,
  visitedSet,
  options,
  warnings
) {
  if (!resourcesDict) return;

  const resolvedResources = pdfContext.lookup(resourcesDict);
  if (!resolvedResources || typeof resolvedResources.get !== "function") return;

  const xObjectDictRef = resolvedResources.get(PDFName.of("XObject"));
  if (!xObjectDictRef) return;

  const resolvedXObjDict = pdfContext.lookup(xObjectDictRef);
  if (!resolvedXObjDict || typeof resolvedXObjDict.entries !== "function") return;

  for (const [key, ref] of resolvedXObjDict.entries()) {
    const objectRefStr =
      ref instanceof PDFRef
        ? ref.toString()
        : (key && key.name) || `obj_${pageNum}_${Math.random()}`;

    // Cycle / Loop prevention via visitedSet
    if (visitedSet.has(objectRefStr)) {
      if (imageMap.has(objectRefStr)) {
        const existing = imageMap.get(objectRefStr);
        if (!existing.sourcePages.includes(pageNum)) {
          existing.sourcePages.push(pageNum);
        }
      }
      continue;
    }

    visitedSet.add(objectRefStr);

    const xObject = pdfContext.lookup(ref);
    if (!xObject) continue;

    const dict = xObject.dict || xObject;
    if (!dict || typeof dict.get !== "function") continue;

    const subtypeObj = dict.get(PDFName.of("Subtype"));
    const subtypeStr = subtypeObj ? subtypeObj.name || subtypeObj.toString() : "";

    if (subtypeStr === "Form" || subtypeStr === "/Form") {
      // Priority 5: Recursively inspect Form XObjects
      const formResources = dict.get(PDFName.of("Resources"));
      if (formResources) {
        scanResourcesForImages(
          formResources,
          pageNum,
          pdfContext,
          imageMap,
          visitedSet,
          options,
          warnings
        );
      }
    } else if (subtypeStr === "Image" || subtypeStr === "/Image") {
      processImageXObject(
        dict,
        xObject,
        objectRefStr,
        pageNum,
        imageMap,
        options,
        warnings
      );
    }
  }
}

/**
 * Processes a single Image XObject dictionary and populates imageMap or converts complex color spaces.
 */
function processImageXObject(
  dict,
  xObject,
  objectRefStr,
  pageNum,
  imageMap,
  options,
  warnings
) {
  const { minWidth = 1, minHeight = 1 } = options;

  const width = getDictNumber(dict, "Width");
  const height = getDictNumber(dict, "Height");

  if (width < minWidth || height < minHeight) {
    return;
  }

  // Inspect dictionary properties for edge-case detection
  const filterObj = dict.get(PDFName.of("Filter"));
  const filterStr = filterObj ? filterObj.name || filterObj.toString() : "";
  const isJpgFilter = filterStr.includes("DCTDecode");
  const isJpxFilter = filterStr.includes("JPXDecode");

  const colorSpaceObj = dict.get(PDFName.of("ColorSpace"));
  const colorSpaceStr = colorSpaceObj ? colorSpaceObj.name || colorSpaceObj.toString() : "";
  const isCmyk = colorSpaceStr.includes("DeviceCMYK") || colorSpaceStr.includes("CMYK");
  const isIndexed = colorSpaceStr.includes("Indexed");

  const hasSMask = dict.has(PDFName.of("SMask"));
  const hasMask = dict.has(PDFName.of("Mask"));

  if (imageMap.has(objectRefStr)) {
    const existing = imageMap.get(objectRefStr);
    if (!existing.sourcePages.includes(pageNum)) {
      existing.sourcePages.push(pageNum);
    }
    return;
  }

  let contents = null;
  try {
    if (typeof xObject.getContents === "function") {
      contents = xObject.getContents();
    } else if (xObject.contents) {
      contents = xObject.contents;
    }
  } catch (e) {
    warnings.push(
      `Could not read stream for image ${objectRefStr} on page ${pageNum}.`
    );
  }

  const hasValidJpegHeader = isJpegValid(contents);

  // 1. Direct JPEG Extraction (DCTDecode without SMask/CMYK)
  if (isJpgFilter && hasValidJpegHeader && !hasSMask && !isCmyk) {
    imageMap.set(objectRefStr, {
      id: `img_obj_${objectRefStr.replace(/\s+/g, "_")}`,
      objectRef: objectRefStr,
      sourcePages: [pageNum],
      width,
      height,
      mimeType: "image/jpeg",
      format: "jpeg",
      byteSize: contents ? contents.length : 0,
      data: contents,
      extractionMethod: "original-stream",
      colorSpace: "DeviceRGB (JPEG)",
      isUnique: true,
    });
    return;
  }

  // 2. SMask / JPXDecode / Indexed Palette Classification for PDF.js Fallback
  if (hasSMask || hasMask || isJpxFilter || isIndexed) {
    const safeData =
      contents && contents.length > 0
        ? isPngValid(contents) || isJpegValid(contents)
          ? contents
          : encodePixelsToPng(width, height, contents, false)
        : new Uint8Array(0);

    imageMap.set(objectRefStr, {
      id: `img_obj_${objectRefStr.replace(/\s+/g, "_")}`,
      objectRef: objectRefStr,
      sourcePages: [pageNum],
      width,
      height,
      mimeType: "image/png",
      format: "png",
      byteSize: safeData.length,
      data: safeData,
      extractionMethod: "pdfjs-fallback",
      needsPdfJsFallback: true,
      colorSpace: hasSMask
        ? "SMask Transparency"
        : isJpxFilter
        ? "JPXDecode (JPEG2000)"
        : "Indexed Palette",
      isUnique: true,
    });
    return;
  }

  // 3. Direct CMYK -> RGB Transformation & PNG Encoding
  if (contents && contents.length > 0 && isCmyk) {
    const decompressed = decompressFlateStream(contents) || contents;
    if (decompressed.length >= width * height * 4) {
      const rgbBuf = convertCmykToRgb(decompressed, width, height);
      const pngData = encodePixelsToPng(width, height, rgbBuf, false);
      if (pngData && pngData.length > 0) {
        imageMap.set(objectRefStr, {
          id: `img_obj_${objectRefStr.replace(/\s+/g, "_")}`,
          objectRef: objectRefStr,
          sourcePages: [pageNum],
          width,
          height,
          mimeType: "image/png",
          format: "png",
          byteSize: pngData.length,
          data: pngData,
          extractionMethod: "decoded-png",
          colorSpace: "DeviceCMYK -> RGB",
          isUnique: true,
        });
        return;
      }
    }

    const fallbackPng = encodePixelsToPng(width, height, contents, false);
    imageMap.set(objectRefStr, {
      id: `img_obj_${objectRefStr.replace(/\s+/g, "_")}`,
      objectRef: objectRefStr,
      sourcePages: [pageNum],
      width,
      height,
      mimeType: "image/png",
      format: "png",
      byteSize: fallbackPng.length,
      data: fallbackPng,
      extractionMethod: "pdfjs-fallback",
      needsPdfJsFallback: true,
      colorSpace: "DeviceCMYK",
      isUnique: true,
    });
    return;
  }

  // 4. Direct FlateDecode RGB/RGBA/Grayscale PNG Encoding
  if (contents && contents.length > 0) {
    const hasPngHeader = isPngValid(contents);
    if (hasPngHeader) {
      imageMap.set(objectRefStr, {
        id: `img_obj_${objectRefStr.replace(/\s+/g, "_")}`,
        objectRef: objectRefStr,
        sourcePages: [pageNum],
        width,
        height,
        mimeType: "image/png",
        format: "png",
        byteSize: contents.length,
        data: contents,
        extractionMethod: "original-stream",
        colorSpace: "PNG Stream",
        isUnique: true,
      });
      return;
    }

    const decompressed = decompressFlateStream(contents);
    const pixelBuf = decompressed || contents;

    const isRgba = pixelBuf.length >= width * height * 4;
    const isRgb = pixelBuf.length >= width * height * 3;
    const isGrayscale = pixelBuf.length === width * height;

    if (isRgba || isRgb || isGrayscale) {
      const pngData = encodePixelsToPng(width, height, pixelBuf, isRgba);
      if (pngData && pngData.length > 0) {
        imageMap.set(objectRefStr, {
          id: `img_obj_${objectRefStr.replace(/\s+/g, "_")}`,
          objectRef: objectRefStr,
          sourcePages: [pageNum],
          width,
          height,
          mimeType: "image/png",
          format: "png",
          byteSize: pngData.length,
          data: pngData,
          extractionMethod: "decoded-png",
          colorSpace: isRgba
            ? "DeviceRGBA"
            : isRgb
            ? "DeviceRGB"
            : "DeviceGray",
          isUnique: true,
        });
        return;
      }
    }
  }

  // Default fallback flag for non-standard image streams
  const safeFallbackPng = contents && contents.length > 0 ? encodePixelsToPng(width, height, contents, false) : new Uint8Array(0);

  imageMap.set(objectRefStr, {
    id: `img_obj_${objectRefStr.replace(/\s+/g, "_")}`,
    objectRef: objectRefStr,
    sourcePages: [pageNum],
    width,
    height,
    mimeType: "image/png",
    format: "png",
    byteSize: safeFallbackPng.length,
    data: safeFallbackPng,
    extractionMethod: "pdfjs-fallback",
    needsPdfJsFallback: true,
    colorSpace: "PDF Stream",
    isUnique: true,
  });
}

/**
 * Layer 1 & 2 Engine Pass: Inspects PDF structure via pdf-lib.
 */
export async function extractImagesFromPdfLib(pdfBytes, options = {}) {
  const { signal, onProgress, pageRange = "all" } = options;

  let loadedPdf;
  try {
    loadedPdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: false });
  } catch (err) {
    const errMsg = (err.message || "").toLowerCase();
    if (
      errMsg.includes("encrypted") ||
      errMsg.includes("password") ||
      err.name === "PasswordRequiredError"
    ) {
      throw new PdfExtractionError(
        "This PDF document is password-protected. Please unlock the PDF before extracting images.",
        "PASSWORD_PROTECTED",
        err
      );
    }
    throw new PdfExtractionError(
      "Failed to parse PDF document structure. The file may be corrupt or invalid.",
      "CORRUPTED_PDF",
      err
    );
  }

  const pages = loadedPdf.getPages();
  const totalPages = pages.length;
  const selectedPageNumbers = parsePageRange(pageRange, totalPages);

  const imageMap = new Map();
  const warnings = [];
  const visitedSet = new Set();

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    if (signal?.aborted) {
      throw new PdfExtractionError(
        "Image extraction was cancelled by user.",
        "CANCELLED"
      );
    }

    const pageNum = pageIdx + 1;
    if (!selectedPageNumbers.has(pageNum)) {
      continue;
    }

    const page = pages[pageIdx];

    if (onProgress) {
      onProgress({
        currentPage: pageNum,
        totalPages,
        imagesFound: imageMap.size,
        phase: "scanning",
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 0));

    const resources = page.node.Resources();
    if (!resources) continue;

    scanResourcesForImages(
      resources,
      pageNum,
      loadedPdf.context,
      imageMap,
      visitedSet,
      options,
      warnings
    );
  }

  return {
    rawImages: Array.from(imageMap.values()),
    totalPages,
    selectedPageNumbers,
    warnings,
  };
}

/**
 * Layer 3 Engine Pass: Uses pdfjs-dist operator list & object resolution for complex color spaces,
 * JPXDecode, SMask compositing, and Content-Stream Inline Images (BI/ID/EI).
 */
export async function extractPdfJsFallbackImages(
  pdfBytes,
  selectedPageNumbers,
  workingImages,
  warnings,
  options = {}
) {
  const { signal, minWidth = 1, minHeight = 1 } = options;

  let pdfjs;
  try {
    pdfjs = await getPdfJsEngine();
  } catch (err) {
    warnings.push("PDF.js engine unavailable for fallback extraction.");
    return;
  }

  let pdfDoc;
  try {
    pdfDoc = await pdfjs.getDocument({ data: pdfBytes }).promise;
  } catch (err) {
    return;
  }

  const existingRefMap = new Map();
  for (const img of workingImages) {
    existingRefMap.set(img.objectRef, img);
    existingRefMap.set(img.id, img);
  }

  for (const pageNum of selectedPageNumbers) {
    if (signal?.aborted) break;

    let page;
    try {
      page = await pdfDoc.getPage(pageNum);
    } catch (e) {
      continue;
    }

    let opList;
    try {
      opList = await page.getOperatorList();
    } catch (e) {
      continue;
    }

    if (!opList || !opList.fnArray) continue;

    let inlineIdx = 0;

    for (let i = 0; i < opList.fnArray.length; i++) {
      if (signal?.aborted) break;

      const fn = opList.fnArray[i];
      const args = opList.argsArray[i];

      // Priority 4: Inline Images (BI / ID / EI)
      if (fn === pdfjs.OPS.paintInlineImageXObject) {
        inlineIdx++;
        const inlineObj = args[0];
        if (inlineObj && inlineObj.width >= minWidth && inlineObj.height >= minHeight) {
          const w = inlineObj.width;
          const h = inlineObj.height;
          const inlineRef = `inline_p${pageNum}_${inlineIdx}_${w}x${h}`;

          if (existingRefMap.has(inlineRef)) {
            const existing = existingRefMap.get(inlineRef);
            if (!existing.sourcePages.includes(pageNum)) {
              existing.sourcePages.push(pageNum);
            }
          } else {
            const isRgba = inlineObj.data && inlineObj.data.length >= w * h * 4;
            const pngBytes = encodePixelsToPng(w, h, inlineObj.data, isRgba);

            if (pngBytes && pngBytes.length > 0) {
              const newImg = {
                id: `img_inline_${pageNum}_${inlineIdx}`,
                objectRef: inlineRef,
                sourcePages: [pageNum],
                width: w,
                height: h,
                mimeType: "image/png",
                format: "png",
                byteSize: pngBytes.length,
                data: pngBytes,
                extractionMethod: "pdfjs-fallback",
                colorSpace: "Inline Content Stream (BI/ID/EI)",
                isUnique: true,
              };
              workingImages.push(newImg);
              existingRefMap.set(inlineRef, newImg);
            }
          }
        }
      } else if (
        fn === pdfjs.OPS.paintImageXObject ||
        fn === pdfjs.OPS.paintImageMaskXObject
      ) {
        // Complex XObject decoding via PDF.js object resolution
        const objName = args[0];
        if (typeof objName === "string" && page.objs) {
          await new Promise((resolve) => {
            page.objs.get(objName, (imgObj) => {
              if (imgObj && imgObj.width >= minWidth && imgObj.height >= minHeight) {
                const w = imgObj.width;
                const h = imgObj.height;

                // Find if any image in workingImages is missing data or needs fallback
                const target = workingImages.find(
                  (item) => item.objectRef === objName || item.needsPdfJsFallback || (!item.data || item.byteSize === 0)
                );

                if (target && (!target.data || target.byteSize === 0 || target.needsPdfJsFallback)) {
                  const isRgba = imgObj.kind === 3 || (imgObj.data && imgObj.data.length >= w * h * 4);
                  const pngBytes = encodePixelsToPng(w, h, imgObj.data, isRgba);

                  if (pngBytes && pngBytes.length > 0) {
                    target.data = pngBytes;
                    target.byteSize = pngBytes.length;
                    target.width = w;
                    target.height = h;
                    target.extractionMethod = "pdfjs-fallback";
                    target.format = "png";
                    target.mimeType = "image/png";
                    delete target.needsPdfJsFallback;
                  }
                }
              }
              resolve();
            });
          });
        }
      }
    }
  }
}

/**
 * Primary Entrypoint Function for PDF Image Extraction
 * Accepts PDF source (File, Blob, Uint8Array, ArrayBuffer) and options.
 */
export async function extractPdfImages(source, options = {}) {
  const startTime = Date.now();
  const pdfBytes = await normalizeToUint8Array(source);

  if (!pdfBytes || pdfBytes.length === 0) {
    throw new PdfExtractionError(
      "The provided PDF buffer is empty.",
      "INVALID_SOURCE"
    );
  }

  const {
    signal,
    onProgress,
    minWidth = 1,
    minHeight = 1,
    deduplicate = true,
    pageRange = "all",
  } = options;

  if (signal?.aborted) {
    throw new PdfExtractionError(
      "Image extraction was cancelled by user.",
      "CANCELLED"
    );
  }

  // Step 1: Run Layer 1 & Layer 2 PDF-lib structural extraction pass
  const { rawImages, totalPages, selectedPageNumbers, warnings } =
    await extractImagesFromPdfLib(pdfBytes, {
      signal,
      onProgress,
      minWidth,
      minHeight,
      deduplicate,
      pageRange,
    });

  let workingImages = [...rawImages];

  // Step 2: Run PDF.js Fallback pass for complex streams or inline content stream images
  await extractPdfJsFallbackImages(
    pdfBytes,
    selectedPageNumbers,
    workingImages,
    warnings,
    {
      signal,
      minWidth,
      minHeight,
    }
  );

  // Step 3: Apply dimension filtering
  let finalImages = workingImages.filter(
    (img) => img.width >= minWidth && img.height >= minHeight && img.data && img.byteSize > 0
  );

  let totalOccurrencesCount = 0;
  finalImages.forEach((img) => {
    totalOccurrencesCount += img.sourcePages.length;
  });

  if (finalImages.length === 0) {
    warnings.push(
      "No embedded raster images found in selected pages. The document may contain text only or vector paths."
    );
  }

  const timingMs = Date.now() - startTime;

  return {
    success: true,
    pageCount: totalPages,
    scannedPagesCount: selectedPageNumbers.size,
    totalImagesCount: totalOccurrencesCount,
    uniqueImagesCount: finalImages.length,
    images: finalImages,
    warnings,
    timingMs,
  };
}

export default extractPdfImages;
