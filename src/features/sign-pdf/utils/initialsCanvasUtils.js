import { trimCanvasWhitespace } from "./signatureCanvasUtils.js";

/**
 * Calligraphy & monogram font styles for initials.
 */
export const INITIALS_FONTS = [
  {
    id: "initials-script",
    name: "Classic Script",
    fontFamily: "'Brush Script MT', 'Segoe Script', 'Great Vibes', cursive",
    weight: "normal",
    slant: "italic",
    letterSpacing: "4px"
  },
  {
    id: "initials-monogram",
    name: "Modern Monogram",
    fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
    weight: "bold",
    slant: "normal",
    letterSpacing: "6px"
  },
  {
    id: "initials-calligraphy",
    name: "Formal Calligraphy",
    fontFamily: "'Lucida Handwriting', 'Dancing Script', cursive",
    weight: "bold",
    slant: "italic",
    letterSpacing: "3px"
  },
  {
    id: "initials-casual",
    name: "Casual Freehand",
    fontFamily: "'Caveat', 'Comic Sans MS', cursive",
    weight: "bold",
    slant: "normal",
    letterSpacing: "2px"
  }
];

export const INITIALS_COLORS = [
  { id: "black", name: "Classic Black", hex: "#0f172a" },
  { id: "blue", name: "Royal Blue", hex: "#1d4ed8" },
  { id: "emerald", name: "Deep Emerald", hex: "#047857" },
  { id: "violet", name: "Violet Ink", hex: "#6d28d9" }
];

/**
 * Generates a trimmed transparent PNG data URL from typed initials string.
 *
 * @param {string} text - 1 to 4 uppercase letters
 * @param {string} fontId - Font preset ID
 * @param {string} colorHex - Hex color
 * @returns {string} Trimmed PNG data URL
 */
export function generateInitialsDataUrl(text = "SS", fontId = "initials-script", colorHex = "#0f172a") {
  const cleanText = (text || "SS").trim().toUpperCase().substring(0, 4);
  const fontPreset = INITIALS_FONTS.find((f) => f.id === fontId) || INITIALS_FONTS[0];

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const width = 400;
  const height = 240;
  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);

  ctx.font = `${fontPreset.slant} ${fontPreset.weight} 96px ${fontPreset.fontFamily}`;
  ctx.fillStyle = colorHex;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(cleanText, width / 2, height / 2);

  // Return trimmed PNG
  return trimCanvasWhitespace(canvas, 10);
}
