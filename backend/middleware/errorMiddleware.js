/**
 * middleware/errorMiddleware.js
 * ------------------------------
 * Global error handling middleware for Findora Express app.
 * Must be registered LAST in app.js, after all routes.
 *
 * Future responsibilities:
 *  - Catch all errors passed via next(err) from any route or middleware
 *  - Return a consistent JSON error shape: { success: false, message, stack? }
 *  - Use err.status or err.statusCode if set, otherwise default to 500
 *  - Suppress stack trace in production (NODE_ENV === 'production')
 *  - Handle Mongoose validation errors and cast errors specifically
 *
 * Error shape returned to client:
 *  {
 *    success: false,
 *    message: "Human-readable error message",
 *    stack: "..." // only in development
 *  }
 */

const errorMiddleware = (err, req, res, next) => {
  // TODO: Implement full error handling logic
  const statusCode = err.status || err.statusCode || 500;
  const message    = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    // Omit stack trace in production
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorMiddleware;
