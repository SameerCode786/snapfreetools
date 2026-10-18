const rateLimit = require('express-rate-limit');
const limits = require('../constants/htmlToPdfLimits');

module.exports = rateLimit({
  windowMs: limits.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: limits.RATE_LIMIT_MAX_REQUESTS,
  skip: () => process.env.NODE_ENV === 'test',
  message: {
    success: false,
    code: 'ERR_RATE_LIMITED',
    message: `Too many conversion requests. Maximum allowed is ${limits.RATE_LIMIT_MAX_REQUESTS} per ${limits.RATE_LIMIT_WINDOW_MINUTES} minutes.`
  },
  standardHeaders: true,
  legacyHeaders: false
});
