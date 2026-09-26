const { describe, it } = require('node:test');
const assert = require('node:assert');
const S3StorageDriver = require('../src/services/storage/drivers/S3StorageDriver');
const { StorageService } = require('../src/services/storage');
const { StorageConfigurationError } = require('../src/services/storage/errors');

describe('S3 Storage Driver Configuration & Driver Selection Tests', () => {
  it('should throw StorageConfigurationError when S3_BUCKET is missing', () => {
    assert.throws(
      () => new S3StorageDriver({ accessKeyId: 'key', secretAccessKey: 'secret' }),
      StorageConfigurationError,
      'Should reject missing S3_BUCKET'
    );
  });

  it('should throw StorageConfigurationError when S3 credentials are missing', () => {
    assert.throws(
      () => new S3StorageDriver({ bucket: 'my-bucket' }),
      StorageConfigurationError,
      'Should reject missing credentials'
    );
  });

  it('should initialize S3StorageDriver successfully with valid credentials', () => {
    const driver = new S3StorageDriver({
      bucket: 'test-bucket',
      region: 'us-east-1',
      accessKeyId: 'test-key-id',
      secretAccessKey: 'test-secret-key'
    });

    assert.ok(driver, 'Driver should instantiate');
    assert.strictEqual(driver.bucket, 'test-bucket');
  });

  it('StorageService should select local driver by default', () => {
    const service = new StorageService({ STORAGE_DRIVER: 'local', LOCAL_STORAGE_PATH: './storage/documents' });
    assert.strictEqual(service.getDriverName(), 'local');
  });

  it('StorageService should fail fast when STORAGE_DRIVER=s3 but credentials missing', () => {
    assert.throws(
      () => new StorageService({ STORAGE_DRIVER: 's3' }),
      StorageConfigurationError
    );
  });

  it('StorageService should reject unsupported driver names', () => {
    assert.throws(
      () => new StorageService({ STORAGE_DRIVER: 'ftp' }),
      StorageConfigurationError
    );
  });
});
