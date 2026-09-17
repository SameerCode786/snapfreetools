import fs from 'fs';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { reconstructTableFromTextNodes } from '../src/features/pdf-to-excel/utils/pdfToExcelEngine.js';

async function testScannedPdf() {
  const pdfBytes = new Uint8Array(fs.readFileSync('./sample-scanned.pdf'));
  const doc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
  console.log('PDF loaded, num pages:', doc.numPages);

  const page = await doc.getPage(1);
  const textContent = await page.getTextContent();
  console.log('Page 1 native text items count:', textContent.items.length);

  // Render to canvas or use node-canvas / tesseract
  const worker = await createWorker('eng', 1, {
    workerPath: './public/ocr/worker.min.js',
    corePath: './public/ocr/tesseract-core-lstm.wasm.js',
    langPath: './public/ocr/',
  });

  // Let's test with tesseract recognize on image or rendering
  console.log('Worker initialized successfully.');
}

testScannedPdf().catch(console.error);
