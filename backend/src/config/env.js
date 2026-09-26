const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  
  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || '',
  
  // Storage Configuration
  STORAGE_DRIVER: (process.env.STORAGE_DRIVER || 'local').toLowerCase(),
  LOCAL_STORAGE_PATH: process.env.LOCAL_STORAGE_PATH || path.resolve(__dirname, '../../storage/documents'),
  
  // S3 / Cloudflare R2 Storage Configuration
  S3_ENDPOINT: process.env.S3_ENDPOINT || '',
  S3_REGION: process.env.S3_REGION || 'auto',
  S3_BUCKET: process.env.S3_BUCKET || '',
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || '',
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || '',
  S3_FORCE_PATH_STYLE: process.env.S3_FORCE_PATH_STYLE === 'true',

  // Mail Configuration
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || 465,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true' || true,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_APP_PASSWORD: process.env.SMTP_APP_PASSWORD || '',
  CONTACT_RECEIVER_EMAIL: process.env.CONTACT_RECEIVER_EMAIL || 'admin@snapfreetools.com',
  CONTACT_FROM_NAME: process.env.CONTACT_FROM_NAME || 'SnapFreeTools Contact',
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER,
  CONTACT_RATE_LIMIT_WINDOW_MINUTES: parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MINUTES || '15', 10),
  CONTACT_RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.CONTACT_RATE_LIMIT_MAX_REQUESTS || '5', 10)
};

module.exports = env;

