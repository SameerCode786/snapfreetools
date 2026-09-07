import fs from 'fs';
import path from 'path';
import { PDFDocument, PDFName } from 'pdf-lib';

async function analyzePdfFile(filePath) {
  console.log(`\n=== Analyzing: ${path.basename(filePath)} ===`);
  const buffer = fs.readFileSync(filePath);
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

  const str = buffer.toString('binary');
  const hasEncryptText = str.includes('/Encrypt');

  let isEncryptedPdfLib = false;
  let pdfLibDoc = null;
  let encryptDictDetails = null;

  try {
    pdfLibDoc = await PDFDocument.load(arrayBuffer.slice(0), { ignoreEncryption: true });
    const trailer = pdfLibDoc.context.trailerInfo;
    const encryptRef = trailer?.Encrypt || pdfLibDoc.catalog.get(PDFName.of('Encrypt'));
    if (encryptRef) {
      isEncryptedPdfLib = true;
      const dict = pdfLibDoc.context.lookup(encryptRef);
      if (dict && dict.get) {
        const v = dict.get(PDFName.of('V'))?.numberValue || dict.get(PDFName.of('V'))?.value;
        const r = dict.get(PDFName.of('R'))?.numberValue || dict.get(PDFName.of('R'))?.value;
        const p = dict.get(PDFName.of('P'))?.numberValue || dict.get(PDFName.of('P'))?.value;
        const cfm = dict.get(PDFName.of('CFM'))?.value || dict.get(PDFName.of('CFM'))?.name;
        const filter = dict.get(PDFName.of('Filter'))?.name || dict.get(PDFName.of('Filter'))?.value;
        encryptDictDetails = { v, r, p, cfm, filter };
      }
    }
  } catch (e) {
    console.log('pdf-lib load error:', e.message);
  }

  console.log('Result:', {
    hasEncryptText,
    isEncryptedPdfLib,
    encryptDictDetails
  });
}

async function main() {
  const files = [
    'scratch/test_1_unprotected.pdf',
    'scratch/test_2_aes256.pdf',
    'scratch/test_4_aes128.pdf',
    'scratch/test_5_rc4.pdf',
    'scratch/test_permission_restrictions.pdf',
    'scratch/test_9_corrupted.pdf'
  ];

  for (const f of files) {
    if (fs.existsSync(f)) {
      await analyzePdfFile(f);
    }
  }
}

main();
