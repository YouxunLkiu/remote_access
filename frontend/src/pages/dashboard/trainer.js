import React, { useState } from "react";
import { useRouter } from "next/router";  

// AddProjectModal Component
const AddProjectModal = ({ isOpen, onClose, addProject }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  
  const router = useRouter();  // Initialize the useRouter hook
  const { userID } = router.query;    

  const handleSubmit = async () => {
    if (!projectName || !projectDescription) {
      alert("Project name and description are required.");
      return;
    }

    const token = sessionStorage.getItem("token");
    const response = await fetch("/api/addProject", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({userID, projectName, projectDescription }),
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
        <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
        <div>
          <label className="block text-sm font-medium">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Enter project name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Project Description</label>
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
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

  const handleAddProject = (projectName, projectDescription) => {
    // Optionally, add the new project to the local state
    setProjects([...projects, { projectName, projectDescription }]);
  };

  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Projects List */}
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-bold mb-4 px-5">My Projects</h2>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="button-primary-light"
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
      <div className="flex p-6 px-2 max-w-7xl mx-auto">
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