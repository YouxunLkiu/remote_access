const fs = require('fs');
const path = require('path');
//Making a default header for error Message
const errmsg = 'Error occured in logprocess.js'


const parentDir = path.dirname(__filename);

console.log(parentDir);

//Storing all of my log's path in a .txt file. 
const logsDirectoryPath = path.join(__dirname, "logtrackers/logs")
const logPathsFile = path.join(__dirname, "logtrackers/logs", "logpaths.txt")
const projectsDirectoryPath = path.join(__dirname, "logtrackers/proj_status")
const projectsStatusFile = path.join(__dirname, "logtrackers/proj_status", "projects.txt")






//Function that returns a log's path for further processing 
function readLogPaths() {
    try {
        const logPaths = fs.readFileSync(logPathsFile, 'utf-8').split('\n').filter(Boolean);
        return logPaths;
    } catch (err) {
        console.error('Error reading logpath.txt:', errmsg, err);
        return [];
    }
}

//Functions that returns a list of running projects.
function readliveProjects() {
    try {
        const projects = fs.readFileSync(projectsStatusFile, 'utf-8').split('\n').filter(Boolean);
        return projects;
    } catch (err) {
        console.error('Error reading project.txt:', errmsg, err);
        return []
    }
}


function processLogs() {
    const logPaths = readLogPaths();
    if (logPaths.length === 0) {
        console.log("No log paths found! ")
        return;
    }
    console.log(logPaths);

    logPaths.forEach(logPath => {
        console.log(`Processing log: ${logPath}`)
        let curlog = path.join(logsDirectoryPath, logPath)
        if (fs.existsSync(curlog)) {
            let logData = fs.readFileSync(curlog, 'utf-8');
            console.log(`Log Content from ${curlog}:\n`, logData);
        } else {
            console.log(`Log file ${curlog} does not exist.`);
        }
    });
    
}


/** Show the all writen log path from a on going project id
 * @param {string} projID 
 * @returns {string}
 */
function showlogs(projID) {
    const logPaths = readLogPaths();
    const liveProjects = readliveProjects();
    if (logPaths.length === 0) {
        console.log("LiveProjects file does not exist.")
        return;
    } else if (liveProjects.includes(projID)) {
        //fetching the live project's log IDs
        const liveProject = path.join(projectsDirectoryPath, `${projID}.txt`)
        const logData = fs.readFileSync(liveProject, 'utf-8');

        //spliting each id into a list
        const logID = logData.split('\n').map(str => str.trim());
        const projectLogPaths = logID.map((str, index) => `${projID}_${str}`);
        console.log(projectLogPaths);
    } else {
        console.log(`The project with id: ${projID} is not tracked with this system.`);
        return;
    }
}

processLogs();
console.log("trying other shit");
console.log("trying other shit");
console.log("trying other shit");
console.log("trying other shit");
showlogs("projectatke");