const { contactSchema } = require('../validators/contact.validator');

const validateRequest = (req, res, next) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = {};
    parsed.error.errors.forEach(e => {
      if (e.path.length > 0) errors[e.path[0]] = e.message;
    });
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Please correct the highlighted fields.',
      errors
    });
  }
  req.body = parsed.data;
  next();
};

module.exports = validateRequest;
