const express = require('express');
const router = express.Router();

const contactRoutes = require('./contact.routes');
const wordToPdfRoutes = require('./wordToPdf.routes');

const env = require('../config/env');
const libreOffice = require('../services/libreOffice.service');
const { isDatabaseConnected } = require('../config/database');
const { storageService } = require('../services/storage');

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'SnapFreeTools API',
    status: 'healthy',
    database: {
      configured: Boolean(env.MONGODB_URI),
      connected: isDatabaseConnected()
    },
    storage: {
      driver: storageService.getDriverName()
    },
    mailConfigured: !!(env.SMTP_USER && env.SMTP_APP_PASSWORD),
    wordToPdf: {
      enabled: process.env.WORD_TO_PDF_ENABLED === 'true',
      engineAvailable: libreOffice.isAvailable()
    }
  });
});

router.use('/contact', contactRoutes);
router.use('/convert/word-to-pdf', wordToPdfRoutes);

module.exports = router;
