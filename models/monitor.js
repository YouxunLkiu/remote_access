const mongoose = require('mongoose');

const trainingLogSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    appID: { type: String, required: true },
    status: { type: String, required: true },
    full_log: { type: String, required: true },
    params: { type: Object, default: {} },
    lastUpdated: { type: Date, default: Date.now },
});

const TrainingLog = mongoose.model('TrainingLog', trainingLogSchema);

module.exports = TrainingLog;