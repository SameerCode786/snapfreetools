module.exports = (req, res, next) => {
  if (process.env.HTML_TO_PDF_ENABLED === 'false') {
    return res.status(503).json({
      success: false,
      code: 'ERR_SERVICE_DISABLED',
      message: 'HTML to PDF conversion service is currently disabled.'
    });
  }
  next();
};
