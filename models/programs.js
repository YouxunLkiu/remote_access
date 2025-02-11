const mongoose = require('mongoose');

// Define schema for user collection
const ProgramSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  pcid: { type: String, required: true }, // Store hashed password
  projectName: { type: String,  required: true }, // Default role is 'mobile' and 'trainer'
  projectDescription: { type: String,  required: true },
});
 
module.exports = mongoose.model('Program', ProgramSchema);
