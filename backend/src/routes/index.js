const express = require('express');
const router = express.Router();

const contactRoutes = require('./contact.routes');

const env = require('../config/env');

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'SnapFreeTools Contact API',
    status: 'healthy',
    mailConfigured: !!(env.SMTP_USER && env.SMTP_APP_PASSWORD)
  });
});

router.use('/contact', contactRoutes);

module.exports = router;
