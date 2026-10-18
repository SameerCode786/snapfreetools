const multer = require('multer');
const limits = require('../constants/htmlToPdfLimits');

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: limits.MAX_ZIP_SIZE_BYTES, // Allow up to 25MB max for zip uploads
    files: 1
  }
}).single('file');

module.exports = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  
  if (!contentType.includes('multipart/form-data')) {
    // JSON request pass-through
    return next();
  }

  upload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          code: 'ERR_FILE_TOO_LARGE',
          message: `Uploaded file exceeds maximum size limit of ${limits.MAX_ZIP_SIZE_BYTES / (1024 * 1024)}MB.`
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          code: 'ERR_TOO_MANY_FILES',
          message: 'Only one file upload is permitted per request.'
        });
      }
      return res.status(400).json({
        success: false,
        code: 'ERR_UPLOAD_FAILED',
        message: `File upload failed: ${err.message}`
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        code: 'ERR_INVALID_REQUEST',
        message: 'File field is required for file upload modes.'
      });
    }

    const filename = (req.file.originalname || '').toLowerCase();
    const isZip = filename.endsWith('.zip') || req.body?.mode === 'zip';
    const isHtmlExt = limits.ALLOWED_FILE_EXTENSIONS.some(ext => ext !== '.zip' && filename.endsWith(ext));

    if (!isZip && !isHtmlExt) {
      return res.status(400).json({
        success: false,
        code: 'ERR_UNSUPPORTED_EXTENSION',
        message: 'Only .html, .htm, and .zip files are supported.'
      });
    }

    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({
        success: false,
        code: 'ERR_EMPTY_FILE',
        message: 'Uploaded file is empty.'
      });
    }

    req.body = req.body || {};

    if (isZip) {
      if (!filename.endsWith('.zip')) {
        return res.status(400).json({
          success: false,
          code: 'ERR_UNSUPPORTED_EXTENSION',
          message: 'Only .zip files are supported for ZIP mode.'
        });
      }

      if (req.file.buffer.length > limits.MAX_ZIP_SIZE_BYTES) {
        return res.status(400).json({
          success: false,
          code: 'ERR_ZIP_TOO_LARGE',
          message: `ZIP file exceeds maximum allowed limit of ${limits.MAX_ZIP_SIZE_BYTES / (1024 * 1024)}MB.`
        });
      }

      req.body.mode = 'zip';
      req.file.isZip = true;
    } else {
      if (req.file.buffer.length > limits.MAX_HTML_SIZE_BYTES) {
        return res.status(400).json({
          success: false,
          code: 'ERR_FILE_TOO_LARGE',
          message: `Uploaded HTML file exceeds maximum size limit of ${limits.MAX_FILE_SIZE_MB}MB.`
        });
      }

      req.body.mode = 'html_upload';
      req.body.htmlContent = req.file.buffer.toString('utf-8');
    }

    if (req.body.settings && typeof req.body.settings === 'string') {
      try {
        req.body.settings = JSON.parse(req.body.settings);
      } catch (e) {
        return res.status(400).json({
          success: false,
          code: 'ERR_INVALID_REQUEST',
          message: 'Invalid JSON string provided in settings field.'
        });
      }
    }

    next();
  });
};
