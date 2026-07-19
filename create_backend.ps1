Set-Content -Path "backend/src/constants/contactCategories.js" -Value "const CATEGORY_ALLOWLIST = ['general', 'bug-report', 'feature-request', 'tool-suggestion', 'advertising', 'partnership', 'privacy', 'legal', 'accessibility', 'other'];
const CATEGORY_LABELS = {
  'general': 'General Question',
  'bug-report': 'Bug Report',
  'feature-request': 'Feature Request',
  'tool-suggestion': 'Tool Suggestion',
  'advertising': 'Advertising Inquiry',
  'partnership': 'Partnership Inquiry',
  'privacy': 'Privacy Question',
  'legal': 'Copyright or Legal',
  'accessibility': 'Accessibility Feedback',
  'other': 'Other'
};
module.exports = { CATEGORY_ALLOWLIST, CATEGORY_LABELS };"

Set-Content -Path "backend/src/config/env.js" -Value "require('dotenv').config();
const { z } = require('zod');
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).refine(n => !isNaN(n) && n > 0 && n < 65536, 'Invalid PORT'),
  FRONTEND_ORIGIN: z.string().url('FRONTEND_ORIGIN must be a valid URL'),
  CONTACT_RECEIVER_EMAIL: z.string().email(),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string().transform(Number),
  SMTP_SECURE: z.string().transform(v => v === 'true'),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM_NAME: z.string().min(1),
  SMTP_FROM_EMAIL: z.string().email(),
  CONTACT_RATE_LIMIT_WINDOW_MINUTES: z.string().transform(Number).default('15'),
  CONTACT_RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('5'),
  CONTACT_AUTO_REPLY_ENABLED: z.string().transform(v => v === 'true').default('false'),
  CONTACT_MIN_SUBMISSION_TIME_SECONDS: z.string().transform(Number).default('3'),
  CONTACT_MAX_LINKS: z.string().transform(Number).default('3')
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}
if (parsed.data.NODE_ENV === 'production' && parsed.data.SMTP_PASS.includes('your-google')) {
  console.error('Cannot use placeholder SMTP credentials in production.');
  process.exit(1);
}
const envConfig = Object.freeze(parsed.data);
module.exports = envConfig;"

Set-Content -Path "backend/src/utils/logger.js" -Value "const env = require('../config/env');
const logger = {
  info: (msg, meta = {}) => { console.log(JSON.stringify({ level: 'info', timestamp: new Date().toISOString(), message: msg, ...meta })); },
  warn: (msg, meta = {}) => { console.warn(JSON.stringify({ level: 'warn', timestamp: new Date().toISOString(), message: msg, ...meta })); },
  error: (msg, meta = {}) => { console.error(JSON.stringify({ level: 'error', timestamp: new Date().toISOString(), message: msg, ...meta })); }
};
module.exports = logger;"

Set-Content -Path "backend/src/config/mail.js" -Value "const nodemailer = require('nodemailer');
const env = require('./env');
const logger = require('../utils/logger');
let transporter = null;
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
    });
  }
  return transporter;
};
module.exports = { getTransporter };"

Set-Content -Path "backend/src/config/cors.js" -Value "const env = require('./env');
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin === env.FRONTEND_ORIGIN) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};
module.exports = corsOptions;"

Set-Content -Path "backend/src/validators/contact.validator.js" -Value "const { z } = require('zod');
const { CATEGORY_ALLOWLIST } = require('../constants/contactCategories');
const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(80, 'Name is too long.').refine(v => !/^[^a-zA-Z]*$/.test(v), 'Please enter a valid name.'),
  email: z.string().trim().max(254, 'Email is too long.').email('Enter a valid email address.'),
  subject: z.string().trim().min(5, 'Subject must be at least 5 characters.').max(120, 'Subject is too long.').refine(v => !/^[^\\w]+$/.test(v), 'Please enter a valid subject.'),
  category: z.enum(CATEGORY_ALLOWLIST, { errorMap: () => ({ message: 'Choose a contact category.' }) }),
  message: z.string().trim().min(20, 'Message must be at least 20 characters.').max(2000, 'Message is too long.').refine(v => !/^(.)\\1+$/.test(v), 'Please enter a meaningful message.'),
  privacyAccepted: z.literal(true, { errorMap: () => ({ message: 'Please review and accept the Privacy Policy acknowledgement.' }) }),
  website: z.string().optional(),
  submissionStartedAt: z.number().optional()
}).strict();
module.exports = { contactSchema };"

