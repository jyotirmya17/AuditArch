module.exports = {
  port:     process.env.PORT || 5000,
  nodeEnv:  process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI,
  jwt: {
    secret:    process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  clientUrl: process.env.CLIENT_URL,
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    max:      Number(process.env.RATE_LIMIT_MAX) || 100,
  },
};
