const test = require('node:test');
const assert = require('node:assert');
const contactSchema = require('../src/validators/contact.validator');

test('Valid payload passes', () => {
  const payload = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Great tool',
    category: 'general-question',
    message: 'This is a message with more than twenty characters.',
    privacyAccepted: true
  };
  const res = contactSchema.safeParse(payload);
  assert.strictEqual(res.success, true);
});

test('Invalid email fails', () => {
  const payload = {
    name: 'John Doe',
    email: 'john',
    subject: 'Great tool',
    category: 'general-question',
    message: 'This is a message with more than twenty characters.',
    privacyAccepted: true
  };
  const res = contactSchema.safeParse(payload);
  assert.strictEqual(res.success, false);
});


