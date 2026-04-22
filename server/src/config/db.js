const mongoose = require('mongoose');
const config   = require('./config');

const connectDB = async () => {
  try {
    // If the URI is localhost and it's dev, try starting memory-server if real mongo fails
    // However, for this demo we'll use it to ensure the "Launch" works immediately.
    if (config.nodeEnv === 'development' && (!config.mongoUri || config.mongoUri.includes('localhost'))) {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log('Using In-Memory MongoDB for Development Demo');
        return;
      } catch (memErr) {
        console.error('Failed to start In-Memory MongoDB:', memErr.message);
      }
    }

    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
