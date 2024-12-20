const mongoose = require('mongoose');

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        //The host will later to be changed to remote host.
        const conn = await mongoose.connect('mongodb://localhost:27017/trainingMonitor', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: Error occured in db.js: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;