Set-Content -Path "backend/src/middleware/validateRequest.js" -Value "const { contactSchema } = require('../validators/contact.validator');
const validateRequest = (req, res, next) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = {};
    parsed.error.errors.forEach(e => { if (e.path.length > 0) errors[e.path[0]] = e.message; });
    return res.status(400).json({ success: false, code: 'VALIDATION_ERROR', message: 'Please correct the highlighted fields.', errors });
  }
  req.body = parsed.data;
  next();
};
module.exports = validateRequest;"

Set-Content -Path "backend/src/middleware/spamProtection.js" -Value "const env = require('../config/env');
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
  const linkMatches = message.match(/https?:\\/\\//gi);
  if (linkMatches && linkMatches.length > env.CONTACT_MAX_LINKS) {
    return res.status(400).json({ success: false, code: 'VALIDATION_ERROR', message: 'Too many links in message.' });
  }
  next();
};
module.exports = spamProtection;"

Set-Content -Path "backend/src/middleware/contactRateLimit.js" -Value "const rateLimit = require('express-rate-limit');
const env = require('../config/env');
const contactRateLimit = rateLimit({
  windowMs: env.CONTACT_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: env.CONTACT_RATE_LIMIT_MAX_REQUESTS,
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many messages were submitted. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
module.exports = contactRateLimit;"

Set-Content -Path "backend/src/middleware/errorHandler.js" -Value "const logger = require('../utils/logger');
const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled Error', { error: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, code: 'FORBIDDEN', message: 'CORS policy violation' });
  }
  res.status(500).json({ success: false, code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong. Please try again later.' });
};
module.exports = errorHandler;"

Set-Content -Path "backend/src/middleware/notFound.js" -Value "const notFound = (req, res) => {
  res.status(404).json({ success: false, code: 'NOT_FOUND', message: 'Endpoint not found.' });
};
module.exports = notFound;"

Set-Content -Path "backend/src/utils/sanitize.js" -Value "const sanitizeHtml = require('sanitize-html');
const escapeHTML = (str) => {
  return str.replace(/[&<>'\"/]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', \"'\": '&#39;', '\"': '&quot;', '/': '&#x2F;' }[tag]));
};
const normalizeText = (str) => {
  return str.replace(/\\r\\n/g, '\\n').trim();
};
module.exports = { escapeHTML, normalizeText };"

Set-Content -Path "backend/src/utils/referenceId.js" -Value "const crypto = require('crypto');
const generateReferenceId = () => {
  const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `CNT-${dateStr}-${suffix}`;
};
module.exports = generateReferenceId;"

Set-Content -Path "backend/src/utils/asyncHandler.js" -Value "const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
module.exports = asyncHandler;"

Set-Content -Path "backend/src/templates/contactNotification.template.js" -Value "const { escapeHTML } = require('../utils/sanitize');
const getNotificationHtml = (data, referenceId, categoryLabel, submissionTime) => `
<!DOCTYPE html>
<html>
<head><style>
  body { font-family: Arial, sans-serif; background-color: #ffffff; color: #333333; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
  h2 { color: #0f172a; margin-top: 0; }
  .row { margin-bottom: 10px; }
  .label { font-weight: bold; color: #10b981; }
  pre { background-color: #f8fafc; padding: 15px; border-radius: 4px; white-space: pre-wrap; font-family: inherit; }
</style></head>
<body>
  <div class=\"container\">
    <h2>New Contact Submission</h2>
    <div class=\"row\"><span class=\"label\">Reference ID:</span> ${escapeHTML(referenceId)}</div>
    <div class=\"row\"><span class=\"label\">Name:</span> ${escapeHTML(data.name)}</div>
    <div class=\"row\"><span class=\"label\">Email:</span> <a href=\"mailto:${escapeHTML(data.email)}\">${escapeHTML(data.email)}</a></div>
    <div class=\"row\"><span class=\"label\">Category:</span> ${escapeHTML(categoryLabel)}</div>
    <div class=\"row\"><span class=\"label\">Subject:</span> ${escapeHTML(data.subject)}</div>
    <div class=\"row\"><span class=\"label\">Time:</span> ${submissionTime}</div>
    <div class=\"row\"><span class=\"label\">Privacy Accepted:</span> Yes</div>
    <div class=\"row\"><span class=\"label\">Message:</span></div>
    <pre>${escapeHTML(data.message)}</pre>
  </div>
</body>
</html>`;
const getNotificationText = (data, referenceId, categoryLabel, submissionTime) => `
New Contact Submission
Reference ID: ${referenceId}
Name: ${data.name}
Email: ${data.email}
Category: ${categoryLabel}
Subject: ${data.subject}
Time: ${submissionTime}
Privacy Accepted: Yes

Message:
${data.message}
`;
module.exports = { getNotificationHtml, getNotificationText };"

Set-Content -Path "backend/src/templates/contactAutoReply.template.js" -Value "const { escapeHTML } = require('../utils/sanitize');
const getAutoReplyHtml = (data, referenceId, categoryLabel) => `
<!DOCTYPE html>
<html>
<head><style>
  body { font-family: Arial, sans-serif; background-color: #ffffff; color: #333333; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
  h2 { color: #0f172a; margin-top: 0; }
</style></head>
<body>
  <div class=\"container\">
    <h2>We received your SnapFreeTools message</h2>
    <p>Thank you for contacting SnapFreeTools. We have received your message and will review it as soon as reasonably possible.</p>
    <p><strong>Reference ID:</strong> ${escapeHTML(referenceId)}<br>
    <strong>Category:</strong> ${escapeHTML(categoryLabel)}<br>
    <strong>Subject:</strong> ${escapeHTML(data.subject)}</p>
    <p><em>Please do not reply to this email. For your security, do not send passwords or sensitive information.</em></p>
    <p>Best regards,<br>The SnapFreeTools Team</p>
  </div>
</body>
</html>`;
const getAutoReplyText = (data, referenceId, categoryLabel) => `
We received your SnapFreeTools message

Thank you for contacting SnapFreeTools. We have received your message and will review it as soon as reasonably possible.

Reference ID: ${referenceId}
Category: ${categoryLabel}
Subject: ${data.subject}

Please do not reply to this email. For your security, do not send passwords or sensitive information.

Best regards,
The SnapFreeTools Team
`;
module.exports = { getAutoReplyHtml, getAutoReplyText };"

Set-Content -Path "backend/src/services/email.service.js" -Value "const env = require('../config/env');
const mail = require('../config/mail');
const logger = require('../utils/logger');
const { CATEGORY_LABELS } = require('../constants/contactCategories');
const { getNotificationHtml, getNotificationText } = require('../templates/contactNotification.template');
const { getAutoReplyHtml, getAutoReplyText } = require('../templates/contactAutoReply.template');
const { normalizeText } = require('../utils/sanitize');

const sendContactEmail = async (data, referenceId) => {
  const transporter = mail.getTransporter();
  const categoryLabel = CATEGORY_LABELS[data.category] || data.category;
  const submissionTime = new Date().toUTCString();
  const subject = `[SnapFreeTools Contact] ${categoryLabel}: ${data.subject}`;
  const normalizedMessage = normalizeText(data.message);
  const notifyHtml = getNotificationHtml({ ...data, message: normalizedMessage }, referenceId, categoryLabel, submissionTime);
  const notifyText = getNotificationText({ ...data, message: normalizedMessage }, referenceId, categoryLabel, submissionTime);

  try {
    await transporter.sendMail({
      from: `\"${env.SMTP_FROM_NAME}\" <${env.SMTP_FROM_EMAIL}>`,
      to: env.CONTACT_RECEIVER_EMAIL,
      replyTo: data.email,
      subject: subject,
      text: notifyText,
      html: notifyHtml
    });
    logger.info('Notification email sent successfully', { referenceId });
  } catch (err) {
    logger.error('Failed to send notification email', { error: err.message, referenceId });
    throw new Error('CONTACT_DELIVERY_FAILED');
  }

  if (env.CONTACT_AUTO_REPLY_ENABLED) {
    try {
      const replyHtml = getAutoReplyHtml(data, referenceId, categoryLabel);
      const replyText = getAutoReplyText(data, referenceId, categoryLabel);
      await transporter.sendMail({
        from: `\"${env.SMTP_FROM_NAME}\" <${env.SMTP_FROM_EMAIL}>`,
        to: data.email,
        subject: 'We received your SnapFreeTools message',
        text: replyText,
        html: replyHtml
      });
      logger.info('Auto-reply email sent successfully', { referenceId });
    } catch (err) {
      logger.error('Failed to send auto-reply email', { error: err.message, referenceId });
    }
  }
};
module.exports = { sendContactEmail };"

Set-Content -Path "backend/src/controllers/contact.controller.js" -Value "const emailService = require('../services/email.service');
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
module.exports = { handleContactSubmission };"

Set-Content -Path "backend/src/routes/contact.routes.js" -Value "const express = require('express');
const router = express.Router();
const contactRateLimit = require('../middleware/contactRateLimit');
const validateRequest = require('../middleware/validateRequest');
const spamProtection = require('../middleware/spamProtection');
const { handleContactSubmission } = require('../controllers/contact.controller');
const asyncHandler = require('../utils/asyncHandler');

router.post('/', contactRateLimit, validateRequest, spamProtection, asyncHandler(handleContactSubmission));

module.exports = router;"

Set-Content -Path "backend/src/routes/index.js" -Value "const express = require('express');
const router = express.Router();
const contactRoutes = require('./contact.routes');

router.get('/health', (req, res) => {
  res.json({ success: true, service: 'SnapFreeTools Contact API', status: 'ok' });
});

router.use('/contact', contactRoutes);

module.exports = router;"

Set-Content -Path "backend/src/app.js" -Value "const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const corsOptions = require('./config/cors');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));
app.use(express.json({ limit: '25kb' }));

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;"

Set-Content -Path "backend/src/server.js" -Value "const env = require('./config/env');
const app = require('./app');
const logger = require('./utils/logger');
const mail = require('./config/mail');

const startServer = async () => {
  try {
    const server = app.listen(env.PORT, () => {
      logger.info(`Backend server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    const shutdown = () => {
      logger.info('Shutting down server gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
};
startServer();"

Set-Content -Path "backend/tests/contact.validation.test.js" -Value "const test = require('node:test');
const assert = require('node:assert');
const { contactSchema } = require('../src/validators/contact.validator');

test('Valid payload passes', () => {
  const payload = { name: 'John Doe', email: 'john@example.com', subject: 'Great tool', category: 'general', message: 'This is a message with more than twenty characters.', privacyAccepted: true };
  const res = contactSchema.safeParse(payload);
  assert.strictEqual(res.success, true);
});
test('Invalid email fails', () => {
  const payload = { name: 'John Doe', email: 'john', subject: 'Great tool', category: 'general', message: 'This is a message with more than twenty characters.', privacyAccepted: true };
  const res = contactSchema.safeParse(payload);
  assert.strictEqual(res.success, false);
});"

Set-Content -Path "backend/tests/contact.route.test.js" -Value "const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

test('Health route returns 200', async () => {
  const res = await request(app).get('/api/v1/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
});
test('Unknown route returns 404', async () => {
  const res = await request(app).get('/api/v1/unknown');
  assert.strictEqual(res.status, 404);
});"

Set-Content -Path "backend/package.json" -Value "{
  `"name`": `"snapfreetools-backend`",
  `"version`": `"1.0.0`",
  `"description`": `"Backend API for SnapFreeTools`",
  `"main`": `"src/server.js`",
  `"scripts`": {
    `"start`": `"node src/server.js`",
    `"dev`": `"nodemon src/server.js`",
    `"test`": `"node --test`",
    `"test:watch`": `"node --test --watch`"
  },
  `"dependencies`": {
    `"compression`": `"^1.7.4`",
    `"cors`": `"^2.8.5`",
    `"dotenv`": `"^16.4.5`",
    `"express`": `"^4.19.2`",
    `"express-rate-limit`": `"^7.3.1`",
    `"helmet`": `"^7.1.0`",
    `"nodemailer`": `"^6.9.14`",
    `"sanitize-html`": `"^2.13.0`",
    `"zod`": `"^3.23.8`"
  },
  `"devDependencies`": {
    `"eslint`": `"^9.6.0`",
    `"nodemon`": `"^3.1.4`",
    `"supertest`": `"^7.0.0`"
  }
}"
