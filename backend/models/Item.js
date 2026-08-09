const mongoose = require('mongoose');

// Define the embedded Claim schema
// We do not create a separate model for this, as it only lives inside the Item's claims array.
const claimSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User collection
    required: [true, 'A claim must be associated with a user'],
  },
  message: {
    type: String,
    required: [true, 'A claim message is required'],
    trim: true,
  },
  claimedAt: {
    type: Date,
    default: Date.now, // Sensible default for when the claim was made
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
});

// Define the main Item schema
const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Item description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Lost', 'Found'], // Restricts values to only these two options
      required: [true, 'Item type must be specified as either Lost or Found'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    image: {
      type: String,
      default: '', // Default empty string if no image is uploaded initially
    },
    status: {
      type: String,
      enum: ['Open', 'Claimed', 'Resolved'], // Tracks the investigation status
      default: 'Open', // Sensible default when a new case/item is created
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User collection (the person reporting the item)
      required: [true, 'Item must have an owner'],
    },
    // Embedded array of claims using the schema defined above
    claims: [claimSchema],
  },
  {
    // Automatically manage createdAt and updatedAt fields
    timestamps: true,
  }
);

// Export the Item model
module.exports = mongoose.model('Item', itemSchema);