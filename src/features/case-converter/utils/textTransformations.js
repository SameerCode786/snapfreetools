/**
 * Smart Non-Case Text Transformations
 * Provides quick actions to clean, format, filter, and modify text structure.
 */

/**
 * Remove extra consecutive spaces (collapses multiple spaces into single space)
 */
export function removeExtraSpaces(text) {
  if (!text) return "";
  return text.split("\n").map(line => line.replace(/[ \t]+/g, " ")).join("\n");
}

/**
 * Remove leading and trailing whitespace from the overall text
 */
export function removeLeadingTrailingWhitespace(text) {
  if (!text) return "";
  return text.trim();
}

/**
 * Remove all whitespace (spaces, tabs, newlines)
 */
export function removeAllWhitespace(text) {
  if (!text) return "";
  return text.replace(/\s+/g, "");
}

/**
 * Remove line breaks (converts newlines into single spaces)
 */
export function removeLineBreaks(text) {
  if (!text) return "";
  return text.replace(/(\r\n|\r|\n)+/g, " ").replace(/ +/g, " ").trim();
}

/**
 * Normalize line breaks (converts \r\n to \n and strips trailing line breaks)
 */
export function normalizeLineBreaks(text) {
  if (!text) return "";
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

/**
 * Remove duplicate blank lines
 */
export function removeDuplicateBlankLines(text) {
  if (!text) return "";
  return text.replace(/\n\s*\n\s*\n+/g, "\n\n");
}

/**
 * Trim every line individually
 */
export function trimEveryLine(text) {
  if (!text) return "";
  return text.split("\n").map(line => line.trim()).join("\n");
}

/**
 * Reverse entire text (Unicode surrogate pair safe)
 */
export function reverseText(text) {
  if (!text) return "";
  return Array.from(text).reverse().join("");
}

/**
 * Reverse words order
 */
export function reverseWords(text) {
  if (!text) return "";
  return text.split(/(\s+)/).reverse().join("");
}

/**
 * Reverse letters inside each word
 */
export function reverseLettersInWords(text) {
  if (!text) return "";
  return text.replace(/([\p{L}\p{N}]+)/gu, (word) => {
    return Array.from(word).reverse().join("");
  });
}

/**
 * Remove punctuation symbols
 */
export function removePunctuation(text) {
  if (!text) return "";
  // Unicode aware punctuation removal
  return text.replace(/[^\p{L}\p{N}\s]/gu, "");
}

/**
 * Remove numbers
 */
export function removeNumbers(text) {
  if (!text) return "";
  return text.replace(/[\p{N}]/gu, "");
}

/**
 * Keep only numbers and line breaks/spaces
 */
export function keepOnlyNumbers(text) {
  if (!text) return "";
  return text.replace(/[^\p{N}\s]/gu, "");
}

/**
 * Keep only letters and line breaks/spaces
 */
export function keepOnlyLetters(text) {
  if (!text) return "";
  return text.replace(/[^\p{L}\s]/gu, "");
}

/**
 * Keep letters and numbers (strips punctuation & special symbols)
 */
export function keepLettersAndNumbers(text) {
  if (!text) return "";
  return text.replace(/[^\p{L}\p{N}\s]/gu, "");
}

/**
 * Convert tabs to 4 spaces
 */
export function convertTabsToSpaces(text) {
  if (!text) return "";
  return text.replace(/\t/g, "    ");
}

export const SMART_TRANSFORMATIONS = [
  { id: "remove-extra-spaces", name: "Remove Extra Spaces", desc: "Collapse multiple spaces into a single space" },
  { id: "trim-lines", name: "Trim Every Line", desc: "Remove leading and trailing spaces from all lines" },
  { id: "remove-blank-lines", name: "Remove Blank Lines", desc: "Clean up empty lines" },
  { id: "remove-line-breaks", name: "Remove Line Breaks", desc: "Convert text into a continuous single paragraph" },
  { id: "remove-all-spaces", name: "Remove All Whitespace", desc: "Strip all spaces and newlines" },
  { id: "tabs-to-spaces", name: "Tabs → 4 Spaces", desc: "Convert tab characters into spaces" },
  { id: "remove-punctuation", name: "Remove Punctuation", desc: "Strip all symbols and punctuation marks" },
  { id: "remove-numbers", name: "Remove Numbers", desc: "Strip all digits" },
  { id: "keep-numbers", name: "Keep Numbers Only", desc: "Strip all letters and symbols except digits" },
  { id: "keep-letters", name: "Keep Letters Only", desc: "Strip all numbers and symbols except letters" },
  { id: "reverse-text", name: "Reverse Entire Text", desc: "Flips text characters backwards" },
  { id: "reverse-words", name: "Reverse Word Order", desc: "Flips word positions in sentence" }
];
