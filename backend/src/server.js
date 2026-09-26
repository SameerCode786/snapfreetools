const env = require('./config/env');
const app = require('./app');
const logger = require('./utils/logger');
const mail = require('./config/mail');
const { connectDatabase, disconnectDatabase } = require('./config/database');

const startServer = async () => {
  try {
    // Attempt database connection if configured
    try {
      await connectDatabase();
    } catch (dbErr) {
      logger.warn('Database initialization deferred or failed:', { error: dbErr.message });
      if (env.NODE_ENV === 'production' && env.MONGODB_URI) {
        throw dbErr; // Fail fast in production if DB is required and configured
      }
    }

    const server = app.listen(env.PORT, () => {
      logger.info(`Backend server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${env.PORT} is already in use.`);
      } else if (err.code === 'EACCES') {
        logger.error(`Permission denied to bind to port ${env.PORT}.`);
      } else {
        logger.error('Failed to start server', { error: err.message });
      }
      process.exit(1);
    });

    const shutdown = async () => {
      logger.info('Shutting down server gracefully...');
      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDatabase();
        logger.info('Graceful shutdown completed');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    logger.error('Failed to start server (import/init failure)', { error: err.message });
    process.exit(1);
  }
};
startServer();

