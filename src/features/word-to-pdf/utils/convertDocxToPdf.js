import { MAX_PAGES_DESKTOP, MAX_PAGES_MOBILE, ERROR_MESSAGES } from "../constants";

export async function convertDocxToPdf({
  file,
  containerRef,
  onProgress,
  signal
}) {
  const startTime = performance.now();

  // 1. Check Cancellation
  if (signal?.aborted) {
    throw new Error("CANCELLED");
  }

  // 2. Stage 1: Loading Libraries
  onProgress({ progress: 10, stageText: "Loading conversion engine..." });

  const [docxPreviewModule, html2canvasModule, jspdfModule] = await Promise.all([
    import("docx-preview"),
    import("html2canvas"),
    import("jspdf")
  ]);

  const renderAsync = docxPreviewModule.renderAsync;
  const html2canvas = html2canvasModule.default;
  const { jsPDF } = jspdfModule;

  if (signal?.aborted) throw new Error("CANCELLED");

  // 3. Stage 2: Reading File Buffer
  onProgress({ progress: 25, stageText: "Reading Word document..." });
  const fileBuffer = await file.arrayBuffer();

  if (signal?.aborted) throw new Error("CANCELLED");

  // 4. Stage 3: Rendering DOM in Hidden Workspace
  onProgress({ progress: 40, stageText: "Preparing page layout..." });

  const container = containerRef.current;
  if (!container) throw new Error("Rendering container not initialized.");
  container.innerHTML = "";

  await renderAsync(fileBuffer, container, null, {
    inWrapper: true,
    ignoreWidth: false,
    ignoreHeight: false,
    ignoreFonts: false,
    breakPages: true,
    experimental: false,
    useBase64URL: true
  });

  if (signal?.aborted) throw new Error("CANCELLED");

  // 5. Stage 4: Detecting Page Sections
  const sections = Array.from(
    container.querySelectorAll(".docx-wrapper > section, .docx-wrapper > div")
  );
  const targetElements = sections.length > 0 ? sections : [container.querySelector(".docx-wrapper") || container];

  // Mobile environment detection
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  
  // Estimate total pages based on actual rendered DOM height
  let estimatedTotalPages = 0;
  for (const el of targetElements) {
    const elWidth = el.offsetWidth || 800;
    const domA4Height = elWidth * (297 / 210); // A4 aspect ratio
    const elHeight = el.offsetHeight || domA4Height;
    estimatedTotalPages += Math.max(1, Math.ceil(elHeight / domA4Height));
  }

  const maxAllowedPages = isMobile ? MAX_PAGES_MOBILE : MAX_PAGES_DESKTOP;
  if (estimatedTotalPages > maxAllowedPages) {
    throw new Error(isMobile ? ERROR_MESSAGES.MOBILE_TOO_MANY_PAGES : ERROR_MESSAGES.TOO_MANY_PAGES);
  }

  // 6. Stage 5: Rasterizing and Slicing (Strategy B)
  const pdf = new jsPDF({
    orientation: "p",
    unit: "pt",
    format: "a4"
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const scale = isMobile ? 1.5 : 2.0;

  let isFirstPage = true;
  let pageCounter = 0;

  for (let i = 0; i < targetElements.length; i++) {
    if (signal?.aborted) throw new Error("CANCELLED");

    const elem = targetElements[i];

    // Wait for fonts and internal layouts to settle
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await new Promise(resolve => setTimeout(resolve, 50));

    onProgress({
      progress: 45,
      stageText: `Rendering section ${i + 1}...`,
      currentPage: 0,
      totalPages: estimatedTotalPages
    });

    let fullCanvas = null;
    try {
      fullCanvas = await html2canvas(elem, {
        scale,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      if (!fullCanvas || fullCanvas.width === 0 || fullCanvas.height === 0) {
        throw new Error("Conversion failed: Renderer produced an empty document workspace.");
      }

      const canvasWidth = fullCanvas.width;
      const canvasHeight = fullCanvas.height;

      // PDF dimensions in mm to establish scale
      const pdfPageWidthMm = 210;
      const pdfPageHeightMm = 297;
      const topMarginMm = 15;
      const bottomMarginMm = 15;
      const printableHeightMm = pdfPageHeightMm - topMarginMm - bottomMarginMm;

      // Map physical mm to Canvas pixels
      const fullA4HeightPx = canvasWidth * (pdfPageHeightMm / pdfPageWidthMm);
      const topMarginPx = canvasWidth * (topMarginMm / pdfPageWidthMm);
      const printableHeightPx = canvasWidth * (printableHeightMm / pdfPageWidthMm);

      // Smart Pagination: map unbreakable DOM boundaries to Canvas pixels
      const unbreakableElements = Array.from(
        elem.querySelectorAll('img, table, tr, h1, h2, h3, h4, h5, h6')
      );
      
      const elemRect = elem.getBoundingClientRect();
      const unbreakableBounds = unbreakableElements.map(el => {
        const rect = el.getBoundingClientRect();
        return {
          topPx: (rect.top - elemRect.top) * scale,
          bottomPx: (rect.bottom - elemRect.top) * scale
        };
      });

      let currentY = 0;

      while (currentY < canvasHeight) {
        if (signal?.aborted) throw new Error("CANCELLED");

        pageCounter++;
        onProgress({
          progress: Math.min(50 + Math.round((pageCounter / estimatedTotalPages) * 40), 90),
          stageText: `Compiling page ${pageCounter}...`,
          currentPage: pageCounter,
          totalPages: estimatedTotalPages
        });

        // The chunk is bounded by the printable area, not the full page
        let nextBoundaryY = currentY + printableHeightPx;
        let chunkHeight = printableHeightPx;

        if (nextBoundaryY < canvasHeight) {
          let highestIntersectionY = null;
          
          for (const bounds of unbreakableBounds) {
            // Check if element is exactly straddling the boundary line
            if (bounds.topPx < nextBoundaryY && bounds.bottomPx > nextBoundaryY) {
              // Ensure we don't pull up past the starting line of the current page
              if (bounds.topPx > currentY) {
                if (highestIntersectionY === null || bounds.topPx < highestIntersectionY) {
                  highestIntersectionY = bounds.topPx;
                }
              }
            }
          }

          if (highestIntersectionY !== null) {
            // Give 5 scaled pixels of safety padding
            const proposedBoundary = highestIntersectionY - (5 * scale);
            if (proposedBoundary > currentY + (20 * scale)) {
              nextBoundaryY = proposedBoundary;
              chunkHeight = nextBoundaryY - currentY;
            }
          }
        } else {
          chunkHeight = canvasHeight - currentY;
        }

        if (chunkHeight <= 0) break;

        // Slice via Native Canvas API
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        pageCanvas.height = fullA4HeightPx; // Full A4 page height
        const ctx = pageCanvas.getContext('2d');
        
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        // Draw the extracted chunk into the printable area (shifted down by topMarginPx)
        ctx.drawImage(
          fullCanvas,
          0, currentY, canvasWidth, chunkHeight,
          0, topMarginPx, canvasWidth, chunkHeight
        );

        // Safely check for completely blank generated pages (scanning only the printable area)
        let isBlank = true;
        // Optimization: only scan if chunkHeight is valid
        if (chunkHeight > 0) {
          const imgDataPixels = ctx.getImageData(0, topMarginPx, pageCanvas.width, Math.min(chunkHeight, pageCanvas.height - topMarginPx)).data;
          for (let idx = 0; idx < imgDataPixels.length; idx += 400) {
            const a = imgDataPixels[idx + 3];
            if (a > 0 && (imgDataPixels[idx] < 255 || imgDataPixels[idx + 1] < 255 || imgDataPixels[idx + 2] < 255)) {
              isBlank = false;
              break;
            }
          }
        }

        if (isBlank && pageCounter > 1) {
          console.warn(`Blank page detected at index ${pageCounter}. Skipping.`);
          // We can skip adding this page to the PDF if it's completely empty and not the first page
        } else {
          const imgData = pageCanvas.toDataURL("image/jpeg", 0.95);

          if (!isFirstPage) {
            pdf.addPage("a4", "p");
          }
          isFirstPage = false;

          // Note: Full canvas width/height always correspond exactly to A4
          pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        }

        pageCanvas.width = 0;
        pageCanvas.height = 0;
        
        // Exact continuation of the source offset
        currentY += chunkHeight;

        await new Promise(resolve => setTimeout(resolve, 15));
      }
    } finally {
      if (fullCanvas) {
        fullCanvas.width = 0;
        fullCanvas.height = 0;
        fullCanvas = null;
      }
    }
  }

  if (signal?.aborted) throw new Error("CANCELLED");

  // 7. Stage 6: Compiling PDF & Final Blob
  onProgress({ progress: 95, stageText: "Compiling PDF document..." });

  const pdfBlob = pdf.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const endTime = performance.now();

  const durationSec = ((endTime - startTime) / 1000).toFixed(1);
  const pdfSizeMb = (pdfBlob.size / 1024 / 1024).toFixed(2);

  // Final cleanup of rendered DOM
  container.innerHTML = "";

  onProgress({ progress: 100, stageText: "Ready to download" });

  return {
    pdfUrl,
    pdfBlob,
    metrics: {
      durationSec,
      pdfSizeMb,
      totalPages: pageCounter,
      inputSizeMb: (file.size / 1024 / 1024).toFixed(2)
    }
  };
}
