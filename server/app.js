const express              = require('express');
const applyGlobalMiddlewares = require('./src/middlewares/index');
const routes               = require('./src/routes/index');
const notFound             = require('./src/middlewares/notFound.middleware');
const errorHandler         = require('./src/middlewares/error.middleware');

const app = express();

// 1. Apply all global middlewares (helmet, cors, rate limit, body parsing)
applyGlobalMiddlewares(app);

// 2. Mount all API routes
app.use('/api', routes);

// 3. 404 handler — must come after all routes
app.use(notFound);

// 4. Global error handler — must be last, takes (err, req, res, next)
app.use(errorHandler);


module.exports = app;

