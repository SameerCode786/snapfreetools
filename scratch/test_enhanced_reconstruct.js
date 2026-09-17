import { reconstructTableFromTextNodes } from "../src/features/pdf-to-excel/utils/pdfToExcelEngine.js";

// Test dataset 1: Simulated vu.pdf words
const vuWords = [
  // Row 1: Spanning header
  { text: "Virtual", x0: 50, y0: 50, x1: 95, y1: 64 },
  { text: "University", x0: 100, y0: 50, x1: 170, y1: 64 },
  { text: "of", x0: 175, y0: 50, x1: 190, y1: 64 },
  { text: "Pakistan", x0: 195, y0: 50, x1: 250, y1: 64 },
  { text: "--", x0: 255, y0: 50, x1: 265, y1: 64 },
  { text: "Thanks", x0: 270, y0: 50, x1: 320, y1: 64 },

  // Row 2: Heading
  { text: "PAYMENT", x0: 50, y0: 80, x1: 110, y1: 94 },
  { text: "SUMMARY", x0: 115, y0: 80, x1: 180, y1: 94 },

  // Row 3: 2-column Key Value
  { text: "Name", x0: 50, y0: 110, x1: 85, y1: 124 },
  { text: "on", x0: 90, y0: 110, x1: 105, y1: 124 },
  { text: "Card", x0: 110, y0: 110, x1: 140, y1: 124 },
  { text: "MUHAMMAD", x0: 260, y0: 110, x1: 340, y1: 124 },
  { text: "SAMEER", x0: 345, y0: 110, x1: 400, y1: 124 },
  { text: "CHAUDHARY", x0: 405, y0: 110, x1: 490, y1: 124 },

  // Row 4: 2-column Key Value
  { text: "Reference", x0: 50, y0: 140, x1: 120, y1: 154 },
  { text: "No:", x0: 125, y0: 140, x1: 145, y1: 154 },
  { text: "27289772", x0: 260, y0: 140, x1: 330, y1: 154 },

  // Row 5: 2-column Key Value
  { text: "Card", x0: 50, y0: 170, x1: 80, y1: 184 },
  { text: "Type", x0: 85, y0: 170, x1: 115, y1: 184 },
  { text: "VISA", x0: 260, y0: 170, x1: 295, y1: 184 },

  // Row 6: 2-column Key Value
  { text: "Amount", x0: 50, y0: 200, x1: 105, y1: 214 },
  { text: "500", x0: 260, y0: 200, x1: 285, y1: 214 },
  { text: "PKR", x0: 290, y0: 200, x1: 315, y1: 214 },

  // Row 7: 2-column Key Value
  { text: "Transaction", x0: 50, y0: 230, x1: 130, y1: 244 },
  { text: "Date", x0: 135, y0: 230, x1: 165, y1: 244 },
  { text: "24/07/2026", x0: 260, y0: 230, x1: 335, y1: 244 },
  { text: "12:56:45", x0: 340, y0: 230, x1: 395, y1: 244 },
  { text: "AM", x0: 400, y0: 230, x1: 420, y1: 244 }
];

// Test dataset 2: Simulated images.pdf prose text (Single column)
const imagesProseWords = [
  { text: "This", x0: 50, y0: 50, x1: 80, y1: 64 },
  { text: "is", x0: 85, y0: 50, x1: 95, y1: 64 },
  { text: "a", x0: 100, y0: 50, x1: 108, y1: 64 },
  { text: "sample", x0: 113, y0: 50, x1: 155, y1: 64 },
  { text: "article", x0: 160, y0: 50, x1: 195, y1: 64 },
  { text: "paragraph.", x0: 200, y0: 50, x1: 265, y1: 64 },

  { text: "It", x0: 50, y0: 80, x1: 60, y1: 94 },
  { text: "contains", x0: 65, y0: 80, x1: 115, y1: 94 },
  { text: "multiple", x0: 120, y0: 80, x1: 170, y1: 94 },
  { text: "lines", x0: 175, y0: 80, x1: 205, y1: 94 },
  { text: "of", x0: 210, y0: 80, x1: 222, y1: 94 },
  { text: "prose", x0: 227, y0: 80, x1: 260, y1: 94 },
  { text: "text.", x0: 265, y0: 80, x1: 290, y1: 94 }
];

console.log("Testing current/prototype reconstruction on vuWords...");
const vuResult = reconstructTableFromTextNodes(vuWords, { isCanvasCoords: true });
console.log("vuResult:", JSON.stringify(vuResult, null, 2));

console.log("\nTesting current/prototype reconstruction on imagesProseWords...");
const imagesResult = reconstructTableFromTextNodes(imagesProseWords, { isCanvasCoords: true });
console.log("imagesResult:", JSON.stringify(imagesResult, null, 2));
