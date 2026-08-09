/**
 * config/database.js
 * ------------------
 * MongoDB connection helper for Findora.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast — 5s instead of 30s default
    });
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB connection error: ${error.message}`);
    // Don't call process.exit(1) — let the server stay alive so
    // the frontend gets a real JSON error instead of ERR_CONNECTION_REFUSED.
    // Mongoose will automatically retry the connection.
  }
};

module.exports = connectDB;
