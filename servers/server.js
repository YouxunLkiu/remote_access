const axios = require('axios');

const CENTRAL_SERVER_URL = 'http://central-server.com:4000'; // Replace with your central server's URL
const TRAINING_APP_ID = 'app1'; // Unique identifier for this training application
const errmsg = "Error occured in server.js"

// Function to send updates to the central server
async function sendUpdateToCentralServer(status, params) {
    try {
        await axios.post(`${CENTRAL_SERVER_URL}/update`, {
            id: TRAINING_APP_ID,
            status,
            params,
        });
        console.log('Update sent to central server.');
    } catch (error) {
        console.error('Failed to send update to central server:', errmsg, error.message);
    }
}

// Example: Send update on training start/stop
app.post('/start', (req, res) => {
    // Existing start training logic...
    sendUpdateToCentralServer('running', trainingParams);
    res.send('Training started successfully.');
});

app.post('/stop', (req, res) => {
    // Existing stop training logic...
    sendUpdateToCentralServer('stopped', {});
    res.send('Training stopped successfully.');
});