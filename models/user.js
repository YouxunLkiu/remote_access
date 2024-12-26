const mongoose = require('mongoose');

// Define schema for user collection
const userSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
  createdAt: { type: Date, default: Date.now },
});

// Export the model
module.exports = mongoose.model('User', userSchema);
