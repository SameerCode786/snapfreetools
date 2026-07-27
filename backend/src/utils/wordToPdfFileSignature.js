const AdmZip = require('adm-zip');

module.exports = {
  validateDocxStructure: (buffer) => {
    try {
      // Basic magic number check for ZIP
      if (buffer.length < 4 || buffer[0] !== 0x50 || buffer[1] !== 0x4B || buffer[2] !== 0x03 || buffer[3] !== 0x04) {
        return { valid: false, code: 'INVALID_DOCX_SIGNATURE' };
      }

      const zip = new AdmZip(buffer);
      const zipEntries = zip.getEntries();
      
      let hasContentTypes = false;
      let hasWordDocument = false;
      let totalUncompressedSize = 0;

      // Limit entries to prevent zip bomb
      if (zipEntries.length > 10000) {
        return { valid: false, code: 'ZIP_BOMB_DETECTED' };
      }

      for (const entry of zipEntries) {
        totalUncompressedSize += entry.header.size;
        // Limit uncompressed size to 100MB
        if (totalUncompressedSize > 100 * 1024 * 1024) {
           return { valid: false, code: 'ZIP_BOMB_DETECTED' };
        }
        
        const entryName = entry.entryName.toLowerCase();
        if (entryName.includes('../') || entryName.startsWith('/') || entryName.match(/^[a-z]:/i)) {
           return { valid: false, code: 'DOCX_STRUCTURE_INVALID' }; // Path traversal
        }

        if (entryName === '[content_types].xml') hasContentTypes = true;
        if (entryName === 'word/document.xml') hasWordDocument = true;
        if (entryName.endsWith('.bin') && entryName.includes('vba')) {
           return { valid: false, code: 'MACRO_DOCUMENT_NOT_SUPPORTED' };
        }
      }

      if (!hasContentTypes || !hasWordDocument) {
         return { valid: false, code: 'DOCX_STRUCTURE_INVALID' };
      }

      return { valid: true };
    } catch (e) {
      if (e.message && e.message.includes('encrypted')) {
          return { valid: false, code: 'ENCRYPTED_DOCUMENT' };
      }
      return { valid: false, code: 'CORRUPTED_DOCX' };
    }
  }
};
