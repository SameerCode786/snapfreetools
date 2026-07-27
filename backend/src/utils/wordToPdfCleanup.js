const fs = require('fs/promises');
const path = require('path');
const os = require('os');

const getBaseTempDir = () => process.env.WORD_TO_PDF_TEMP_DIR || path.join(os.tmpdir(), 'snapfreetools-word-to-pdf');

let sweeperInterval = null;

module.exports = {
  startSweeper: () => {
    if (sweeperInterval) return;
    // Run every hour
    sweeperInterval = setInterval(async () => {
      try {
        const baseDir = getBaseTempDir();
        let entries = [];
        try {
            entries = await fs.readdir(baseDir, { withFileTypes: true });
        } catch(e) {
            return; // dir doesn't exist yet
        }
        
        const now = Date.now();
        let deleted = 0;
        
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const dirPath = path.join(baseDir, entry.name);
            try {
                const stats = await fs.stat(dirPath);
                const ageMs = now - stats.mtimeMs;
                if (ageMs > 30 * 60 * 1000) { // Older than 30 minutes
                  await fs.rm(dirPath, { recursive: true, force: true });
                  deleted++;
                }
            } catch(e) {} // ignore stat/rm errors
          }
        }
      } catch (err) {
          console.error('[WordToPdf] Error sweeping orphan temp files:', err);
      }
    }, 60 * 60 * 1000);
    
    // Unref so it doesn't block node process exit
    sweeperInterval.unref();
  },
  stopSweeper: () => {
    if (sweeperInterval) {
        clearInterval(sweeperInterval);
        sweeperInterval = null;
    }
  }
};
