const { sendContactNotification, sendAutoReply } = require('../services/email.service');
const generateReferenceId = require('../utils/referenceId');
const { sanitizeText } = require('../utils/sanitize');
const logger = require('../utils/logger');

const submitContact = async (req, res) => {
  const { name, email, category, subject, message } = req.validatedBody;
  
  const referenceId = generateReferenceId();
  
  const sanitizedData = {
    referenceId,
    name: sanitizeText(name),
    email, // email is already validated by zod
    category,
    subject: sanitizeText(subject),
    message: sanitizeText(message)
  };

  try {
    await sendContactNotification(sanitizedData);
    
    // Auto-reply is optional and non-blocking
    await sendAutoReply(email, referenceId);
    
    return res.status(200).json({
      success: true,
      message: 'Your message was sent successfully.',
      referenceId
    });
  } catch (error) {
    logger.error('Contact submission failed at email service', { error: error.message, referenceId });
    
    const responsePayload = {
      success: false,
      message: 'Message delivery is temporarily unavailable. Please try again later or email us directly.'
    };

    if (process.env.NODE_ENV === 'development') {
      responsePayload.devError = error.message;
      responsePayload.devCode = error.code;
    }

    return res.status(503).json(responsePayload);
  }
};

module.exports = { submitContact };
