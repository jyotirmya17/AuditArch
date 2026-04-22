const helmet    = require('helmet');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');
const express   = require('express');
const config    = require('../config/config');

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max:      config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders:   false,
  validate: false,
  message: { success: false, message: 'Too many requests.' },
});

const applyGlobalMiddlewares = (app) => {
  // Security headers
  app.use(helmet());

  // CORS — only allow our frontend origin
  app.use(cors({
    origin:      config.clientUrl,
    methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  }));

  // Rate limiting — applied to ALL /api routes
  app.use('/api', limiter);

  // Body parsing
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));
};

module.exports = applyGlobalMiddlewares;
