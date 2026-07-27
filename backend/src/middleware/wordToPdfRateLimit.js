const rateLimit = require('express-rate-limit');
const limits = require('../constants/wordToPdfLimits');

module.exports = rateLimit({
  windowMs: limits.RATE_LIMIT_WINDOW * 60 * 1000,
  max: limits.RATE_LIMIT_MAX,
  message: {
    success: false,
    code: 'RATE_LIMITED',
    message: 'Too many conversion requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
