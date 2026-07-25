require('dotenv').config();
const transporter = require('../src/config/mail');
const env = require('../src/config/env');

async function testMail() {
  console.log('Sending test email...');
  try {
    const info = await transporter.sendMail({
      from: `"${env.CONTACT_FROM_NAME}" <${env.CONTACT_FROM_EMAIL}>`,
      to: env.CONTACT_RECEIVER_EMAIL,
      subject: 'SnapFreeTools SMTP Test',
      text: 'This is a test email to verify SMTP configuration is working correctly.',
      html: '<p>This is a test email to verify SMTP configuration is working correctly.</p>'
    });
    console.log('SUCCESS: Test email sent successfully.');
    console.log(`Message ID: ${info.messageId}`);
  } catch (error) {
    console.error('ERROR: Failed to send test email.');
    console.error(error.message);
  }
}

testMail();
