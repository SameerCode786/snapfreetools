const express = require('express');
const router = express.Router();
const contactRateLimit = require('../middleware/contactRateLimit');
const validateRequest = require('../middleware/validateRequest');
const spamProtection = require('../middleware/spamProtection');
const { handleContactSubmission } = require('../controllers/contact.controller');
const asyncHandler = require('../utils/asyncHandler');

router.post('/', contactRateLimit, validateRequest, spamProtection, asyncHandler(handleContactSubmission));

module.exports = router;
