const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        //The local host need to do
    
        await mongoose.connect('mongodb+srv://youxunliu:1070983894@cluster0.ozhla.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;