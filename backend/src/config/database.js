const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

/**
 * Sanitizes MongoDB URI for logging (removes credentials).
 */
const sanitizeMongoUri = (uri) => {
  if (!uri) return '';
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
};

/**
 * MongoDB connection options.
 */
const getMongoOptions = () => ({
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  autoIndex: env.NODE_ENV !== 'production'
});

/**
 * Connect to MongoDB database.
 * If MONGODB_URI is not provided, warns and returns null without crashing (allowing non-DB routes to work).
 */
const connectDatabase = async () => {
  if (!env.MONGODB_URI) {
    logger.warn('MONGODB_URI not configured. Database features will be unavailable.');
    return null;
  }

  try {
    const sanitized = sanitizeMongoUri(env.MONGODB_URI);
    logger.info(`Connecting to MongoDB at ${sanitized}...`);

    await mongoose.connect(env.MONGODB_URI, getMongoOptions());
    logger.info('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    logger.error('Failed to connect to MongoDB', { error: error.message });
    throw error;
  }
};

/**
 * Disconnect from MongoDB gracefully.
 */
const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
      logger.info('MongoDB disconnected gracefully');
    } catch (error) {
      logger.error('Error disconnecting MongoDB', { error: error.message });
    }
  }
};

/**
 * Check if MongoDB connection is active.
 * 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
 */
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Listen to connection lifecycle events
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB connection lost. Attempting reconnection...');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB runtime error', { error: err.message });
});

module.exports = {
  connectDatabase,
  disconnectDatabase,
  isDatabaseConnected,
  sanitizeMongoUri,
  getMongoOptions
};
