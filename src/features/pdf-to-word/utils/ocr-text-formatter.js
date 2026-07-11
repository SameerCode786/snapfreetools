export function formatOCRText(text) {
  if (!text) return [];
  
  // Split the raw text by line breaks
  const lines = text.split(/\r?\n/);
  const paragraphs = [];
  let currentParagraph = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === "") {
      // Empty line signals end of current paragraph
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join(" "));
        currentParagraph = [];
      }
    } else {
      currentParagraph.push(line);
    }
  }

  // Add any trailing paragraph
  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(" "));
  }

  // Filter out redundant empty spaces or formatting artifacts
  return paragraphs.filter(p => p.trim() !== "");
}
