/**
 * Pure Case Conversion Utility
 * Supports 16 conversion modes with Unicode safety, smart Title/Sentence case, and line-break preservation.
 */

// Common English small words for smart Title Case
const SMALL_WORDS = new Set([
  "a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to",
  "from", "by", "of", "in", "with", "as", "into", "like", "through", "after",
  "over", "between", "out", "against", "during", "without", "before", "under",
  "around", "among"
]);

/**
 * Split text into words while keeping non-word delimiters intact
 */
function getWords(text) {
  // Unicode-aware word extraction
  const words = text.match(/\p{L}+|\p{N}+|[^\s\p{L}\p{N}]+/gu);
  return words || [];
}

/**
 * Extract words (letters & numbers only) for programming cases
 */
function getCleanWords(text) {
  // Matches consecutive letter/number tokens across Unicode
  const matches = text.match(/[\p{L}\p{N}]+/gu);
  return matches || [];
}

/**
 * Smart Title Case implementation
 * Capitalizes first and last word, plus major words. Keeps minor articles/conjunctions lowercase.
 */
export function toTitleCase(text) {
  if (!text) return "";
  
  const lines = text.split(/(\r\n|\r|\n)/);
  return lines.map(line => {
    // If it's a newline delimiter, return as is
    if (/^\r?\n?$/.test(line)) return line;

    // Split line into words and spacing/punctuation tokens
    const tokens = line.split(/(\s+|[^\s\p{L}\p{N}]+)/gu);
    
    // Identify indices of actual words
    const wordIndices = [];
    tokens.forEach((token, idx) => {
      if (/^[\p{L}\p{N}]+$/u.test(token)) {
        wordIndices.push(idx);
      }
    });

    if (wordIndices.length === 0) return line;

    const firstWordIdx = wordIndices[0];
    const lastWordIdx = wordIndices[wordIndices.length - 1];

    return tokens.map((token, idx) => {
      if (!/^[\p{L}\p{N}]+$/u.test(token)) return token;

      const lower = token.toLowerCase();
      
      // Always capitalize first word, last word, or words not in SMALL_WORDS list
      if (idx === firstWordIdx || idx === lastWordIdx || !SMALL_WORDS.has(lower)) {
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }
      return lower;
    }).join("");
  }).join("");
}

/**
 * Smart Sentence Case implementation
 * Identifies sentence boundaries (. ! ?) and capitalizes the first character of each sentence.
 */
export function toSentenceCase(text) {
  if (!text) return "";

  // Convert string to lowercase first, then capitalize sentence starts
  const lower = text.toLowerCase();
  
  // Regex matches sentence starts: beginning of text, or after [.!?] followed by whitespace/quotes
  return lower.replace(/(^\s*|[\.!\?]\s+)([\p{L}])/gu, (match, prefix, char) => {
    return prefix + char.toUpperCase();
  });
}

/**
 * Capitalized Case (Capitalize every word)
 */
