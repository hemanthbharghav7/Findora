/**
 * utils/generateToken.js
 * -----------------------
 * Signs a JWT for a given user id. Used by authController on
 * register/login to issue the token returned to the client.
 */

const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

module.exports = generateToken;
