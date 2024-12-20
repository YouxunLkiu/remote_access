const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// In-memory storage for training app data
const trainingApps = {};

// Endpoint: Receive updates from training applications
app.post('/update', (req, res) => {
    const { id, status, params } = req.body;

    if (!id) {
        return res.status(400).send('Training application ID is required.');
    }

    trainingApps[id] = { status, params, lastUpdated: new Date() };

    console.log(`Received update from ${id}:`, trainingApps[id]);
    res.send('Update received.');
});

// Endpoint: Get status of all training applications
app.get('/apps', (req, res) => {
    res.json(trainingApps);
});

// Load SSL/TLS Certificates
const privateKey = fs.readFileSync(path.join(__dirname, 'key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'cert.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Start HTTPS Server
const PORT = 443; // Default HTTPS port
https.createServer(credentials, app).listen(PORT, () => {
    console.log(`Central monitoring server running securely on https://localhost:${PORT}`);
});
