const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('./models/user');
const TrainingLog = require('./models/monitor');
const Command = require('./models/command');
const connectDB = require('./config/db');
const app = express();
const logger = require('./logger');
const executePythonFile = require('./services/commandExecutor');

app.use(express.json());
app.use(cookieParser());
require('dotenv').config({ path: './seckey.env' });
const JWT_SECRET = process.env.JWT_SECRET;


//Running database initializer
connectDB();
//making sure the server is running

// Initialize the port variable before use
// Start HTTPS Server
const PORT = 4000; // Default HTTP port for backend
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// ---------------------------------Middleware functions
function refreshToken(req, res, next) {
    const token = req.cookies.authToken;  // Get token from cookies (or header if you prefer)

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.'});
    }

    // Verify and decode the token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.'});
        }

        // Here, you can refresh the token when the user performs an action
        // For example, you can generate a new token with an extended expiration time
        const newToken = jwt.sign(
            { userID: user.userID, roles: user.roles }, // Include relevant user data in the new token
            JWT_SECRET,
            { expiresIn: '1h' }  // Set new expiration time (1 hour here)
        );

        // Send the new token back to the client (you can send it in a cookie or as a response header)
        res.cookie('authToken', newToken, { httpOnly: true, secure: true }); // Set new token in cookie (for example)
        
        next();
    });
}

















//------------------------------------User Auth Endpoint Functions---------------------------------
/**
 * 
 */
app.post('/login', async (req, res) => {
    
    const { userID, password } = req.body;
    
    if (!userID || !password) {
        return res.status(400).json({ message: 'All fields are required.'});
    }
    
    try {
        // Find the user in the database
        const user = await User.findOne({ userID });
       
        if (!user) {
            console.log("User is not found");
            return res.status(404).json({ message: 'User not found.'});

        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.'});
        }
       
        // Generate JWT
        const token = jwt.sign({ userID: userID, roles: user.roles || ['mobile', 'trainer'] }, JWT_SECRET, { expiresIn: '1h' });

        // Storing the token to cookie
        res.cookie('authToken', token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Ensures secure cookies in production
            sameSite: 'strict', // CSRF protection
            maxAge: 3600000 // Cookie expiration (1 hour)
        });
        // Send response
        res.status(200).json({ message: 'Login successful!', token });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during login.'});
    }
});

// Middleware to verify JWT (for protected routes)
function authenticateToken(req, res, next) {
    // Extract token from cookies (assuming the cookie name is 'authToken')
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.'});
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.'});
        }

        req.user = user;  // Store user data in the request object

        // If you want to do something when a user logs in, like updating a last login time
        // or checking other user data, you can handle it here

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
            return res.status(404).json({ message: 'User not found.'});
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
        res.status(500).json({ message: 'Error fetching user status.'});
    }
});




//User Registration response
app.post('/register', async (req, res) => {
    const { userID, password, roles } = req.body;

    if (!userID || !password) {
        return res.status(400).json({ message: 'All fields are required.'})
    }

    try {
        //yet to be completed
        const existingUser = await User.findOne({ userID });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this userID has been created.'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            userID, 
            password: hashedPassword,
            roles: roles || ['mobile', 'trainer']
        });

        await newUser.save();

        //creat a JWT token
        const token = jwt.sign({ userID: userID, roles: roles || ['mobile', 'trainer'] }, 'your-secret-key', { expiresIn: '1h' });
        
        // Storing the token to cookie
        res.cookie('authToken', token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Ensures secure cookies in production
            sameSite: 'strict', // CSRF protection
            maxAge: 3600000 // Cookie expiration (1 hour)
        });
        // Send the response
        res.status(201).json({
            message: 'User registered successfully!',
            token,
        });

    }  catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during registration.'});
    }
    
});







//----------------------- Main Functions -------------------

/** This is used for authentication of the user account status */
const authenticate = (req, res, next) => {
    const token = req.cookies.authToken; // Replace 'authToken' with the name of your cookie
    console.log(req);
    if (!token) {
        logger.error('No token provided in the request.');
        return res.status(401).json({ message: 'Access denied. No token provided.'});
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        logger.error(`Token verification failed: ${err.message}`);
        res.status(403).json({ message: 'Invalid token.'});
    }
};
// Example: Check for "trainer" or "mobile" role (maybe not needed )
const authorizeRole = (roles) => (req, res, next) => {
    if (!req.user.roles || !roles.some(role => req.user.roles.includes(role))) {
        return res.status(403).json({ message: 'Access denied. Current account is not allowed to perform such task.'});
    }
    next();
};

