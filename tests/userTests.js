const connectDB = require('../config/db');
const User = require('../models/user');

const testUserModel = async () => {
    try {
        await connectDB(); // Connect to the database

        // Create a user
        const newUser = new User({
            userID: 'testUser123',
            password: 'hashedPassword123',
        });
        await newUser.save();
        console.log('User created:', newUser);

        // Fetch the user
        const fetchedUser = await User.findOne({ userID: 'testUser123' });
        console.log('Fetched user:', fetchedUser);

        // Update the user
        const updatedUser = await User.findOneAndUpdate(
            { userID: 'testUser123' },
            { password: 'updatedHashedPassword123' },
            { new: true }
        );
        console.log('Updated user:', updatedUser);

        // Delete the user
        const result = await User.deleteOne({ userID: 'testUser123' });
        console.log('User deleted:', result);

        process.exit(0); // Exit the process once tests are done
    } catch (error) {
        console.error('Error during testing:', error);
        process.exit(1); // Exit with failure
    }
};

testUserModel();