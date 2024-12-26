const connectDB = require('../config/db');
const TrainingApp = require('../models/trainingApp');

const testTrainingAppModel = async () => {
    try {
        await connectDB();

        // Create a training app
        const newTrainingApp = new TrainingApp({
            userID: 'testUser123',
            appID: 'trainingApp001',
            status: 'Running',
            full_log: '/path/to/log.txt',
            params: { learningRate: 0.001, batchSize: 32 },
        });
        await newTrainingApp.save();
        console.log('Training application created:', newTrainingApp);

        // Fetch training apps
        const fetchedApps = await TrainingApp.find({ userID: 'testUser123' });
        console.log('Fetched training applications:', fetchedApps);

        // Update the training app
        const updatedApp = await TrainingApp.findOneAndUpdate(
            { appID: 'trainingApp001' },
            { status: 'Completed' },
            { new: true }
        );
        console.log('Updated training application:', updatedApp);

        // Delete the training app
        const result = await TrainingApp.deleteOne({ appID: 'trainingApp001' });
        console.log('Training application deleted:', result);

        process.exit(0);
    } catch (error) {
        console.error('Error during testing:', error);
        process.exit(1);
    }
};

testTrainingAppModel();