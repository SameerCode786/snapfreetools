export async function renderPageToCanvas(pdfPage) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  
  // Controlled scale of 1.5 for high-quality scanned page conversion
  const scale = 1.5;
  const viewport = pdfPage.getViewport({ scale });
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  
  const renderContext = {
    canvasContext: context,
    viewport: viewport
  };
  
  await pdfPage.render(renderContext).promise;
  return canvas;
}
