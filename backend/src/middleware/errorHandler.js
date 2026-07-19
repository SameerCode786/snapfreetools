const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled Error', { error: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, code: 'FORBIDDEN', message: 'CORS policy violation' });
  }
  res.status(500).json({ success: false, code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong. Please try again later.' });
};

module.exports = errorHandler;
