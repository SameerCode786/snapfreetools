module.exports = {
  MAX_FILE_SIZE_MB: process.env.WORD_TO_PDF_MAX_FILE_SIZE_MB || 10,
  TIMEOUT_MS: process.env.WORD_TO_PDF_TIMEOUT_MS || 60000,
  RATE_LIMIT_WINDOW: process.env.WORD_TO_PDF_RATE_LIMIT_WINDOW_MINUTES || 15,
  RATE_LIMIT_MAX: process.env.WORD_TO_PDF_RATE_LIMIT_MAX_REQUESTS || 5,
  MAX_CONCURRENT: process.env.WORD_TO_PDF_MAX_CONCURRENT_CONVERSIONS || 2,
  ALLOWED_EXTENSIONS: ['.docx'],
  ALLOWED_MIME: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};
