/**
 * utils/asyncHandler.js
 * ----------------------
 * Wraps an async Express route handler so rejected promises are
 * forwarded to next(err) instead of needing a try/catch in every
 * controller function.
 *
 * Usage:
 *   router.get('/', asyncHandler(async (req, res) => { ... }));
 */

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
