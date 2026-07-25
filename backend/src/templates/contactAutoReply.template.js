const { escapeHtml } = require('../utils/sanitize');

const getAutoReplyHtml = (referenceId) => {
  return `
    <p>Thank you for contacting SnapFreeTools.</p>
    <p>Your message was received and will be reviewed as reasonably possible. Response times may vary.</p>
    <br/>
    <p><strong>Reference ID:</strong> ${escapeHtml(referenceId)}</p>
    <hr/>
    <p><small>This is an automated message. You can reply directly to this email to add more information to your request.</small></p>
  `;
};

const getAutoReplyText = (referenceId) => {
  return `
Thank you for contacting SnapFreeTools.

Your message was received and will be reviewed as reasonably possible. Response times may vary.

Reference ID: ${referenceId}

--------------------------------
This is an automated message. You can reply directly to this email to add more information to your request.
  `.trim();
};

module.exports = { getAutoReplyHtml, getAutoReplyText };
