const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

// Mock nodemailer
const nodemailer = require('nodemailer');
nodemailer.createTransport = () => ({
  sendMail: async () => ({ messageId: 'mock-id' })
});

test('GET /api/v1/health should return healthy status', async () => {
  const response = await request(app).get('/api/v1/health');
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.success, true);
  assert.strictEqual(response.body.status, 'healthy');
});

test('POST /api/v1/contact should validate payload', async () => {
  const response = await request(app).post('/api/v1/contact').send({});
  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.success, false);
});

// Since the honeypot blocks the request
test('POST /api/v1/contact should block honeypot', async () => {
  const response = await request(app).post('/api/v1/contact').send({
    website: 'http://spam.com',
    name: 'Test Name',
    email: 'test@example.com',
    subject: 'Subject testing',
    category: 'general-question',
    message: 'This is a test message to bypass length limits.',
    privacyAccepted: true
  });
  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.message, 'Invalid request payload.');
});
