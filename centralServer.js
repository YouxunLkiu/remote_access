const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./models/user');
const TrainingLog = require('./models/monitor');
const Command = require('./models/command');
const connectDB = require('./config/db');
const app = express();


app.use(express.json());
require('dotenv').config({ path: './seckey.env' });
const JWT_SECRET = process.env.JWT_SECRET;


//Running database initializer
connectDB();
//making sure the server is running

// Initialize the port variable before use
// Start HTTPS Server
const PORT = 3000; // Default HTTPS port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


//------------------------------------User Login Endpoint Functions---------------------------------
/**
 * 
 */
app.post('/login', async (req, res) => {
    const { userID, password } = req.body;

    if (!userID || !password) {
        return res.status(400).send('All fields are required.');
    }

    try {
        // Find the user in the database
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).send('User not found.');
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid credentials.');
        }

        // Generate JWT
        const token = jwt.sign({ userID: user.userID }, JWT_SECRET, { expiresIn: '1h' });

        // Send response
        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during login.');
    }
});

// Middleware to verify JWT (for protected routes)
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; // Expecting 'Bearer <token>'
    if (!token) {
        return res.status(401).send('Access denied.');
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token.');
        }
        req.user = user;
        next();
    });
}


//------------------------------------User status Functions---------------------------------

// Status route to get login account details
app.get('/status', authenticateToken, async (req, res) => {
    try {
        // Retrieve the userID from the JWT (set by authenticateToken middleware)
        const userID = req.user.userID;

        // Find the user in the database
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).send('User not found.');
        }

        // Respond with user details (excluding sensitive info like password)
        res.status(200).json({
            message: 'User authenticated successfully.',
            user: {
                userID: user.userID,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching user status.');
    }
});









//User Registration response
app.post('/register', async (req, res) => {
    const { userID, password, roles } = req.body;

    if (!userID || !password) {
        return res.status(400).send('All fields are required.')
    }

    try {
        //yet to be completed
        const existingUser = await User.findOne({ userID });
        if (existingUser) {
            return res.status(400).send('User with this userID has been created.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            userID, 
            password: hashedPassword,
            roles: roles || ['mobile', 'trainer']
        });

        await newUser.save();

        //creat a JWT token
        const token = jwt.sign({ userID }, 'your-secret-key', { expiresIn: '1h' });

        // Send the response
        res.status(201).json({
            message: 'User registered successfully!',
            token,
        });

    }  catch (error) {
        console.error(error);
        res.status(500).send('Error during registration.');
    }
    
});







//----------------------- Main Functions -------------------

/** This is used for authentication of the user account status */
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).send('Invalid token.');
    }
};
// Example: Check for "trainer" or "mobile" role (maybe not needed )
const authorizeRole = (roles) => (req, res, next) => {
    if (!req.user.roles || !roles.some(role => req.user.roles.includes(role))) {
        return res.status(403).send('Access denied.');
    }
    next();
};

//User role updates
app.put('/users/:userID/roles', authenticate, async (req, res) => {
    const { userID } = req.params;
    const { roles } = req.body;

    if (!roles || !Array.isArray(roles)) {
        return res.status(400).send('Roles must be an array.');
    }

    try {
        const user = await User.findOneAndUpdate(
            { userID },
            { $addToSet: { roles: { $each: roles } } }, // Add roles without duplicates
            { new: true }
        );

        if (!user) {
            return res.status(404).send('User not found.');
        }

        res.json({ message: 'Roles updated successfully.', user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating roles.');
    }
});



// GET /logs: Read log messages (Mobile)
app.get('/logs', authenticate, authorizeRole(['mobile']), async (req, res) => {
    try {
        const logs = await Log.find(); // Assuming you have a Log model
        res.json(logs);
    } catch (err) {
        res.status(500).send('Failed to fetch logs.');
    }
});

//POST /logs: Write log message (Trainer)
app.post('/logs', authenticate, authorizeRole(['trainer']), async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).send('Message is required.');
    }

    try {
        const log = new Log({ message, createdBy: req.user.userID });
        await log.save();
        res.status(201).send('Log saved successfully.');
    } catch (err) {
        res.status(500).send('Failed to save log.');
    }
});


//------------------------EXECUTATBALE COMMAND(TODO)--------------------------------------
// POST /execute-command: Execute commands (Trainer)
app.post('/execute-command', authenticate, authorizeRole(['trainer']), async (req, res) => {
    const { command } = req.body;

    if (!command) {
        return res.status(400).send('Command is required.');
    }

    try {
        const result = await executeCommand(command); // Call the service
        res.status(200).json({ result });
    } catch (err) {
        res.status(500).send('Command execution failed.');
    }
});

// GET /execution-status: Get command execution status (Mobile)
app.get('/execution-status', authenticate, authorizeRole(['mobile']), async (req, res) => {
    try {
        const status = await getExecutionStatus(); // Call a service or fetch from DB
        res.json(status);
    } catch (err) {
        res.status(500).send('Failed to fetch execution status.');
    }
});




//-----------------------Endpoint TESTING: Endpoint testing mongoD connection-------------------

app.get('/test-db', async (req, res) => {
    try {
        const users = await User.find();  // Query the 'users' collection
        if (users.length > 0) {
            res.status(200).json({ message: "Successfully connected to MongoDB", users });
        } else {
            res.status(404).json({ message: "No users found in the database", users });
        }
    } catch (error) {
        console.error("Error connecting to the database:", error);
        res.status(500).json({ message: "Database connection failed", error: error.message });
    }
});