//User role updates
app.put('/users/:userID/roles', authenticate, refreshToken, async (req, res) => {
    const { userID } = req.params;
    const { roles } = req.body;

    if (!roles || !Array.isArray(roles)) {
        return res.status(400).json({ message: 'Roles must be an array.'});
    }

    try {
        const user = await User.findOneAndUpdate(
            { userID },
            { $addToSet: { roles: { $each: roles } } }, // Add roles without duplicates
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found.'});
        }

        res.json({ message: 'Roles updated successfully.', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating roles.'});
    }
});



// GET /logs: Read log messages (Mobile)
app.get('/logs', authenticate, authorizeRole(['mobile']), refreshToken,  async (req, res) => {
    try {
        if (Object.keys(req.body).length === 1) {
            const { userID } = req.body;
            const logs = await TrainingLog.find({ userID: userID }); // Assuming you have a Log model
            res.json(logs);
        } else if (Object.keys(req.body).length === 2) {
            const { userID, appID } = req.body;
            const logs = await TrainingLog.find({ userID: userID, appID: appID }); // Assuming you have a Log model
            res.json(logs);
        } else {
            res.status(400).json({ message: 'Invalid request format. Please provide userID and optionally appID.'});
        }

    } catch (err) {
        logger.error(`Failed to fetch logs: ${err.message}`);
        res.status(500).json({ message: 'Failed to fetch logs from using userID. Check userID. '});
    }
    
});

//POST /logs: Write log message (Trainer)
app.post('/logs', authenticate, authorizeRole(['trainer']), refreshToken, async (req, res) => {
    const { appID, status, message } = req.body;

    if (!message) {
        logger.warn('Full log message is missing.');
        return res.status(400).json({ message: 'Full log message is required.'});
    }

    try {
        const log = new TrainingLog({ userID: req.user.userID, appID: appID, 
            status: status, full_log: message
        });
        await log.save();
        logger.info(`Log created successfully for user: ${req.user.userID} with appID: ${appID}`);
        
        res.status(201).json({ message: 'Log saved successfully.'});
    } catch (err) {
        logger.error(`Failed to save log: ${err.message}`);
        res.status(500).json({ message: 'Failed to save log.'});
    }
});



//------------------------Mobile Dashboard Functions(TODO)--------------------------------

// This function will fetch all of the connected trainer from this account.
app.post('/mobileDB', authenticate, authorizeRole(['mobile']), refreshToken, async (req, res) => {
    const { userID } = req.body;
    //TODO: Currently possess the userID, need to fetch all infos


});


//------------------------Trainer Dashboard Functions(TODO)--------------------------------
app.post('/trainerDB',authenticate, authorizeRole(['trainer']), refreshToken, async (req, res) => {

});



//bellow functions keeps the trainer alive and not sleep while it is training.
app.post("/api/trainer/keepalive", (req, res) => {
    const { trainerID } = req.body;
  
    if (!trainerID) {
      return res.status(400).json({ message: "Missing trainerID" });
    }
  
    // Update the trainer's last active time
    trainerStatus[trainerID] = Date.now();
  
    console.log(`Trainer ${trainerID} is active`);
    res.status(200).json({ message: "Keep-alive received" });
  });
  
  // Endpoint to check if a trainer is active
  app.get("/api/trainer/status/:trainerID", (req, res) => {
    const { trainerID } = req.params;
  
    if (!trainerID) {
      return res.status(400).json({ message: "Missing trainerID" });
    }
  
    const lastActive = trainerStatus[trainerID];
    const now = Date.now();
    const isActive = lastActive && now - lastActive < 60000; // Active if last heartbeat was within 1 minute
  
    res.status(200).json({ trainerID, isActive });
  });



  // Register a training machine
app.post("/api/training/register", authenticate, authorizeRole(['trainer']), refreshToken, async (req, res) => {
    const { userID, machineID, machineIP } = req.body;
  


    if (!users[userID]) {
      return res.status(404).json({ error: "User not found" });
    }
  
    trainingMachines[userID] = { machineID, machineIP };
    return res.status(200).json({ message: "Training machine registered successfully" });
  });
  
  // Start training
  app.post("/api/training/start", async (req, res) => {
    const { userID, token, params } = req.body;
  
    if (!users[userID] || users[userID].token !== token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    const machine = trainingMachines[userID];
    if (!machine) {
      return res.status(404).json({ error: "No registered training machine" });
    }
  
    try {
      const response = await fetch(`http://${machine.machineIP}:5000/start-training`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const result = await response.json();
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error starting training:", error);
      return res.status(500).json({ error: "Failed to start training" });
    }
  });
  
  // Fetch logs
  app.get("/api/training/logs", async (req, res) => {
    const { userID, token } = req.query;
  
    if (!users[userID] || users[userID].token !== token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    const machine = trainingMachines[userID];
    if (!machine) {
      return res.status(404).json({ error: "No registered training machine" });
    }
  
    try {
      const response = await fetch(`http://${machine.machineIP}:5000/fetch-logs`);
      const logs = await response.json();
      return res.status(200).json(logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      return res.status(500).json({ error: "Failed to fetch logs" });
    }
  });
  
  // Stop training
  app.post("/api/training/stop", async (req, res) => {
    const { userID, token } = req.body;
  
    if (!users[userID] || users[userID].token !== token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    const machine = trainingMachines[userID];
    if (!machine) {
      return res.status(404).json({ error: "No registered training machine" });
    }
  
    try {
      const response = await fetch(`http://${machine.machineIP}:5000/stop-training`, {
        method: "POST",
      });
      const result = await response.json();
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error stopping training:", error);
      return res.status(500).json({ error: "Failed to stop training" });
    }
  });


//------------------------EXECUTATBALE COMMAND(TODO)--------------------------------------
// POST /execute-command: Execute commands (Trainer)
app.post('/execute-command', authenticate, authorizeRole(['trainer']), refreshToken, async (req, res) => {
    const { filePath, args } = req.body;

    if (!filePath) {
        return res.status(400).json({ message: 'Python file path is required.'});
    }
    try {
        const result = await executePythonFile(filePath, args || []);
        res.status(200).json({ result });
    } catch (err) {
        logger.error(`Failed to execute command: ${err.message}`);
        res.status(500).json({ message: 'Command execution failed.'});
    }
});

// GET /execution-status: Get command execution status (Mobile)
app.get('/execution-status', authenticate, authorizeRole(['mobile']), async (req, res) => {
    try {
        const status = await getExecutionStatus(); // Call a service or fetch from DB
        res.json(status);
    } catch (err) {
        logger.error(`Failed to get command status: ${err.message}`);
        res.status(500).json({ message: 'Failed to fetch execution status.'});
    }
});


// ----------------------Socket Connection -----------------------------


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
