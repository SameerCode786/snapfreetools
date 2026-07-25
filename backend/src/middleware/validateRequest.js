const contactSchema = require('../validators/contact.validator');

const validateRequest = (req, res, next) => {
  try {
    const validatedData = contactSchema.parse(req.body);
    req.validatedBody = validatedData;
    next();
  } catch (err) {
    const errors = {};
    err.errors.forEach((e) => {
      errors[e.path[0]] = e.message;
    });
    
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Please check the highlighted fields.',
      errors
    });
  }
};

module.exports = validateRequest;
