import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

/**
 * Sanitizes original base filename for clean output names.
 * Removes extension and invalid filesystem characters.
 */
export const sanitizeFilename = (filename) => {
  if (!filename) return "document";
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  return nameWithoutExt
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "document";
};

/**
 * Formats size in bytes to human readable string (KB, MB).
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Core PDF Splitting Engine using pdf-lib & JSZip.
 * Supports all 5 Modes with progress reporting and clean filename generation.
 */
export const executePdfSplit = async ({
  file,
  mode,
  settings,
  onProgress
}) => {
  if (!file || !file.rawFile) {
    throw new Error("No PDF file provided.");
  }

  const baseName = sanitizeFilename(file.name);
  const arrayBuffer = await file.rawFile.arrayBuffer();

  let srcDoc;
  try {
    srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch (err) {
    if (err.message && err.message.toLowerCase().includes("encrypted")) {
      throw new Error(`"${file.name}" is password-protected. Please unlock it before splitting.`);
    }
    throw new Error(`Failed to load "${file.name}". The file may be corrupt.`);
  }

  const totalDocPages = srcDoc.getPageCount();
  const outputFiles = []; // { name, blob, url, pageCount, size }

  // ----------------------------------------------------
  // MODE 1: Extract Specific Pages (1 merged output PDF)
  // ----------------------------------------------------
  if (mode === "specific-pages") {
    const { pageIndices } = settings; // 0-based
    if (!pageIndices || pageIndices.length === 0) {
      throw new Error("No valid pages selected for extraction.");
    }

    if (onProgress) {
      onProgress({ percent: 15, message: "Extracting selected pages..." });
    }

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(srcDoc, pageIndices);
    copiedPages.forEach(page => newPdf.addPage(page));

    if (onProgress) {
      onProgress({ percent: 70, message: "Generating PDF document..." });
    }

    const pdfBytes = await newPdf.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const rangeLabel = pageIndices.length === 1
      ? `page-${pageIndices[0] + 1}`
      : `pages-${pageIndices[0] + 1}-${pageIndices[pageIndices.length - 1] + 1}`;
    
    const outName = `${baseName}-${rangeLabel}.pdf`;

    outputFiles.push({
      name: outName,
      blob,
      url,
      pageCount: pageIndices.length,
      size: blob.size
    });
  }

  // ----------------------------------------------------
  // MODE 2: Split Every Page (N single-page output PDFs)
  // ----------------------------------------------------
  else if (mode === "every-page") {
    for (let i = 0; i < totalDocPages; i++) {
      const currentPercent = Math.round(((i + 1) / totalDocPages) * 80);
      if (onProgress) {
        onProgress({
          percent: currentPercent,
          message: `Creating page ${i + 1} of ${totalDocPages}...`
        });
      }

      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(srcDoc, [i]);
      newPdf.addPage(copiedPage);

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const outName = `${baseName}-page-${i + 1}.pdf`;

      outputFiles.push({
        name: outName,
        blob,
        url,
        pageCount: 1,
        size: blob.size
      });

      if (i % 5 === 0) {
        await new Promise(r => setTimeout(r, 0));
      }
    }
  }

  // ----------------------------------------------------
  // MODE 3: Custom Page Ranges (1 output PDF per range)
  // ----------------------------------------------------
  else if (mode === "custom-ranges") {
    const { ranges } = settings; // Array of { startPage, endPage, pageIndices }
    if (!ranges || ranges.length === 0) {
      throw new Error("No custom ranges provided.");
    }

    for (let rIdx = 0; rIdx < ranges.length; rIdx++) {
      const range = ranges[rIdx];
      const currentPercent = Math.round(((rIdx + 1) / ranges.length) * 80);

      if (onProgress) {
        onProgress({
          percent: currentPercent,
          message: `Creating PDF ${rIdx + 1} of ${ranges.length} (Pages ${range.startPage}–${range.endPage})...`
        });
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(srcDoc, range.pageIndices);
      copiedPages.forEach(p => newPdf.addPage(p));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const outName = `${baseName}-pages-${range.startPage}-${range.endPage}.pdf`;

      outputFiles.push({
        name: outName,
        blob,
        url,
        pageCount: range.pageIndices.length,
        size: blob.size
      });

      await new Promise(r => setTimeout(r, 0));
    }
  }

  // ----------------------------------------------------
  // MODE 4: Split Every N Pages
  // ----------------------------------------------------
  else if (mode === "every-n-pages") {
    const n = parseInt(settings.n, 10) || 1;
    let partIndex = 1;

    for (let i = 0; i < totalDocPages; i += n) {
      const chunkIndices = [];
      for (let j = i; j < Math.min(i + n, totalDocPages); j++) {
        chunkIndices.push(j);
      }

      const startP = i + 1;
      const endP = Math.min(i + n, totalDocPages);
      const currentPercent = Math.round((endP / totalDocPages) * 80);

      if (onProgress) {
        onProgress({
          percent: currentPercent,
          message: `Creating part ${partIndex} (Pages ${startP}–${endP})...`
        });
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(srcDoc, chunkIndices);
      copiedPages.forEach(p => newPdf.addPage(p));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const outName = `${baseName}-part-${partIndex}-pages-${startP}-${endP}.pdf`;

      outputFiles.push({
        name: outName,
        blob,
        url,
        pageCount: chunkIndices.length,
        size: blob.size
      });

      partIndex++;
      await new Promise(r => setTimeout(r, 0));
    }
  }

  // ----------------------------------------------------
  // MODE 5: Visual Selection (1 output PDF containing selected)
  // ----------------------------------------------------
  else if (mode === "visual-selection") {
    const { selectedPageIndices } = settings; // Sorted array of 0-based page indices
    if (!selectedPageIndices || selectedPageIndices.length === 0) {
      throw new Error("Please select at least one page thumbnail.");
    }

    if (onProgress) {
      onProgress({ percent: 20, message: "Extracting visually selected pages..." });
    }

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(srcDoc, selectedPageIndices);
    copiedPages.forEach(p => newPdf.addPage(p));

    if (onProgress) {
      onProgress({ percent: 75, message: "Generating PDF document..." });
    }

    const pdfBytes = await newPdf.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const outName = `${baseName}-selected-pages.pdf`;

    outputFiles.push({
      name: outName,
      blob,
      url,
      pageCount: selectedPageIndices.length,
      size: blob.size
    });
  }

  // ----------------------------------------------------
  // ZIP Generation for multi-file outputs
  // ----------------------------------------------------
  let zipBlob = null;
  let zipUrl = null;

  if (outputFiles.length > 1) {
    if (onProgress) {
      onProgress({ percent: 90, message: "Packaging ZIP archive..." });
    }

    const zip = new JSZip();
    outputFiles.forEach(item => {
      zip.file(item.name, item.blob);
    });

    zipBlob = await zip.generateAsync({ type: "blob" });
    zipUrl = URL.createObjectURL(zipBlob);
  }

  if (onProgress) {
    onProgress({ percent: 100, message: "Split complete!" });
  }

  return {
    outputFiles,
    zipBlob,
    zipUrl,
    zipName: `${baseName}-split-files.zip`,
    totalOutputFiles: outputFiles.length,
    totalOriginalPages: totalDocPages
  };
};
