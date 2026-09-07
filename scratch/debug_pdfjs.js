import fs from 'fs';
import crypto from 'crypto';
if (!global.crypto) global.crypto = crypto.webcrypto || crypto;
if (!global.DOMMatrix) global.DOMMatrix = class DOMMatrix {};

async function debug() {
  const pdfjsModule = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const pdfjs = pdfjsModule.default || pdfjsModule;
  const buf = fs.readFileSync('scratch/test_1_unprotected.pdf');
  
  try {
    const doc = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;
    console.log('Doc numPages:', doc.numPages);
  } catch (err) {
    console.log('PDFJS ERROR name:', err.name, 'msg:', err.message, 'stack:', err.stack);
  }
}
debug();
