/**
 * Calculates page dimensions and image drawing coordinates in mm.
 * Shared between jsPDF generator and React DOM live preview components.
 */
export function calculatePageLayout(widthPx, heightPx, settings) {
  const { pageSize, orientation, margin } = settings;

  // Map margin setting to millimeters
  const marginMap = {
    none: 0,
    small: 10,
    large: 20
  };
  const marginMm = marginMap[margin] ?? 0;

  // Standard conversion factor: 1px = 0.264583 mm
  const pxToMm = 0.264583;
  const imgWidthMm = widthPx * pxToMm;
  const imgHeightMm = heightPx * pxToMm;

  // Determine page orientation based on user settings and image aspect ratio
  let pageOrientation = "p";
  if (orientation === "portrait") {
    pageOrientation = "p";
  } else if (orientation === "landscape") {
    pageOrientation = "l";
  } else {
    // auto: choose landscape for wide images, portrait for tall/square images
    pageOrientation = imgWidthMm >= imgHeightMm ? "l" : "p";
  }

  // Determine page size in mm
  let pageWidth = 0;
  let pageHeight = 0;
  let drawX = marginMm;
  let drawY = marginMm;
  let drawWidth = imgWidthMm;
  let drawHeight = imgHeightMm;

  if (pageSize === "a4") {
    pageWidth = pageOrientation === "p" ? 210 : 297;
    pageHeight = pageOrientation === "p" ? 297 : 210;
  } else if (pageSize === "letter") {
    pageWidth = pageOrientation === "p" ? 215.9 : 279.4;
    pageHeight = pageOrientation === "p" ? 279.4 : 215.9;
  } else {
    // "fit" style
    // Auto + Fit Image
    if (
      orientation === "auto" ||
      (orientation === "portrait" && imgHeightMm >= imgWidthMm) ||
      (orientation === "landscape" && imgWidthMm >= imgHeightMm)
    ) {
      pageWidth = imgWidthMm + 2 * marginMm;
      pageHeight = imgHeightMm + 2 * marginMm;
      drawWidth = imgWidthMm;
      drawHeight = imgHeightMm;
      drawX = marginMm;
      drawY = marginMm;
    }
    // Portrait + Fit Image (landscape image forced to portrait page size)
    else if (orientation === "portrait" && imgWidthMm > imgHeightMm) {
      pageWidth = imgWidthMm + 2 * marginMm;
      pageHeight = pageWidth * 1.414; // ISO A-Series ratio
      drawWidth = imgWidthMm;
      drawHeight = imgHeightMm;
      drawX = marginMm;
      const availHeight = pageHeight - 2 * marginMm;
      drawY = marginMm + (availHeight - imgHeightMm) / 2;
    }
    // Landscape + Fit Image (portrait image forced to landscape page size)
    else if (orientation === "landscape" && imgHeightMm > imgWidthMm) {
      pageHeight = imgHeightMm + 2 * marginMm;
      pageWidth = pageHeight * 1.414; // ISO A-Series ratio
      drawWidth = imgWidthMm;
      drawHeight = imgHeightMm;
      drawY = marginMm;
      const availWidth = pageWidth - 2 * marginMm;
      drawX = marginMm + (availWidth - imgWidthMm) / 2;
    }
  }

  // Adjust coordinates when scaling to A4 or Letter sheets
  if (pageSize !== "fit") {
    const availWidth = pageWidth - 2 * marginMm;
    const availHeight = pageHeight - 2 * marginMm;

    const imgRatio = imgWidthMm / imgHeightMm;
    const availRatio = availWidth / availHeight;

    if (imgRatio > availRatio) {
      drawWidth = availWidth;
      drawHeight = availWidth / imgRatio;
    } else {
      drawHeight = availHeight;
      drawWidth = availHeight * imgRatio;
    }

    // Center the image within printable margins
    drawX = marginMm + (availWidth - drawWidth) / 2;
    drawY = marginMm + (availHeight - drawHeight) / 2;
  }

  return {
    pageWidth,
    pageHeight,
    pageOrientation,
    drawX,
    drawY,
    drawWidth,
    drawHeight,
    marginMm
  };
}
