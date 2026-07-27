const fs = require('fs');
const path = require('path');
const libreOffice = require('../src/services/libreOffice.service');
const { createTempSession, cleanupSession } = require('../src/utils/wordToPdfTempFiles');

async function main() {
  console.log('--- Word to PDF Backend Verification ---');
  const isAvailable = libreOffice.isAvailable();
  console.log(`LibreOffice engine available: ${isAvailable}`);
  
  if (!isAvailable) {
    console.log('Cannot verify conversion because LibreOffice is not found.');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const inputDocx = args[0];
  const keep = args.includes('--keep');

  if (!inputDocx) {
    console.log('Usage: node scripts/verify-word-to-pdf.js <path/to/test.docx> [--keep]');
    process.exit(0);
  }

  if (!fs.existsSync(inputDocx)) {
    console.log(`File not found: ${inputDocx}`);
    process.exit(1);
  }

  console.log('Creating temp session...');
  const session = await createTempSession();
  
  try {
    const inputPath = path.join(session.inputDir, 'test.docx');
    fs.copyFileSync(inputDocx, inputPath);
    console.log('Converting...');
    const pdfPath = await libreOffice.convertToPdf(inputPath, session.outputDir, session.profileDir);
    console.log(`Success! PDF generated at: ${pdfPath}`);
    if (keep) {
      console.log(`Session directory kept at: ${session.sessionDir}`);
    }
  } catch (e) {
    console.error('Conversion Failed:', e);
  } finally {
    if (!keep) {
      await cleanupSession(session.sessionDir);
      console.log('Session directory cleaned up.');
    }
  }
}

main();
