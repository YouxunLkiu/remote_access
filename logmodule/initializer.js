const fs = require('fs');
const path = require('path');

async function initializeLogSystem() {
    try {
        const logTrackerDirectoryPath = path.join(__dirname, 'logtrackers'); 
        // Check if the directory exists, and create it if it doesn't
        if (!fs.existsSync(logTrackerDirectoryPath)) {
            console.log('Creating logTracker directory...');
            await fs.promises.mkdir(logTrackerDirectoryPath); // Asynchronously create the directory
        } else {
            console.log('Logs directory already exists.');
        }
        const logsDirectoryPath = path.join(__dirname, 'logtrackers/logs'); 
        // Check if the directory exists, and create it if it doesn't
        if (!fs.existsSync(logsDirectoryPath)) {
            console.log('Creating logs directory...');
            await fs.promises.mkdir(logsDirectoryPath); // Asynchronously create the directory
        } else {
            console.log('Logs directory already exists.');
        }

        let logtxtpath = path.join(logsDirectoryPath, 'logpaths.txt');

        // Check if the logpaths.txt file exists, and create it if it doesn't
        if (!fs.existsSync(logtxtpath)) {
            console.log('Creating logpaths.txt file...');
            await fs.promises.writeFile(logtxtpath, ''); // Asynchronously create an empty logpaths.txt file
        } else {
            console.log('logpaths.txt file already exists.');
        }






        const ProjectsDirectoryPath = path.join(__dirname, 'logtrackers/proj_status'); 
        // Check if the directory exists, and create it if it doesn't
        if (!fs.existsSync(ProjectsDirectoryPath)) {
            console.log('Creating proj_status directory...');
            await fs.promises.mkdir(ProjectsDirectoryPath); // Asynchronously create the directory
        } else {
            console.log('Logs directory already exists.');
        }

        const projectTxtpath = path.join(ProjectsDirectoryPath, 'project.txt');

        // Check if the logpaths.txt file exists, and create it if it doesn't
        if (!fs.existsSync(projectTxtpath)) {
            console.log('Creating project.txt file...');
            await fs.promises.writeFile(projectTxtpath, ''); // Asynchronously create an empty logpaths.txt file
        } else {
            console.log('project.txt file already exists.');
        }


    } catch (err) {
        console.error('Error initializing log system:', err);
    }
}





// Specify the path for logs
initializeLogSystem(logsDirectoryPath);