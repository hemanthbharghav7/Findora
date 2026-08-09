const express   = require('express');
const dotenv    = require('dotenv');
const cors      = require('cors');
const path      = require('path');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const itemRoutes  = require('./routes/itemRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Load env vars first
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'https://findoora.netlify.app'
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve uploaded images statically ─────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/notifications', notificationRoutes);

// ── Health check ─────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', message: 'Findora API is running' })
);

// ── Start server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅  Findora Backend running on http://localhost:${PORT}`);
});