const env = require('../config/env');

const spamProtection = (req, res, next) => {
  const { website, submissionStartedAt, message } = req.body;
  if (website && website.trim() !== '') {
    return res.json({ success: true, message: 'Your message has been received.' });
  }
  if (submissionStartedAt) {
    const timeDiff = (Date.now() - submissionStartedAt) / 1000;
    if (timeDiff < env.CONTACT_MIN_SUBMISSION_TIME_SECONDS) {
      return res.status(400).json({ success: false, code: 'VALIDATION_ERROR', message: 'Submission too fast. Please try again.' });
    }
  }
  const linkMatches = message.match(/https?:\/\//gi);
  if (linkMatches && linkMatches.length > env.CONTACT_MAX_LINKS) {
    return res.status(400).json({ success: false, code: 'VALIDATION_ERROR', message: 'Too many links in message.' });
  }
  next();
};

module.exports = spamProtection;
