/**
 * controllers/userController.js
 * ------------------------------
 * Request handler functions for user profile routes in Findora.
 * Each function is an Express route handler: (req, res, next) => void.
 *
 * Future responsibilities:
 *  - getUserProfile  → Return public profile of any user by :id
 *  - updateProfile   → Update name or avatar for the authenticated user
 *  - getUserItems    → Return all items reported by a given user
 */

// TODO: const User = require('../models/User');
// TODO: const Item = require('../models/Item');

/**
 * @route   GET /api/users/:id
 * @access  Public
 */
const getUserProfile = async (req, res, next) => {
  // TODO: Implement public profile fetch
  res.status(501).json({ message: 'getUserProfile – not yet implemented' });
};

/**
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  // TODO: Implement profile update
  res.status(501).json({ message: 'updateProfile – not yet implemented' });
};

/**
 * @route   GET /api/users/:id/items
 * @access  Public
 */
const getUserItems = async (req, res, next) => {
  // TODO: Implement fetch items by user
  res.status(501).json({ message: 'getUserItems – not yet implemented' });
};

module.exports = { getUserProfile, updateProfile, getUserItems };
