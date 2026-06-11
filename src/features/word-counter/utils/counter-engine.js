export function calculateTextStats(text) {
  const trimmedText = text.trim();
  const words = trimmedText ? trimmedText.split(/\s+/).length : 0;
  const characters = text.length;
  const sentences = trimmedText ? trimmedText.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphs = trimmedText ? trimmedText.split(/\n+/).filter(Boolean).length : 0;
  
  // Average reading speed: 200 words per minute
  const readingTime = Math.ceil(words / 200);

  return { words, characters, sentences, paragraphs, readingTime };
}
