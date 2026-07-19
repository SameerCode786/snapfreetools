require('dotenv').config();
const { z } = require('zod');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).refine(n => !isNaN(n) && n > 0 && n < 65536, 'Invalid PORT'),
  FRONTEND_ORIGIN: z.string().url('FRONTEND_ORIGIN must be a valid URL'),
  CONTACT_RECEIVER_EMAIL: z.string().email(),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string().transform(Number),
  SMTP_SECURE: z.string().transform(v => v === 'true'),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM_NAME: z.string().min(1),
  SMTP_FROM_EMAIL: z.string().email(),
  CONTACT_RATE_LIMIT_WINDOW_MINUTES: z.string().transform(Number).default('15'),
  CONTACT_RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('5'),
  CONTACT_AUTO_REPLY_ENABLED: z.string().transform(v => v === 'true').default('false'),
  CONTACT_MIN_SUBMISSION_TIME_SECONDS: z.string().transform(Number).default('3'),
  CONTACT_MAX_LINKS: z.string().transform(Number).default('3')
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

if (parsed.data.NODE_ENV === 'production' && parsed.data.SMTP_PASS.includes('your-google')) {
  console.error('Cannot use placeholder SMTP credentials in production.');
  process.exit(1);
}

const envConfig = Object.freeze(parsed.data);
module.exports = envConfig;
