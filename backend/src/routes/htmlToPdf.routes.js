const express = require('express');
const router = express.Router();
const controller = require('../controllers/htmlToPdf.controller');
const uploadMiddleware = require('../middleware/htmlToPdfUpload.middleware');
const rateLimitMiddleware = require('../middleware/htmlToPdfRateLimit');
const securityMiddleware = require('../middleware/htmlToPdfSecurity.middleware');

router.post('/', securityMiddleware, rateLimitMiddleware, uploadMiddleware, controller.convert);

module.exports = router;
