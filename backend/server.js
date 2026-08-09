/**
 * server.js
 * ---------
 * Findora backend entrypoint.
 * Loads env vars, connects to MongoDB, then starts the Express app
 * exported from app.js. Keeping this file thin means app.js can be
 * imported directly in tests without binding a port.
 */

const dotenv    = require('dotenv');
const connectDB = require('./config/database');
const app       = require('./app');

// Load env vars first
dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅  Findora Backend running on http://localhost:${PORT}`);
});
