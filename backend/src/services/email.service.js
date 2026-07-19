const env = require('../config/env');
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
      from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
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
        from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
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

module.exports = { sendContactEmail };
