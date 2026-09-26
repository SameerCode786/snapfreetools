const { describe, it } = require('node:test');
const assert = require('node:assert');
const { generateStorageKey, validateStorageKey } = require('../src/services/storage/storageKey');
const { PathTraversalError } = require('../src/services/storage/errors');

describe('Storage Key & Path Traversal Security Tests', () => {
  it('should generate an unpredictable UUID-based storage key', () => {
    const key1 = generateStorageKey('documents', '.pdf');
    const key2 = generateStorageKey('documents', '.pdf');

    assert.notStrictEqual(key1, key2, 'Generated keys must be unique');
    assert.ok(key1.startsWith('documents/'), 'Key must start with prefix');
    assert.ok(key1.endsWith('.pdf'), 'Key must end with .pdf');

    // UUID format test
    const parts = key1.split('/');
    const filename = parts[1].replace('.pdf', '');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    assert.ok(uuidRegex.test(filename), 'Storage key must use standard UUID');
  });

  it('should allow valid storage keys', () => {
    const validKeys = [
      'documents/550e8400-e29b-41d4-a716-446655440000.pdf',
      'temp_files/abc-123_456.pdf',
      'signed/doc1.pdf'
    ];

    validKeys.forEach((key) => {
      const validated = validateStorageKey(key);
      assert.strictEqual(validated, key);
    });
  });

  it('should reject path traversal attempts with ..', () => {
    const badKeys = [
      '../secrets.env',
      'documents/../../etc/passwd',
      'documents/../test.pdf',
      '..\\windows\\system32'
    ];

    badKeys.forEach((key) => {
      assert.throws(
        () => validateStorageKey(key),
        PathTraversalError,
        `Key "${key}" should have been rejected with PathTraversalError`
      );
    });
  });

  it('should reject leading slashes and null bytes', () => {
    const badKeys = [
      '/etc/shadow',
      '/documents/test.pdf',
      'documents/test\0.pdf',
      'documents//double-slash.pdf',
      'documents/'
    ];

    badKeys.forEach((key) => {
      assert.throws(
        () => validateStorageKey(key),
        PathTraversalError,
        `Key "${key}" should have been rejected with PathTraversalError`
      );
    });
  });
});
