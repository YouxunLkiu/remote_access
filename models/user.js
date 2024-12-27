const mongoose = require('mongoose');

// Define schema for user collection
const userSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
  roles: { type: [String], default: ['mobile', 'trainer'] }, // Default role is 'mobile' and 'trainer'
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
