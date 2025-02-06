import React, { useEffect } from "react";

const WebSocketClient = ({ username, type }) => {
    useEffect(() => {
      // Corrected WebSocket URL with query parameters
     
      const ws = new WebSocket(`ws://localhost:4000`);
      ws.onopen = (action) => {
        console.log("Connected to the central server");
        
      };
  
      ws.onmessage = (event) => {
        console.log("Received from central server:", event.data);
      };
  
      ws.onclose = () => {
        console.log("WebSocket closed");
      };
  
      return () => {
        ws.close(); // Cleanup on component unmount
      };
    }, [username, type]); // Re-run when username or type changes
  
    return <div>WebSocket Client</div>;
  };
  
  export default WebSocketClient;
  