require('dotenv').config();
const app       = require('./app');
const connectDB = require('./src/config/db');
const config    = require('./src/config/config');

connectDB();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} [${config.nodeEnv}]`);
});
