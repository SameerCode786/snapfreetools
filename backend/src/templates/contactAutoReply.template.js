const { escapeHTML } = require('../utils/sanitize');

const getAutoReplyHtml = (data, referenceId, categoryLabel) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; background-color: #ffffff; color: #333333; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
  h2 { color: #0f172a; margin-top: 0; }
</style>
</head>
<body>
  <div class="container">
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

module.exports = { getAutoReplyHtml, getAutoReplyText };
