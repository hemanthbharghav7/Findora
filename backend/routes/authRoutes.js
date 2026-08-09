const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser,
  getSecurityQuestion,
  resetPasswordWithQuestion
} = require('../controllers/authController');

// Map routes to controller methods
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', getSecurityQuestion);
router.post('/reset-password', resetPasswordWithQuestion);

module.exports = router;