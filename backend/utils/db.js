const mongoose = require('mongoose');

// Reuse one connection across requests (important on Vercel serverless,
// where the same function instance handles many requests).
let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
      .then(() => {
        console.log('MongoDB connected');
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = null; // allow retry on next request
        console.error('MongoDB connection error:', error.message);
        throw error;
      });
  }
  return connectionPromise;
};

module.exports = connectDB;
