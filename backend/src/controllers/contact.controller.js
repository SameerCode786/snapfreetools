const emailService = require('../services/email.service');
const generateReferenceId = require('../utils/referenceId');
const logger = require('../utils/logger');

const handleContactSubmission = async (req, res) => {
  const referenceId = generateReferenceId();
  try {
    await emailService.sendContactEmail(req.body, referenceId);
    res.status(200).json({ success: true, message: 'Your message has been received.', referenceId });
  } catch (err) {
    if (err.message === 'CONTACT_DELIVERY_FAILED') {
      res.status(502).json({ success: false, code: 'CONTACT_DELIVERY_FAILED', message: 'We couldn’t send your message. Please try again later.' });
    } else {
      throw err;
    }
  }
};

module.exports = { handleContactSubmission };
