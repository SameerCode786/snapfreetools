const { describe, it } = require('node:test');
const assert = require('node:assert');
const {
  sanitizeMongoUri,
  getMongoOptions,
  isDatabaseConnected
} = require('../src/config/database');

describe('Database Configuration Unit Tests', () => {
  it('should sanitize credentials from MongoDB URI for logging', () => {
    const rawUri = 'mongodb://myUser:superSecretPassword123@cluster0.abcde.mongodb.net/snapfreetools?retryWrites=true';
    const sanitized = sanitizeMongoUri(rawUri);

    assert.ok(!sanitized.includes('superSecretPassword123'), 'Sanitized URI must not contain password');
    assert.ok(sanitized.includes('myUser:****@'), 'Sanitized URI must mask password with asterisks');
  });

  it('should handle URI without credentials safely', () => {
    const rawUri = 'mongodb://127.0.0.1:27017/snapfreetools';
    const sanitized = sanitizeMongoUri(rawUri);
    assert.strictEqual(sanitized, rawUri);
  });

  it('should provide production-ready connection pool options', () => {
    const options = getMongoOptions();

    assert.strictEqual(options.maxPoolSize, 10, 'maxPoolSize should be 10');
    assert.strictEqual(options.minPoolSize, 2, 'minPoolSize should be 2');
    assert.strictEqual(options.serverSelectionTimeoutMS, 5000, 'serverSelectionTimeoutMS should be 5000ms');
    assert.strictEqual(options.socketTimeoutMS, 45000, 'socketTimeoutMS should be 45000ms');
  });

  it('should return boolean for isDatabaseConnected helper', () => {
    const status = isDatabaseConnected();
    assert.strictEqual(typeof status, 'boolean');
  });
});
