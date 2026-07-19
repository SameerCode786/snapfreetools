const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

test('Health route returns 200', async () => {
  const res = await request(app).get('/api/v1/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
});

test('Unknown route returns 404', async () => {
  const res = await request(app).get('/api/v1/unknown');
  assert.strictEqual(res.status, 404);
});
