const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Helper: check DB is connected before running queries
const dbReady = () => mongoose.connection.readyState === 1;

// Utility function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  if (!dbReady()) {
    return res.status(503).json({ message: 'Database not available. Check your MongoDB Atlas IP whitelist.' });
  }
  try {
    const { name, email, password, securityQuestion, securityAnswer } = req.body;

    // 1. Check if all fields are provided
    if (!name || !email || !password || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ message: 'Please add all fields, including your security question and answer.' });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Create user (password/answer hashing is handled in the User model)
    const user = await User.create({
      name,
      email,
      password,
      securityQuestion,
      securityAnswer,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  if (!dbReady()) {
    return res.status(503).json({ message: 'Database not available. Check your MongoDB Atlas IP whitelist.' });
  }
  try {
    const { email, password } = req.body;

    // 1. Check for user email (and explicitly select the password field)
    const user = await User.findOne({ email }).select('+password');

    // 2. Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's security question
// @route   POST /api/auth/forgot-password
// @access  Public
const getSecurityQuestion = async (req, res) => {
  if (!dbReady()) {
    return res.status(503).json({ message: 'Database not available.' });
  }
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user registered with this email address' });
    }

    if (!user.securityQuestion) {
      return res.status(400).json({ message: 'This user has not configured a security question for password recovery.' });
    }

    res.json({ question: user.securityQuestion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password using security question
// @route   POST /api/auth/reset-password
// @access  Public
const resetPasswordWithQuestion = async (req, res) => {
  if (!dbReady()) {
    return res.status(503).json({ message: 'Database not available.' });
  }
  try {
    const { email, securityAnswer, newPassword } = req.body;

    if (!email || !securityAnswer || !newPassword) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Fetch user and explicitly select the hashed security answer
    const user = await User.findOne({ email }).select('+securityAnswer');
    if (!user) {
      return res.status(404).json({ message: 'No user registered with this email address' });
    }

    // Match the security answer
    const isAnswerCorrect = await user.matchSecurityAnswer(securityAnswer);
    if (!isAnswerCorrect) {
      return res.status(400).json({ message: 'Incorrect security answer' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ status: 'ok', message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getSecurityQuestion,
  resetPasswordWithQuestion,
};