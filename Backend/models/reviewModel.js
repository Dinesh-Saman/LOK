const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  menuItem: {
    type: Schema.Types.ObjectId,
    ref: 'Menu',
    required: true,
  },
  user: { // New field to reference the User model
    type: Schema.Types.ObjectId,
    ref: 'User', // Ensure this matches the name of your user model
    required: true, // Optional: make this required based on your requirements
  },
  foodName: {
    type: String,
    required: true,
  },
  servingSize: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'flagged', 'removed'], // Predefined values
    default: 'pending', // Default value is 'pending'
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
