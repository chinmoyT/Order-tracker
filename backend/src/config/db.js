const mongoose = require('mongoose');

let connectionPromise = null;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in .env');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri).then((m) => {
      console.log('MongoDB connected');
      return m.connection;
    }).catch((err) => {
      connectionPromise = null;
      throw err;
    });
  }

  return connectionPromise;
}

module.exports = connectDB;
