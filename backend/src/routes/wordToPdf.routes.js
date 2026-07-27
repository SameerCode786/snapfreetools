const express = require('express');
const router = express.Router();
const controller = require('../controllers/wordToPdf.controller');
const uploadMiddleware = require('../middleware/wordToPdfUpload.middleware');
const rateLimitMiddleware = require('../middleware/wordToPdfRateLimit');
const securityMiddleware = require('../middleware/wordToPdfSecurity.middleware');

router.post('/', securityMiddleware, rateLimitMiddleware, uploadMiddleware, controller.convert);

module.exports = router;
