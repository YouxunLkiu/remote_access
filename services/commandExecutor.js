const { exec } = require('child_process');

const executeCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Command execution error: ${stderr}`);
                return reject(stderr);
            }
            resolve(stdout);
        });
    });
};

module.exports = { executeCommand };