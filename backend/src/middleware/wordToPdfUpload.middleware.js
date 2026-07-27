const multer = require('multer');
const limits = require('../constants/wordToPdfLimits');

// Use memory storage for initial validation before touching disk
const storage = multer.memoryStorage(); 

const upload = multer({
  storage: storage,
  limits: {
    fileSize: limits.MAX_FILE_SIZE_MB * 1024 * 1024,
    files: 1
  }
});

module.exports = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
         return res.status(400).json({ success: false, code: 'FILE_TOO_LARGE', message: `File exceeds maximum size of ${limits.MAX_FILE_SIZE_MB}MB.` });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
         return res.status(400).json({ success: false, code: 'TOO_MANY_FILES', message: 'Only one file allowed.' });
      }
      return res.status(400).json({ success: false, code: 'UPLOAD_ERROR', message: 'Error uploading file.' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, code: 'FILE_REQUIRED', message: 'A file is required.' });
    }
    
    // Check extension
    if (!req.file.originalname.toLowerCase().endsWith('.docx')) {
       return res.status(400).json({ success: false, code: 'UNSUPPORTED_EXTENSION', message: 'Only DOCX files are supported.' });
    }
    
    // We allow generic mimes (octet-stream) if extension is right, but signature will fail it later if it's not a real docx.
    next();
  });
};
