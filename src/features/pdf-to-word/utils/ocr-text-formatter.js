/**
 * OCR Text Formatter
 * 
 * Intelligent layout and text reconstructor for OCR output:
 * 1. Filters stray scanner margin noise (e.g. "L i", "|", edge dust) strictly at page boundaries.
 * 2. Does NOT perform unsafe global word replacements on legitimate document content.
 * 3. Detects and preserves headings ("Lorem ipsum", "Chapter 1", etc.) instead of merging into body text.
 * 4. Joins line-wrapped sentences within paragraphs cleanly.
 * 5. Unwraps hyphenated split words (e.g. "docu-" + "ment" -> "document") only on real split word boundaries.
 * 6. Normalizes bullet points ("•", "*", "-", "o") and preserves multi-line bullet continuations.
 * 7. Preserves numbered lists ("1.", "2)", etc.) and list hierarchy.
 */

export function formatOCRText(text) {
  if (!text || typeof text !== "string") return [];

  const rawLines = text.split(/\r?\n/);
  const blocks = [];
  let currentBlockLines = [];
  let currentBlockType = "paragraph"; // "paragraph" | "heading" | "bullet" | "numbered"

  // 1. Detect if a line is pure OCR scanner noise strictly at page boundaries (e.g. "L i", "|", edge smudges)
  const isPageEdgeArtifact = (line) => {
    const trimmed = line.trim();
    if (!trimmed) return true;

    // Legitimate single-letter and short words in titles or text that MUST NOT be deleted:
    // "A", "I", "In", "On", "To", "By", "At", "Of", "Or", "If", "No", "We", "He", "It", "Is", "As", "An", "Do", "Go", "Me", "My", "So", "Up", "Us"
    const validShortWords = new Set([
      "a", "i", "in", "on", "to", "by", "at", "of", "or", "if", "no",
      "we", "he", "it", "is", "as", "an", "do", "go", "me", "my", "so", "up", "us"
    ]);

    if (validShortWords.has(trimmed.toLowerCase())) {
      return false;
    }

    // Typical scanner margin/edge artifacts: spaced fragments like "L i", "l i", "| i", "I I", "~", "`"
    if (/^[L|lI1i!\\/\\-_~'`,;:.\s]{1,5}$/.test(trimmed)) {
      return true;
    }

    // Isolated punctuation or lone stray non-alphanumeric symbols
    if (trimmed.length <= 2 && !/^[a-zA-Z0-9]{1,2}$/.test(trimmed)) {
      return true;
    }

    // Isolated single consonant without vowels (e.g. 'x', 'q', 'z', 'l' alone on a line)
    if (/^[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]$/.test(trimmed)) {
      return true;
    }

    return false;
  };

  // 2. Detect bullet point start
  const getBulletMatch = (line) => {
    const match = line.match(/^(\s*[-•*▪►–—]|(?:\s*o\s+))(\s*.*)$/);
    if (match) {
      return { bullet: "•", text: match[2].trim() };
    }
    return null;
  };

  // 3. Detect numbered list start
  const getNumberedMatch = (line) => {
    const match = line.match(/^(\s*\(?\d+[\.\)]\s+)(.*)$/);
    if (match) {
      return { prefix: match[1].trim(), text: match[2].trim() };
    }
    return null;
  };

  // 4. Detect heading line:
  // Short line, starts with Capital letter or Title Case or Uppercase, no trailing comma/semicolon/hyphen,
  // typically <= 65 characters and <= 9 words.
  const isHeadingLine = (line, nextLine) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 65) return false;

    // Must start with uppercase or number (e.g. "Lorem ipsum", "Chapter 1", "SECTION A")
    if (!/^[A-Z0-9"']/.test(trimmed)) return false;

    // Must not end with sentence connectors or split marks
    if (/[,;:\-–—\(\[\{]\s*$/.test(trimmed)) return false;

    const words = trimmed.split(/\s+/);
    if (words.length > 9) return false;

    // If it ends with a period, only a heading if it's a short Title Case or Section numbering
    if (trimmed.endsWith(".")) {
      const isShortTitle = words.length <= 5 && /^[A-Z]/.test(trimmed);
      const isSectionNumber = /^\d+[\.\)]/.test(trimmed);
      if (!isShortTitle && !isSectionNumber) return false;
    }

    // If there is a next line, verify it doesn't indicate a split sentence
    if (nextLine) {
      const nextTrimmed = nextLine.trim();
      if (nextTrimmed && /^[a-z]/.test(nextTrimmed)) {
        // Next line starts with lowercase, so current line is part of a wrapped sentence
        return false;
      }
    }

    return true;
  };

  const flushBlock = () => {
    if (currentBlockLines.length === 0) return;

    // Join lines: unwrap hyphenated split words at line ends only when indicating a split word
    let joined = "";
    for (let i = 0; i < currentBlockLines.length; i++) {
      const line = currentBlockLines[i];
      if (i === 0) {
        joined = line;
      } else {
        const prev = currentBlockLines[i - 1];
        if (/[a-zA-Z]-$/.test(prev) && !prev.endsWith(" -")) {
          // Unwrap hyphenated split word: "docu-" + "ment" -> "document"
          joined = joined.slice(0, -1) + line;
        } else {
          joined += " " + line;
        }
      }
    }

    // Normalize whitespace while preserving original recognized words verbatim
    const clean = joined.trim().replace(/\s{2,}/g, " ");

    if (clean) {
      blocks.push({
        text: clean,
        type: currentBlockType,
      });
    }

    currentBlockLines = [];
    currentBlockType = "paragraph";
  };

  // Pre-filter noise lines from the very beginning of the page
  let startIndex = 0;
  while (startIndex < rawLines.length && isPageEdgeArtifact(rawLines[startIndex])) {
    startIndex++;
  }

  // Pre-filter noise lines from the very end of the page
  let endIndex = rawLines.length - 1;
  while (endIndex >= startIndex && isPageEdgeArtifact(rawLines[endIndex])) {
    endIndex--;
  }

  for (let i = startIndex; i <= endIndex; i++) {
    const rawLine = rawLines[i];
    const line = rawLine.trim();

    if (!line) {
      flushBlock();
      continue;
    }

    // Filter isolated non-alphanumeric stray lines inside document body
    if (line.length <= 2 && !/^[a-zA-Z0-9]{1,2}$/.test(line)) {
      continue;
    }

    const nextLine = i + 1 <= endIndex ? rawLines[i + 1] : null;

    // Check Bullet Item
    const bulletMatch = getBulletMatch(line);
    if (bulletMatch) {
      flushBlock();
      currentBlockType = "bullet";
      currentBlockLines.push("• " + bulletMatch.text);
      continue;
    }

    // Check Numbered Item
    const numberedMatch = getNumberedMatch(line);
    if (numberedMatch) {
      flushBlock();
      currentBlockType = "numbered";
      currentBlockLines.push(numberedMatch.prefix + " " + numberedMatch.text);
      continue;
    }

    // If currently inside a list item, check if this line is a continuation of the list item
    if (currentBlockType === "bullet" || currentBlockType === "numbered") {
      const isListItemContinuation =
        /^[a-z0-9,;\(\]]/.test(line) ||
        !isHeadingLine(line, nextLine);

      if (isListItemContinuation && !getBulletMatch(line) && !getNumberedMatch(line)) {
        currentBlockLines.push(line);
        continue;
      } else {
        // Next item or new section
        flushBlock();
      }
    }

    // Check Heading
    if (currentBlockLines.length === 0 && isHeadingLine(line, nextLine)) {
      currentBlockType = "heading";
      currentBlockLines.push(line);
      flushBlock();
      continue;
    }

    // Regular paragraph line
    currentBlockLines.push(line);
  }

  flushBlock();
  return blocks;
}
