const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs/promises');
const LocalStorageDriver = require('../src/services/storage/drivers/LocalStorageDriver');
const {
  StorageNotFoundError,
  PathTraversalError,
  StorageWriteError
} = require('../src/services/storage/errors');

const TEST_DIR = path.resolve(__dirname, '../storage/test_sandbox');

describe('Local Storage Driver Tests', () => {
  let driver;

  before(async () => {
    driver = new LocalStorageDriver(TEST_DIR);
  });

  after(async () => {
    // Clean up test sandbox
    try {
      await fs.rm(TEST_DIR, { recursive: true, force: true });
    } catch (_) {}
  });

  it('should write a file buffer and return key, size, and etag', async () => {
    const key = 'test_docs/sample.pdf';
    const content = Buffer.from('%PDF-1.4 Mock PDF Content For Storage Test');

    const result = await driver.putObject(key, content, { contentType: 'application/pdf' });

    assert.strictEqual(result.key, key);
    assert.strictEqual(result.size, content.length);
    assert.strictEqual(typeof result.etag, 'string');
    assert.strictEqual(result.etag.length, 64, 'ETag must be 64-character SHA256 hex');
  });

  it('should confirm file existence with exists()', async () => {
    const key = 'test_docs/sample.pdf';
    const doesExist = await driver.exists(key);
    assert.strictEqual(doesExist, true);

    const nonExistent = await driver.exists('test_docs/does_not_exist.pdf');
    assert.strictEqual(nonExistent, false);
  });

  it('should read a stored file buffer with getObject()', async () => {
    const key = 'test_docs/sample.pdf';
    const content = Buffer.from('%PDF-1.4 Mock PDF Content For Storage Test');

    const obj = await driver.getObject(key);

    assert.strictEqual(obj.key, key);
    assert.strictEqual(obj.size, content.length);
    assert.deepStrictEqual(obj.buffer, content);
  });

  it('should return a readable stream with getObjectStream()', async () => {
    const key = 'test_docs/sample.pdf';
    const stream = await driver.getObjectStream(key);

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const streamedBuffer = Buffer.concat(chunks);
    assert.strictEqual(streamedBuffer.toString(), '%PDF-1.4 Mock PDF Content For Storage Test');
  });

  it('should throw StorageNotFoundError when reading non-existent file', async () => {
    await assert.rejects(
      () => driver.getObject('test_docs/missing_file.pdf'),
      StorageNotFoundError
    );
  });

  it('should delete a file and verify it no longer exists', async () => {
    const key = 'test_docs/sample.pdf';

    const deleteResult = await driver.deleteObject(key);
    assert.strictEqual(deleteResult.success, true);

    const doesExist = await driver.exists(key);
    assert.strictEqual(doesExist, false);
  });

  it('should be idempotent when deleting non-existent file', async () => {
    const deleteResult = await driver.deleteObject('test_docs/already_deleted.pdf');
    assert.strictEqual(deleteResult.success, true);
  });

  it('should reject path traversal in putObject', async () => {
    const content = Buffer.from('malicious payload');
    await assert.rejects(
      () => driver.putObject('../escaped.txt', content),
      PathTraversalError
    );
  });

  it('should reject non-buffer data in putObject', async () => {
    await assert.rejects(
      () => driver.putObject('test_docs/invalid.txt', 'string is not buffer'),
      StorageWriteError
    );
  });
});
