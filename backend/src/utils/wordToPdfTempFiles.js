const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const getBaseTempDir = () => process.env.WORD_TO_PDF_TEMP_DIR || path.join(os.tmpdir(), 'snapfreetools-word-to-pdf');

module.exports = {
  createTempSession: async () => {
    // using crypto.randomUUID()
    const sessionId = crypto.randomUUID();
    const base = getBaseTempDir();
    const sessionDir = path.join(base, sessionId);
    const inputDir = path.join(sessionDir, 'input');
    const outputDir = path.join(sessionDir, 'output');
    const profileDir = path.join(sessionDir, 'profile');

    await fs.mkdir(inputDir, { recursive: true, mode: 0o700 });
    await fs.mkdir(outputDir, { recursive: true, mode: 0o700 });
    await fs.mkdir(profileDir, { recursive: true, mode: 0o700 });

    return { sessionId, sessionDir, inputDir, outputDir, profileDir };
  },
  cleanupSession: async (sessionDir) => {
    try {
      if (sessionDir) {
        await fs.rm(sessionDir, { recursive: true, force: true });
      }
    } catch (e) {
      console.error('Failed to cleanup session dir:', sessionDir, e);
    }
  }
};
