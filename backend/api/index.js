require('dotenv').config();
const app = require('../src/app');
const connectDB = require('../src/config/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    res.status(500).json({ message: 'Database connection failed' });
    return;
  }
  app(req, res);
};
