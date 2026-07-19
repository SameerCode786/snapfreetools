const env = require('./config/env');
const app = require('./app');
const logger = require('./utils/logger');
const mail = require('./config/mail');

const startServer = async () => {
  try {
    const server = app.listen(env.PORT, () => {
      logger.info(`Backend server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    const shutdown = () => {
      logger.info('Shutting down server gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
};
startServer();
