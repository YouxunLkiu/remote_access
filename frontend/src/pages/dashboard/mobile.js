// pages/dashboard.js
import { useState, useEffect} from "react";
import { useRouter } from "next/router";
import WebSocketClient from "../websockets/clientwebsocket";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  const [wsClient, setWsClient] = useState(null);
  const router = useRouter();
  const { userID } = router.query;
  const [programs, setPrograms] = useState([]);
 
 
  const dummyPrograms = [
    { id: 1, title: "Project A", details: "Details of Project A" },
    { id: 2, title: "Project B", details: "Details of Project B" },
    { id: 3, title: "Project C", details: "Details of Project C" },
  ];
  useEffect(() => {
    // Check if userID exists before fetching
    if (!userID) return;
    const client  = new WebSocketClient(userID, "mobile");






    client.connect();

    setWsClient(client);// Register a message handler
    client.onMessage((message) => {
      console.log("Received WebSocket message:", message);

      // Handle different message types
      if (message.action === "training_status") {
        alert(`Training Status: ${message.status}`);
      }
    });
    // Set the dummy data initially (only once on mount)
    setPrograms(dummyPrograms);

    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/dashboard_mobile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID }), // Ensure userID is passed
        });

        if (res.ok) {
          const data = await res.json();
          console.log("Dashboard Data:", data);
          setPrograms(data.programs); // Replace dummy data with fetched data
        } else {
          console.error("Failed to fetch dashboard data:", res.statusText);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }
    





    // Only fetch data if it's available
    fetchDashboardData();
    return () => {
      client.close();
    };
  }, [userID]); // Run this effect only when userID changes
  
  const handleAction = (programTitle) => {
    if (wsClient) {
      wsClient.sendMessage("initiate_training", { program: programTitle });
    }
  };


  return (
    <div className="bg-primary min-h-screen flex">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } md:block bg-primary text-white w-64 h-full p-5 fixed md:relative z-20`}
      >
        <h2 className="text-xl font-bold mb-6">Welcome {userID} </h2>
        <ul>
          <li>
            <a href="#" className="block py-2 px-4 rounded hover:bg-blue-700">
              Your Projects
              
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 px-4 rounded hover:bg-blue-700">
              Analytics
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 px-4 rounded hover:bg-blue-700">
              Settings
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div
        className={`${
          isSidebarOpen ? "ml-64" : "ml-0"
        } mx-4 py-6 md:ml-64 bg-primary`}
      >
        <div className="flex justify-between items-center mb-6">
        {/* Toggle Button for Mobile */}
        <button
            className="md:hidden bg-blue-800 text-white p-2 rounded"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
            {isSidebarOpen ? "Close Menu" : "Open Menu"}
        </button>
        <h1 className="text-2xl font-bold text-grey-200"> Your Projects</h1>
        </div>



        {/* Dashboard Widgets/Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
            <div key={program.id} className="bg-white p-6 rounded shadow-md">
              <h3 className="text-lg font-semibold mb-4">{program.title}</h3>
              <p>{program.details}</p>
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
                onClick={() => handleAction(program.title)}
              >
                Perform Action
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
