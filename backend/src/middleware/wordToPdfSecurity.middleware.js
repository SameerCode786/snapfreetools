module.exports = (req, res, next) => {
  if (process.env.WORD_TO_PDF_ENABLED !== 'true') {
    return res.status(503).json({
      success: false,
      code: 'WORD_TO_PDF_DISABLED',
      message: 'Word to PDF conversion is not available yet.'
    });
  }
  next();
};
