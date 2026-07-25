require('dotenv').config();
const transporter = require('../src/config/mail');

async function verify() {
  console.log('Verifying SMTP connection...');
  try {
    await transporter.verify();
    console.log('SUCCESS: SMTP connection verified successfully.');
    console.log('Server is ready to send messages.');
  } catch (error) {
    console.error('ERROR: Failed to verify SMTP connection.');
    console.error(error.message);
  }
}

verify();
