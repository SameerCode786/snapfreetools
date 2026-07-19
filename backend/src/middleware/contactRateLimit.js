const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const contactRateLimit = rateLimit({
  windowMs: env.CONTACT_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: env.CONTACT_RATE_LIMIT_MAX_REQUESTS,
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many messages were submitted. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = contactRateLimit;
