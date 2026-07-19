const env = require('./env');

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin === env.FRONTEND_ORIGIN) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

module.exports = corsOptions;