export function toCapitalizedCase(text) {
  if (!text) return "";
  return text.replace(/([\p{L}\p{N}]+)/gu, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

/**
 * aLtErNaTiNg CaSe
 */
export function toAlternatingCase(text) {
  if (!text) return "";
  let upper = false;
  let result = "";
  for (const char of text) {
    if (/[\p{L}]/u.test(char)) {
      result += upper ? char.toUpperCase() : char.toLowerCase();
      upper = !upper;
    } else {
      result += char;
    }
  }
  return result;
}

/**
 * InVeRsE CaSe (Swap Casing)
 */
export function toInverseCase(text) {
  if (!text) return "";
  let result = "";
  for (const char of text) {
    const upper = char.toUpperCase();
    const lower = char.toLowerCase();
    if (char === upper && char !== lower) {
      result += lower;
    } else if (char === lower && char !== upper) {
      result += upper;
    } else {
      result += char;
    }
  }
  return result;
}

/**
 * camelCase (e.g. helloWorldExample)
 */
export function toCamelCase(text, preserveLineBreaks = false) {
  if (!text) return "";
  if (preserveLineBreaks) {
    return text.split(/(\r\n|\r|\n)/).map(line => {
      if (/^\r?\n?$/.test(line)) return line;
      return convertSingleLineToCamel(line);
    }).join("");
  }
  return convertSingleLineToCamel(text);
}

function convertSingleLineToCamel(line) {
  const words = getCleanWords(line);
  if (words.length === 0) return "";
  return words.map((w, i) => {
    const lower = w.toLowerCase();
    if (i === 0) return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join("");
}

/**
 * PascalCase (e.g. HelloWorldExample)
 */
export function toPascalCase(text, preserveLineBreaks = false) {
  if (!text) return "";
  if (preserveLineBreaks) {
    return text.split(/(\r\n|\r|\n)/).map(line => {
      if (/^\r?\n?$/.test(line)) return line;
      return convertSingleLineToPascal(line);
    }).join("");
  }
  return convertSingleLineToPascal(text);
}

function convertSingleLineToPascal(line) {
  const words = getCleanWords(line);
  if (words.length === 0) return "";
  return words.map(w => {
    const lower = w.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join("");
}

/**
 * snake_case (e.g. hello_world_example)
 */
export function toSnakeCase(text, preserveLineBreaks = false) {
  if (!text) return "";
  if (preserveLineBreaks) {
    return text.split(/(\r\n|\r|\n)/).map(line => {
      if (/^\r?\n?$/.test(line)) return line;
      return getCleanWords(line).map(w => w.toLowerCase()).join("_");
    }).join("");
  }
  return getCleanWords(text).map(w => w.toLowerCase()).join("_");
}

/**
 * kebab-case (e.g. hello-world-example)
 */
export function toKebabCase(text, preserveLineBreaks = false) {
  if (!text) return "";
  if (preserveLineBreaks) {
    return text.split(/(\r\n|\r|\n)/).map(line => {
      if (/^\r?\n?$/.test(line)) return line;
      return getCleanWords(line).map(w => w.toLowerCase()).join("-");
    }).join("");
  }
  return getCleanWords(text).map(w => w.toLowerCase()).join("-");
}

/**
 * CONSTANT_CASE (e.g. HELLO_WORLD_EXAMPLE)
 */
export function toConstantCase(text, preserveLineBreaks = false) {
  if (!text) return "";
  if (preserveLineBreaks) {
    return text.split(/(\r\n|\r|\n)/).map(line => {
      if (/^\r?\n?$/.test(line)) return line;
      return getCleanWords(line).map(w => w.toUpperCase()).join("_");
    }).join("");
  }
  return getCleanWords(text).map(w => w.toUpperCase()).join("_");
}

/**
 * dot.case (e.g. hello.world.example)
 */
export function toDotCase(text, preserveLineBreaks = false) {
  if (!text) return "";
  if (preserveLineBreaks) {
    return text.split(/(\r\n|\r|\n)/).map(line => {
      if (/^\r?\n?$/.test(line)) return line;
      return getCleanWords(line).map(w => w.toLowerCase()).join(".");
    }).join("");
  }
  return getCleanWords(text).map(w => w.toLowerCase()).join(".");
}

/**
 * path/case (e.g. hello/world/example)
 */
export function toPathCase(text, preserveLineBreaks = false) {
  if (!text) return "";
  if (preserveLineBreaks) {
    return text.split(/(\r\n|\r|\n)/).map(line => {
      if (/^\r?\n?$/.test(line)) return line;
      return getCleanWords(line).map(w => w.toLowerCase()).join("/");
    }).join("");
  }
  return getCleanWords(text).map(w => w.toLowerCase()).join("/");
}

/**
 * Header-Case (e.g. Hello-World-Example)
 */
export function toHeaderCase(text, preserveLineBreaks = false) {
  if (!text) return "";
  if (preserveLineBreaks) {
    return text.split(/(\r\n|\r|\n)/).map(line => {
      if (/^\r?\n?$/.test(line)) return line;
      return getCleanWords(line).map(w => {
        const lower = w.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }).join("-");
    }).join("");
  }
  return getCleanWords(text).map(w => {
    const lower = w.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join("-");
}

/**
 * slug-case (URL friendly slug)
 */
export function toSlugCase(text) {
  if (!text) return "";
  return text
    .normalize("NFD") // Decompose accents
    .replace(/[\u0300-\u036f]/g, "") // Remove accent marks
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "") // Remove special symbols
    .trim()
    .replace(/[\s_]+/g, "-") // Replace spaces/underscores with -
    .replace(/-+/g, "-"); // Collapse multiple dashes
}

/**
 * Main Master Conversion Function
 */
export function convertTextCase(text, mode, options = {}) {
  if (!text) return "";
  const { preserveLineBreaks = true } = options;

  switch (mode) {
    case "uppercase":
      return text.toUpperCase();

    case "lowercase":
      return text.toLowerCase();

    case "titlecase":
      return toTitleCase(text);

    case "sentencecase":
      return toSentenceCase(text);

    case "capitalized":
      return toCapitalizedCase(text);

    case "alternating":
      return toAlternatingCase(text);

    case "inverse":
      return toInverseCase(text);

    case "camelcase":
      return toCamelCase(text, preserveLineBreaks);

    case "pascalcase":
      return toPascalCase(text, preserveLineBreaks);

    case "snakecase":
      return toSnakeCase(text, preserveLineBreaks);

    case "kebabcase":
      return toKebabCase(text, preserveLineBreaks);

    case "constantcase":
      return toConstantCase(text, preserveLineBreaks);

    case "dotcase":
      return toDotCase(text, preserveLineBreaks);

    case "pathcase":
      return toPathCase(text, preserveLineBreaks);

    case "headercase":
      return toHeaderCase(text, preserveLineBreaks);

    case "slugcase":
      return toSlugCase(text);

    default:
      return text;
  }
}

/**
 * Registered Mode Definitions for UI rendering
 */
export const CASE_MODES = [
  { id: "uppercase", name: "UPPER CASE", category: "basic", example: "HELLO WORLD", desc: "Converts all letters to uppercase." },
  { id: "lowercase", name: "lower case", category: "basic", example: "hello world", desc: "Converts all letters to lowercase." },
  { id: "titlecase", name: "Title Case", category: "basic", example: "The Lord of the Rings", desc: "Capitalizes principal words while keeping minor articles lowercase." },
  { id: "sentencecase", name: "Sentence case", category: "basic", example: "Hello world. This is a test.", desc: "Capitalizes the first character of each sentence." },
  { id: "capitalized", name: "Capitalized Case", category: "basic", example: "Hello World From Snap", desc: "Capitalizes the first letter of every word." },
  { id: "alternating", name: "aLtErNaTiNg CaSe", category: "basic", example: "hElLo WoRlD", desc: "Alternates letter casing for stylized text." },
  { id: "inverse", name: "InVeRsE CaSe", category: "basic", example: "hELLO wORLD", desc: "Inverts upper and lower case letters." },
  { id: "camelcase", name: "camelCase", category: "advanced", example: "helloWorldExample", desc: "Removes spaces and capitalizes each word except the first." },
  { id: "pascalcase", name: "PascalCase", category: "advanced", example: "HelloWorldExample", desc: "Removes spaces and capitalizes the first letter of every word." },
  { id: "snakecase", name: "snake_case", category: "advanced", example: "hello_world_example", desc: "Replaces spaces with underscores in lowercase." },
  { id: "kebabcase", name: "kebab-case", category: "advanced", example: "hello-world-example", desc: "Replaces spaces with hyphens in lowercase." },
  { id: "constantcase", name: "CONSTANT_CASE", category: "advanced", example: "HELLO_WORLD_EXAMPLE", desc: "Replaces spaces with underscores in uppercase." },
  { id: "dotcase", name: "dot.case", category: "advanced", example: "hello.world.example", desc: "Replaces spaces with dots in lowercase." },
  { id: "pathcase", name: "path/case", category: "advanced", example: "hello/world/example", desc: "Replaces spaces with forward slashes in lowercase." },
  { id: "headercase", name: "Header-Case", category: "advanced", example: "Hello-World-Example", desc: "Hyphenated words with initial capitalization." },
  { id: "slugcase", name: "slug-case", category: "advanced", example: "my-amazing-blog-post", desc: "Creates URL-friendly slugs removing special characters." }
];
