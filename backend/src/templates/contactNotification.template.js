const { escapeHtml } = require('../utils/sanitize');

const getNotificationHtml = (data) => {
  return `
    <h2>SnapFreeTools Contact Submission</h2>
    <p><strong>Reference ID:</strong> ${escapeHtml(data.referenceId)}</p>
    <p><strong>Date:</strong> ${new Date().toISOString()}</p>
    <hr />
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Category:</strong> ${escapeHtml(data.category)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
    <br />
    <p><strong>Message:</strong></p>
    <p style="white-space: pre-wrap;">${escapeHtml(data.message)}</p>
  `;
};

const getNotificationText = (data) => {
  return `
SnapFreeTools Contact Submission
--------------------------------
Reference ID: ${data.referenceId}
Date: ${new Date().toISOString()}

Name: ${data.name}
Email: ${data.email}
Category: ${data.category}
Subject: ${data.subject}

Message:
${data.message}
  `.trim();
};

module.exports = { getNotificationHtml, getNotificationText };
