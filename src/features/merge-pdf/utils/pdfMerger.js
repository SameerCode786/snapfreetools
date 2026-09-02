import { PDFDocument } from "pdf-lib";

/**
 * PDF worker dynamic engine getter via pdfjs-dist
 */
export const getPdfJsEngine = async () => {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  return pdfjs;
};

/**
 * Parses an uploaded PDF file: reads page count, file size, and generates a 1st page thumbnail
 */
export const parsePdfFileInfo = async (file) => {
  const pdfjs = await getPdfJsEngine();
  const arrayBuffer = await file.arrayBuffer();
  
  // Parse doc with pdfjs-dist
  const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const pageCount = pdfDoc.numPages;

  // Render 1st page low-res thumbnail preview
  let thumbnailUrl = null;
  if (pageCount > 0) {
    const page = await pdfDoc.getPage(1);
    const viewport = page.getViewport({ scale: 0.3 });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    await page.render({
      canvasContext: ctx,
      viewport: viewport
    }).promise;

    thumbnailUrl = canvas.toDataURL("image/jpeg", 0.75);
    
    // Release canvas DOM memory
    canvas.width = 0;
    canvas.height = 0;
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: file.name,
    size: file.size,
    pageCount,
    thumbnailUrl,
    rawFile: file
  };
};

/**
 * Merges multiple PDF files natively using pdf-lib.
 * Preserves original vector page graphics, text objects, fonts, dimensions & orientation.
 */
export const mergePdfFiles = async (fileList, onProgress) => {
  if (!fileList || fileList.length === 0) {
    throw new Error("No PDF files provided for merging.");
  }

  // Create new empty PDF document
  const mergedPdf = await PDFDocument.create();
  let totalPagesMerged = 0;

  for (let i = 0; i < fileList.length; i++) {
    const item = fileList[i];
    
    if (onProgress) {
      onProgress({
        currentFileIndex: i + 1,
        totalFiles: fileList.length,
        filename: item.name,
        percent: Math.round(((i) / fileList.length) * 100)
      });
    }

    try {
      const bytes = await item.rawFile.arrayBuffer();
      // Load source PDF cleanly
      const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pageIndices = srcDoc.getPageIndices();
      
      // Native vector page copy
      const copiedPages = await mergedPdf.copyPages(srcDoc, pageIndices);
      
      // Append each page maintaining original dimensions and orientation
      for (const page of copiedPages) {
        mergedPdf.addPage(page);
        totalPagesMerged++;
      }
    } catch (err) {
      console.error(`Error merging file "${item.name}":`, err);
      if (err.message && err.message.includes("encrypted")) {
        throw new Error(`The file "${item.name}" is password-protected. Please unlock it before merging.`);
      }
      throw new Error(`Failed to read "${item.name}". The file may be corrupt.`);
    }
  }

  if (onProgress) {
    onProgress({
      currentFileIndex: fileList.length,
      totalFiles: fileList.length,
      filename: "Finalizing PDF...",
      percent: 95
    });
  }

  // Save final merged PDF as Uint8Array
  const mergedPdfBytes = await mergedPdf.save();
  const mergedBlob = new Blob([mergedPdfBytes], { type: "application/pdf" });

  if (onProgress) {
    onProgress({
      currentFileIndex: fileList.length,
      totalFiles: fileList.length,
      filename: "Complete",
      percent: 100
    });
  }

  return {
    blob: mergedBlob,
    totalPages: totalPagesMerged,
    fileSize: mergedBlob.size
  };
};
