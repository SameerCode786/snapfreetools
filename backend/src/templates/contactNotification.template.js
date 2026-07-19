const { escapeHTML } = require('../utils/sanitize');

const getNotificationHtml = (data, referenceId, categoryLabel, submissionTime) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; background-color: #ffffff; color: #333333; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
  h2 { color: #0f172a; margin-top: 0; }
  .row { margin-bottom: 10px; }
  .label { font-weight: bold; color: #10b981; }
  pre { background-color: #f8fafc; padding: 15px; border-radius: 4px; white-space: pre-wrap; font-family: inherit; }
</style>
</head>
<body>
  <div class="container">
    <h2>New Contact Submission</h2>
    <div class="row"><span class="label">Reference ID:</span> ${escapeHTML(referenceId)}</div>
    <div class="row"><span class="label">Name:</span> ${escapeHTML(data.name)}</div>
    <div class="row"><span class="label">Email:</span> <a href="mailto:${escapeHTML(data.email)}">${escapeHTML(data.email)}</a></div>
    <div class="row"><span class="label">Category:</span> ${escapeHTML(categoryLabel)}</div>
    <div class="row"><span class="label">Subject:</span> ${escapeHTML(data.subject)}</div>
    <div class="row"><span class="label">Time:</span> ${submissionTime}</div>
    <div class="row"><span class="label">Privacy Accepted:</span> Yes</div>
    <div class="row"><span class="label">Message:</span></div>
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

module.exports = { getNotificationHtml, getNotificationText };
