
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    profileImage: {
      type: String,
      default: '', // Sensible default for users who haven't uploaded an image
    },
    securityQuestion: {
      type: String,
      default: '',
    },
    securityAnswer: {
      type: String,
      default: '',
      select: false, // Don't return the hashed answer by default
    },
  },
  {
    // Automatically manage createdAt and updatedAt fields
    timestamps: true,
  }
);

// Pre-save hook to hash password and security answer before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified('securityAnswer') && this.securityAnswer) {
    const salt = await bcrypt.genSalt(10);
    this.securityAnswer = await bcrypt.hash(this.securityAnswer.toLowerCase().trim(), salt);
  }
  next();
});

// Method to compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to compare entered security answer with hashed answer in database
userSchema.methods.matchSecurityAnswer = async function (enteredAnswer) {
  if (!this.securityAnswer) return false;
  return await bcrypt.compare(enteredAnswer.toLowerCase().trim(), this.securityAnswer);
};


// Export the User model
module.exports = mongoose.model('User', userSchema);