const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const limits = require('../constants/wordToPdfLimits');

const getLibreOfficePath = () => {
  if (process.env.LIBREOFFICE_PATH) return process.env.LIBREOFFICE_PATH;
  if (process.platform === 'win32') {
    const paths = [
      'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
      'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe'
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) return p;
    }
  } else if (process.platform === 'linux') {
    return '/usr/bin/libreoffice'; // default linux
  } else if (process.platform === 'darwin') {
    return '/Applications/LibreOffice.app/Contents/MacOS/soffice';
  }
  return null;
};

module.exports = {
  isAvailable: () => {
    const bin = getLibreOfficePath();
    return bin && fs.existsSync(bin);
  },
  convertToPdf: (inputPath, outputDir, profileDir) => {
    return new Promise((resolve, reject) => {
      const bin = getLibreOfficePath();
      if (!bin) return reject(new Error('CONVERSION_ENGINE_UNAVAILABLE'));

      const args = [
        '--headless',
        '--nologo',
        '--nodefault',
        '--nolockcheck',
        '--nofirststartwizard',
        '--norestore',
        `-env:UserInstallation=file://${profileDir.replace(/\\/g, '/')}`,
        '--convert-to', 'pdf',
        '--outdir', outputDir,
        inputPath
      ];

      const child = execFile(bin, args, { timeout: limits.TIMEOUT_MS }, (error, stdout, stderr) => {
        if (error) {
          if (error.killed) {
            return reject(new Error('CONVERSION_TIMEOUT'));
          }
          return reject(new Error('CONVERSION_FAILED'));
        }
        
        const files = fs.readdirSync(outputDir);
        const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));
        if (!pdfFile) return reject(new Error('CONVERSION_FAILED'));
        
        resolve(path.join(outputDir, pdfFile));
      });
    });
  }
};
