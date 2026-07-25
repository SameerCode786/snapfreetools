const env = require('./env');
const logger = require('../utils/logger');

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = env.FRONTEND_ORIGIN ? env.FRONTEND_ORIGIN.split(',').map(o => o.trim()).filter(Boolean) : [];
    
    if (!origin || origin === env.FRONTEND_ORIGIN || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS request rejected for origin:', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = corsOptions;
