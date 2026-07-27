const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const { createTempSession, cleanupSession } = require('../utils/wordToPdfTempFiles');
const { validateDocxStructure } = require('../utils/wordToPdfFileSignature');
const libreOffice = require('../services/libreOffice.service');
const semaphore = require('../utils/wordToPdfSemaphore');

module.exports = {
  convert: async (req, res) => {
    if (!semaphore.acquire()) {
      return res.status(503).json({ success: false, code: 'CONVERSION_CAPACITY_REACHED', message: 'The conversion service is busy. Please try again shortly.' });
    }

    if (!libreOffice.isAvailable()) {
      semaphore.release();
      return res.status(503).json({ success: false, code: 'CONVERSION_ENGINE_UNAVAILABLE', message: 'Word to PDF conversion is temporarily unavailable.' });
    }

    let session = null;
    let streamActive = false;
    
    try {
      // 1. Validate zip structure from memory buffer
      const validation = validateDocxStructure(req.file.buffer);
      if (!validation.valid) {
          semaphore.release();
          return res.status(400).json({ success: false, code: validation.code, message: 'Invalid document structure or unsupported format.' });
      }

      // 2. Create isolated directory
      session = await createTempSession();
      
      // 3. Write buffer to disk
      const inputFilename = crypto.randomUUID() + '.docx'; // strictly UUID, no original filename
      const inputPath = path.join(session.inputDir, inputFilename);
      await fs.writeFile(inputPath, req.file.buffer);

      // 4. Run LibreOffice
      const pdfPath = await libreOffice.convertToPdf(inputPath, session.outputDir, session.profileDir);
      
      const stats = await fs.stat(pdfPath);
      if (stats.size === 0) {
        throw new Error('CONVERSION_FAILED');
      }

      // 5. Build safe filename
      let originalName = req.file.originalname || 'document.docx';
      let downloadName = originalName.replace(/\.docx$/i, '');
      // strict sanitize: alphanumeric, dash, dot, underscore only
      downloadName = downloadName.replace(/[^a-zA-Z0-9_.-]/g, '_');
      if (!downloadName || downloadName === '_') downloadName = 'converted-document';
      downloadName += '.pdf';

      // 6. Set headers and stream
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Conversion-Id', session.sessionId);

      const stream = fsSync.createReadStream(pdfPath);
      streamActive = true;
      stream.pipe(res);
      
      stream.on('end', async () => {
        await cleanupSession(session.sessionDir);
        semaphore.release();
      });
      stream.on('error', async () => {
        await cleanupSession(session.sessionDir);
        semaphore.release();
      });
      res.on('close', async () => {
          if (!stream.destroyed) {
              stream.destroy();
          }
          await cleanupSession(session.sessionDir);
          semaphore.release();
      });
      
    } catch (error) {
      if (!streamActive) semaphore.release();
      if (session) await cleanupSession(session.sessionDir);
      
      if (!res.headersSent) {
          if (error.message === 'CONVERSION_TIMEOUT') {
            return res.status(500).json({ success: false, code: 'CONVERSION_TIMEOUT', message: 'Conversion took too long.' });
          }
          return res.status(500).json({ success: false, code: 'CONVERSION_FAILED', message: 'Failed to convert document.' });
      }
    }
  }
};
