import { reconstructTableFromTextNodes } from '../src/features/pdf-to-excel/utils/pdfToExcelEngine.js';

const invoiceOcrWords = [
  // Header
  { str: "Item", x: 80, y: 190, width: 25, height: 10, confidence: 95 },
  { str: "Qty", x: 175, y: 190.5, width: 20, height: 10, confidence: 94 },
  { str: "Unit", x: 200, y: 189.8, width: 22, height: 10, confidence: 92 },
  { str: "Total", x: 235, y: 190.2, width: 25, height: 10, confidence: 96 },

  // Row 1
  { str: "Carbon", x: 80, y: 210, width: 35, height: 10, confidence: 90 },
  { str: "paper,", x: 118, y: 210.8, width: 30, height: 10, confidence: 91 },
  { str: "blue,", x: 151, y: 211.2, width: 25, height: 10, confidence: 89 },
  { str: "8.5x11", x: 179, y: 209.5, width: 30, height: 10, confidence: 88 },
  { str: "12", x: 220, y: 210, width: 12, height: 10, confidence: 95 },
  { str: "$4.50", x: 245, y: 210.3, width: 25, height: 10, confidence: 96 },
  { str: "$54.00", x: 280, y: 209.8, width: 30, height: 10, confidence: 97 },

  // Row 2
  { str: "File", x: 80, y: 225, width: 20, height: 10, confidence: 92 },
  { str: "folders,", x: 103, y: 225.5, width: 35, height: 10, confidence: 90 },
  { str: "manila,", x: 141, y: 224.8, width: 35, height: 10, confidence: 89 },
  { str: "letter", x: 179, y: 225.2, width: 25, height: 10, confidence: 93 },
  { str: "50", x: 220, y: 225, width: 12, height: 10, confidence: 96 },
  { str: "$0.42", x: 245, y: 225.1, width: 25, height: 10, confidence: 94 },
  { str: "$21.00", x: 280, y: 224.9, width: 30, height: 10, confidence: 98 },

  // Row 3
  { str: "Pencil,", x: 80, y: 240, width: 35, height: 10, confidence: 91 },
  { str: "#2,", x: 118, y: 240.2, width: 15, height: 10, confidence: 85 },
  { str: "dozen", x: 136, y: 239.7, width: 30, height: 10, confidence: 93 },
  { str: "20", x: 220, y: 240, width: 12, height: 10, confidence: 97 },
  { str: "$1.10", x: 245, y: 240.4, width: 25, height: 10, confidence: 95 },
  { str: "$22.00", x: 280, y: 239.9, width: 30, height: 10, confidence: 96 },

  // Row 4
  { str: "Stapler,", x: 80, y: 255, width: 40, height: 10, confidence: 93 },
  { str: "heavy", x: 123, y: 255.4, width: 30, height: 10, confidence: 90 },
  { str: "duty", x: 156, y: 254.8, width: 22, height: 10, confidence: 92 },
  { str: "1", x: 220, y: 255, width: 8, height: 10, confidence: 98 },
  { str: "$19.95", x: 245, y: 255.2, width: 30, height: 10, confidence: 94 },
  { str: "$19.95", x: 280, y: 255.1, width: 30, height: 10, confidence: 95 },

  // Row 5
  { str: "Tape,", x: 80, y: 270, width: 30, height: 10, confidence: 90 },
  { str: "masking,", x: 113, y: 270.5, width: 45, height: 10, confidence: 89 },
  { str: "60", x: 161, y: 269.8, width: 12, height: 10, confidence: 95 },
  { str: "yd", x: 176, y: 270.2, width: 12, height: 10, confidence: 92 },
  { str: "6", x: 220, y: 270, width: 8, height: 10, confidence: 97 },
  { str: "$2.10", x: 245, y: 270.3, width: 25, height: 10, confidence: 96 },
  { str: "$12.60", x: 280, y: 269.9, width: 30, height: 10, confidence: 97 },

  // Subtotal
  { str: "Subtotal:", x: 160, y: 300, width: 45, height: 10, confidence: 94 },
  { str: "$129.55", x: 280, y: 300.2, width: 35, height: 10, confidence: 98 },

  // Tax
  { str: "Tax", x: 160, y: 315, width: 20, height: 10, confidence: 92 },
  { str: "(6.25%):", x: 183, y: 315.4, width: 40, height: 10, confidence: 90 },
  { str: "$8.10", x: 280, y: 315.1, width: 25, height: 10, confidence: 96 },

  // TOTAL
  { str: "TOTAL:", x: 160, y: 330, width: 40, height: 10, confidence: 95 },
  { str: "$137.65", x: 280, y: 330.3, width: 35, height: 10, confidence: 99 }
];

const result = reconstructTableFromTextNodes(invoiceOcrWords, {
  isCanvasCoords: true,
  yTolerance: 8,
  colTolerance: 18
});

console.log("Result rows count:", result ? result.length : 0);
console.log("Result table:", JSON.stringify(result, null, 2));
