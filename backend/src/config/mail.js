const nodemailer = require('nodemailer');
const env = require('./env');

const createTransporter = () => {
  const config = {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
  };

  if (env.SMTP_USER && env.SMTP_APP_PASSWORD) {
    config.auth = {
      user: env.SMTP_USER,
      pass: env.SMTP_APP_PASSWORD,
    };
  }

  return nodemailer.createTransport(config);
};

const transporter = createTransporter();

module.exports = transporter;
