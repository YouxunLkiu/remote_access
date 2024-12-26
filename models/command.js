const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema({
    command: { type: String, required: true },
    userID: { type: String, required: true },
    appID: { type: String, required: true },
    result: { type: String },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Command', commandSchema);