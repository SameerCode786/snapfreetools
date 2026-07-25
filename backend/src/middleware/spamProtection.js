const spamProtection = (req, res, next) => {
  if (req.body._contact_identifier) {
    // Honeypot triggered
    return res.status(400).json({
      success: false,
      code: 'SPAM_DETECTED',
      message: 'Unable to process this request.'
    });
  }
  
  // Basic content checks
  const { message } = req.body;
  if (message && typeof message === 'string') {
    // Check for extremely repetitive characters
    const uniqueChars = new Set(message.replace(/\s/g, '').split('')).size;
    if (message.length > 20 && uniqueChars < 3) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message content.'
      });
    }
  }

  next();
};

module.exports = spamProtection;
