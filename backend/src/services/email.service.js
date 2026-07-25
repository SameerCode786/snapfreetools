const transporter = require('../config/mail');
const env = require('../config/env');
const logger = require('../utils/logger');
const { getNotificationHtml, getNotificationText } = require('../templates/contactNotification.template');
const { getAutoReplyHtml, getAutoReplyText } = require('../templates/contactAutoReply.template');

const sendContactNotification = async (data) => {
  const mailOptions = {
    from: `"${env.CONTACT_FROM_NAME}" <${env.CONTACT_FROM_EMAIL}>`,
    to: env.CONTACT_RECEIVER_EMAIL,
    replyTo: data.email,
    subject: `[SnapFreeTools Contact] ${data.category}: ${data.subject}`,
    text: getNotificationText(data),
    html: getNotificationHtml(data)
  };

  try {
    // Verify SMTP connection before attempting to send
    await transporter.verify();
    
    const info = await transporter.sendMail(mailOptions);
    logger.info('Contact notification email sent', { messageId: info.messageId, referenceId: data.referenceId });
    return true;
  } catch (error) {
    logger.error('SMTP Error in sendContactNotification:', { 
      error: error.message, 
      code: error.code,
      command: error.command,
      referenceId: data.referenceId 
    });
    
    // Throw the original error so the controller can log it precisely in dev
    throw error;
  }
};

const sendAutoReply = async (email, referenceId) => {
  const mailOptions = {
    from: `"${env.CONTACT_FROM_NAME}" <${env.CONTACT_FROM_EMAIL}>`,
    to: email,
    replyTo: env.CONTACT_RECEIVER_EMAIL,
    subject: `We received your SnapFreeTools message — ${referenceId}`,
    text: getAutoReplyText(referenceId),
    html: getAutoReplyHtml(referenceId)
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info('Auto-reply sent successfully', { referenceId });
  } catch (error) {
    logger.warn('Failed to send auto-reply email (non-fatal)', { error: error.message, referenceId });
  }
};

module.exports = { sendContactNotification, sendAutoReply };
