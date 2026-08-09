/**
 * routes/userRoutes.js
 * ---------------------
 * Express router for user profile endpoints in Findora.
 *
 * Route map:
 *  GET /api/users/:id         → userController.getUserProfile  (public)
 *  PUT /api/users/profile     → userController.updateProfile   (private)
 *  GET /api/users/:id/items   → userController.getUserItems    (public)
 */

const express  = require('express');
const router   = express.Router();
const { getUserProfile, updateProfile, getUserItems } = require('../controllers/userController');
const protect  = require('../middleware/authMiddleware');

// NOTE: Static route '/profile' must be defined BEFORE dynamic '/:id'
// to prevent Express from treating 'profile' as an :id param.
router.put('/profile', protect, updateProfile);    // Private: update own profile
router.get('/:id', getUserProfile);                // Public:  view any user profile
router.get('/:id/items', getUserItems);            // Public:  view items by user

module.exports = router;
