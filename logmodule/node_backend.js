const axios = require('axios');

// Jupyter server details
const serverUrl = "http://localhost:8888";  // Replace with your Jupyter server URL
const token = "your_token_here";  // Replace with your Jupyter token

// Function to execute a specific code in Jupyter Notebook
async function executeCell(kernelId, code) {
    const execUrl = `${serverUrl}/api/kernels/${kernelId}/execute`;
    const headers = { Authorization: `Token ${token}` };
    const data = { code: code };

    try {
        const response = await axios.post(execUrl, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Error executing cell:", error);
    }
}

// Example: Start a new kernel and execute a code cell
async function startAndExecute() {
    // Create a new kernel
    const kernelResponse = await axios.post(`${serverUrl}/api/kernels`, {}, { headers: { Authorization: `Token ${token}` } });
    const kernelId = kernelResponse.data.id;
    
    // Code to execute
    const code = "print('Hello from specific cell!')";
    
    // Execute the code
    const result = await executeCell(kernelId, code);
    console.log("Cell Execution Result:", result);
}

startAndExecute();