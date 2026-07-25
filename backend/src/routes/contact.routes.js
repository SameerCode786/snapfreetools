const express = require('express');
const router = express.Router();

const { submitContact } = require('../controllers/contact.controller');
const validateRequest = require('../middleware/validateRequest');
const spamProtection = require('../middleware/spamProtection');
const contactRateLimit = require('../middleware/contactRateLimit');
const asyncHandler = require('../utils/asyncHandler');

router.post(
  '/',
  contactRateLimit,
  spamProtection,
  validateRequest,
  asyncHandler(submitContact)
);

module.exports = router;
