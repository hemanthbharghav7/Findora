/**
 * app.js
 * ------
 * Express application factory for Findora.
 * Creates and configures the Express app; does NOT call app.listen() here
 * so that server.js can control startup (and tests can import without binding a port).
 *
 * Middleware stack (in order):
 *  1. cors            – Allow cross-origin requests from the frontend
 *  2. express.json    – Parse JSON request bodies
 *  3. urlencoded      – Parse URL-encoded form bodies
 *  4. /uploads static – Serve uploaded item images as public static files
 *
 * Routes mounted:
 *  /api/auth   → authRoutes   (register, login, me)
 *  /api/items  → itemRoutes   (CRUD + claims)
 *  /api/users  → userRoutes   (profile, user's items)
 *
 * Error middleware registered last (must follow all routes).
 */

const express         = require('express');
const cors            = require('cors');
const path            = require('path');

// Route modules
const authRoutes      = require('./routes/authRoutes');
const itemRoutes      = require('./routes/itemRoutes');
const userRoutes      = require('./routes/userRoutes');

// Global error handler
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());                                    // TODO: restrict to FRONTEND_URL env var
app.use(express.json());                            // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));    // Parse form bodies

// Serve uploaded images as static files at /uploads/<filename>
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ message: 'Findora API is running 🔍' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
// Must be the LAST middleware registered
app.use(errorMiddleware);

module.exports = app;
