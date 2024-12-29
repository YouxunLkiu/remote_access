const { exec } = require('child_process');

const executePythonFile = (filePath, args = []) => {
    return new Promise((resolve, reject) => {
        const pythonCommand = `python ${filePath} ${args.join(' ')}`; // Adjust to 'python3' if needed
        exec(pythonCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Python execution error: ${stderr}`);
                return reject(stderr);
            }
            resolve(stdout.trim());
        });
    });
};

module.exports = executePythonFile ;