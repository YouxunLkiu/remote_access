import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";  
import PCWebSocketClient from "../websockets/pcwebsocket";
import { v4 as uuidv4 } from "uuid";
import '../../styles/globals.css';

// AddProjectModal Component
const AddProjectModal = ({ isOpen, onClose, addProject }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  
  const [wsClient, setWsClient] = useState(null);
  const router = useRouter();  // Initialize the useRouter hook
  const { userID } = router.query;    
  const uniqueID = uuidv4();
  const os = require("os");
  const crypto = require("crypto");
  
  const systemInfo = {
      hostname: os.hostname(),
      cpu: os.cpus(),
      platform: os.platform(),
      release: os.release(),
      totalMem: os.totalmem()
  };

  const uniqueId = crypto.createHash("sha256").update(JSON.stringify(systemInfo)).digest("hex");

  useEffect(() => {
    // Check if userID exists before fetching
    if (!userID) return;
    const client = new PCWebSocketClient(userID, "trainer", uniqueId);


    client.connect();

    setWsClient(client);// Register a message handler
    client.onMessage((message) => {
      console.log("Received WebSocket message:", message);

      // Handle different message types
      if (message.action === "training_status") {
        alert(`Training Status: ${message.status}`);
      }
    });
    // Check already registered data initially (only once on mount)
  
    return () => {
      client.close();
    };
    
  }, [userID]); 


  

  const handleSubmit = async () => {
    if (!projectName || !projectDescription) {
      alert("Project name and description are required.");
      return;
    }

    const response = await fetch("/api/addProject", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem(`${userID}trainertoken`)}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({userID : userID, projectName: projectName, projectDescription:projectDescription, pcid: wsClient.pcid}),
    });

    if (response.ok) {
      alert("Project added successfully!");
      addProject(projectName, projectDescription); // Optionally update the UI with the new project
      onClose();
    } else {
      const data = await response.json();
      alert(`Error: ${data.message}`);
    }
  };


  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-grey-300 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl text-black font-semibold mb-4">Add New Project</h2>
        <div>
          <label className="block text-sm text-black font-medium">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-2 border text-black border-gray-300 rounded mb-4"
            placeholder="Enter project name"
          />
        </div>
        <div>
          <label className="block text-black text-sm font-medium">Project Description</label>
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="w-full p-2 border text-black border-gray-300 rounded mb-4"
            placeholder="Enter project description"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};


// Dashboard.jsx (Parent Component)
const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const router = useRouter();  // Initialize the useRouter hook
  const { userID } = router.query;
  const handleAddProject = (projectName, projectDescription) => {
    // Optionally, add the new project to the local state
    setProjects([...projects, { projectName, projectDescription }]);
  };
  const testerButton = async () => {
    console.log(sessionStorage.getItem(`${userID}trainertoken`))
  };

  return (
    <div className=" min-h-screen bg-primary text-white">
      {/* Projects List */}
      <div className="flex items-start justify-between">
        <h2 className="text-xl mx-4 my-4 font-bold mb-4 px-5">My Projects</h2>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="button-primary-light mx-8 my-4"
        >
          Add Project
        </button>

        {/* Add Project Modal */}
        <AddProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          addProject={handleAddProject}
        />
      </div>
      <div> 
          <button
            onClick= {() => testerButton()}>
              clickme
          </button>
        </div>
      <div className="flex p-6 px-2  mx-10 my-4 max-w-7xl mx-auto">
        <ul>
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <li key={index} className="mb-2">
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-semibold">{project.projectName}</h3>
                  <p>{project.projectDescription}</p>
                </div>
              </li>
            ))
          ) : (
            <p>No projects added yet.</p>
          )}
        </ul>
      </div>  
    </div>
  );
};

export default Dashboard;