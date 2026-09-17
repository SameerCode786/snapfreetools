import { reconstructTableFromTextNodes } from './robust_engine.js';

console.log("=== TEST MATRIX: REALISTIC SCANNED TABLE TYPES ===");

// 1. Bank Statement
const bankStatementWords = [
  { str: "Date", x0: 50, y0: 100, x1: 80, y1: 112 },
  { str: "Description", x0: 120, y0: 100, x1: 180, y1: 112 },
  { str: "Debit", x0: 250, y0: 100, x1: 280, y1: 112 },
  { str: "Credit", x0: 320, y0: 100, x1: 350, y1: 112 },
  { str: "Balance", x0: 400, y0: 100, x1: 440, y1: 112 },

  { str: "01/10/2026", x0: 50, y0: 125, x1: 105, y1: 137 },
  { str: "Payroll", x0: 120, y0: 125, x1: 160, y1: 137 },
  { str: "Direct", x0: 165, y0: 125, x1: 195, y1: 137 },
  { str: "Dep", x0: 200, y0: 125, x1: 220, y1: 137 },
  { str: "5,000.00", x0: 320, y0: 125, x1: 365, y1: 137 },
  { str: "8,450.00", x0: 400, y0: 125, x1: 445, y1: 137 },

  { str: "02/10/2026", x0: 50, y0: 150, x1: 105, y1: 162 },
  { str: "Electric", x0: 120, y0: 150, x1: 160, y1: 162 },
  { str: "Utility", x0: 165, y0: 150, x1: 195, y1: 162 },
  { str: "Bill", x0: 200, y0: 150, x1: 220, y1: 162 },
  { str: "150.00", x0: 250, y0: 150, x1: 285, y1: 162 },
  { str: "8,300.00", x0: 400, y0: 150, x1: 445, y1: 162 },

  { str: "05/10/2026", x0: 50, y0: 175, x1: 105, y1: 187 },
  { str: "Office", x0: 120, y0: 175, x1: 155, y1: 187 },
  { str: "Supplies", x0: 160, y0: 175, x1: 205, y1: 187 },
  { str: "Store", x0: 210, y0: 175, x1: 235, y1: 187 },
  { str: "85.50", x0: 250, y0: 175, x1: 280, y1: 187 },
  { str: "8,214.50", x0: 400, y0: 175, x1: 445, y1: 187 }
];

const bankResult = reconstructTableFromTextNodes(bankStatementWords, { isCanvasCoords: true });
console.log("\n1. Bank Statement (5 columns, 4 rows):");
console.log(JSON.stringify(bankResult, null, 2));

// 2. Invoice with 4 columns
const invoiceWords = [
  { str: "Item", x0: 80, y0: 190, x1: 105, y1: 200 },
  { str: "Qty", x0: 200, y0: 190, x1: 220, y1: 200 },
  { str: "Price", x0: 250, y0: 190, x1: 275, y1: 200 },
  { str: "Total", x0: 320, y0: 190, x1: 345, y1: 200 },

  { str: "Carbon", x0: 80, y0: 210, x1: 115, y1: 220 },
  { str: "paper,", x0: 120, y0: 210, x1: 150, y1: 220 },
  { str: "blue", x0: 155, y0: 210, x1: 175, y1: 220 },
  { str: "12", x0: 200, y0: 210, x1: 212, y1: 220 },
  { str: "$4.50", x0: 250, y0: 210, x1: 275, y1: 220 },
  { str: "$54.00", x0: 320, y0: 210, x1: 350, y1: 220 },

  { str: "File", x0: 80, y0: 225, x1: 100, y1: 235 },
  { str: "folders", x0: 105, y0: 225, x1: 140, y1: 235 },
  { str: "50", x0: 200, y0: 225, x1: 212, y1: 235 },
  { str: "$0.42", x0: 250, y0: 225, x1: 275, y1: 235 },
  { str: "$21.00", x0: 320, y0: 225, x1: 350, y1: 235 }
];

const invoiceResult = reconstructTableFromTextNodes(invoiceWords, { isCanvasCoords: true });
console.log("\n2. Invoice Table (4 columns, 3 rows):");
console.log(JSON.stringify(invoiceResult, null, 2));

// 3. Financial Report: Account | Jan | Feb | Mar | Total
const finWords = [
  { str: "Account", x0: 40, y0: 50, x1: 90, y1: 62 },
  { str: "Jan", x0: 140, y0: 50, x1: 160, y1: 62 },
  { str: "Feb", x0: 210, y0: 50, x1: 230, y1: 62 },
  { str: "Mar", x0: 280, y0: 50, x1: 300, y1: 62 },
  { str: "Total", x0: 350, y0: 50, x1: 380, y1: 62 },

  { str: "Revenue", x0: 40, y0: 75, x1: 85, y1: 87 },
  { str: "12,400", x0: 140, y0: 75, x1: 175, y1: 87 },
  { str: "14,200", x0: 210, y0: 75, x1: 245, y1: 87 },
  { str: "15,800", x0: 280, y0: 75, x1: 315, y1: 87 },
  { str: "42,400", x0: 350, y0: 75, x1: 385, y1: 87 }
];

const finResult = reconstructTableFromTextNodes(finWords, { isCanvasCoords: true });
console.log("\n3. Financial Report (5 columns, 2 rows):");
console.log(JSON.stringify(finResult, null, 2));

if (bankResult && bankResult.length === 4 && invoiceResult && invoiceResult.length === 3 && finResult && finResult.length === 2) {
  console.log("\nALL SCANNED TABLE TYPES SUCCESSFULLY RECONSTRUCTED!");
} else {
  console.error("\nTEST FAILED");
  process.exit(1);
}
