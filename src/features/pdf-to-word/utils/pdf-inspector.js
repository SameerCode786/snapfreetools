/**
 * PDF Inspector Utility
 * Analyzes uploaded PDF documents to detect scanned/image-based pages vs digital text.
 * Runs 100% in-browser using pdfjs-dist.
 */

export async function inspectPdfDocument(pdfDoc) {
  const numPages = pdfDoc.numPages;

  let totalChars = 0;
  let scannedPageCount = 0;
  let textPageCount = 0;

  // Inspect up to 10 pages for rapid assessment
  const pagesToInspect = Math.min(numPages, 10);

  for (let i = 1; i <= pagesToInspect; i++) {
    try {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      
      const pageText = (textContent.items || [])
        .filter((item) => typeof item.str === "string")
        .map((item) => item.str)
        .join(" ")
        .trim();

      const charCount = pageText.length;
      totalChars += charCount;

      // Pages with fewer than 15 characters are considered scanned or image-based
      if (charCount < 15) {
        scannedPageCount++;
      } else {
        textPageCount++;
      }
    } catch (err) {
      console.warn(`Could not inspect text for page ${i}:`, err);
      scannedPageCount++;
    }
  }

  const isPurelyScanned = scannedPageCount === pagesToInspect;
  const isMixed = scannedPageCount > 0 && textPageCount > 0;
  const isTextBased = scannedPageCount === 0;
  // Document is considered scanned if purely scanned or contains pages with no meaningful text
  const isScanned = isPurelyScanned || isMixed;

  return {
    numPages,
    inspectedPages: pagesToInspect,
    totalChars,
    scannedPageCount,
    textPageCount,
    isScanned,
    isPurelyScanned,
    isMixed,
    isTextBased,
  };
}
