const express = require('express');
const router = express.Router();
const contactRoutes = require('./contact.routes');

router.get('/health', (req, res) => {
  res.json({ success: true, service: 'SnapFreeTools Contact API', status: 'ok' });
});

router.use('/contact', contactRoutes);

module.exports = router;
