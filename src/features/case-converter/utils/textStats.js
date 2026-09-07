/**
 * Text Statistics Engine
 * Calculates Unicode-aware character, word, sentence, paragraph, line counts, bytes, and reading time.
 */

export function calculateTextStats(text) {
  if (!text) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      paragraphs: 0,
      sentences: 0,
      bytes: 0,
      readingTimeSeconds: 0,
      readingTimeFormatted: "0 sec"
    };
  }

  // Raw character count (supports multi-code-unit Unicode surrogate pairs correctly)
  const characters = Array.from(text).length;

  // Characters excluding all whitespace characters
  const charactersNoSpaces = Array.from(text.replace(/\s+/g, "")).length;

  // Unicode word count using letter/number match tokens
  const wordsMatch = text.match(/[\p{L}\p{N}]+/gu);
  const words = wordsMatch ? wordsMatch.length : 0;

  // Line count (split by CRLF, CR, or LF)
  const lines = text ? text.split(/\r\n|\r|\n/).length : 0;

  // Paragraph count (blocks separated by empty lines)
  const paragraphs = text.trim()
    ? text.trim().split(/\n\s*\n/).filter(p => p.trim().length > 0).length
    : 0;

  // Sentence count (matches text ending with . ! or ?)
  const sentencesMatch = text.match(/[^.!?\s][^.!?]*[.!?]+/gu);
  const sentences = sentencesMatch ? sentencesMatch.length : (words > 0 ? 1 : 0);

  // Byte size in UTF-8
  let bytes = 0;
  try {
    bytes = new Blob([text]).size;
  } catch {
    bytes = new TextEncoder().encode(text).length;
  }

  // Reading time (average adult reading speed = 225 words/min)
  const readingTimeSeconds = Math.ceil((words / 225) * 60);
  let readingTimeFormatted = "0 sec";
  if (readingTimeSeconds >= 60) {
    const mins = Math.floor(readingTimeSeconds / 60);
    const secs = readingTimeSeconds % 60;
    readingTimeFormatted = secs > 0 ? `${mins} m ${secs} s` : `${mins} min`;
  } else if (readingTimeSeconds > 0) {
    readingTimeFormatted = `${readingTimeSeconds} sec`;
  }

  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    paragraphs,
    sentences,
    bytes,
    readingTimeSeconds,
    readingTimeFormatted
  };
}
