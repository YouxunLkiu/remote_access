import React, { useEffect } from "react";

  class PCWebSocketClient {
    constructor(username, type, pcid) {
      this.username = username;
      this.type = type;
      this.ws = null;
      this.pcid = pcid;
    }
  
    connect() {
      this.ws = new WebSocket("ws://localhost:4000");
  
      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.sendMessage("check-in", { message: "try-connection" });
      };
  
      this.ws.onmessage = (event) => {
        console.log("Received:", event.data);
      };
  
      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
      };
    }

    onMessage(handler) {
      console.log("message handled");
    }

  
    sendMessage(action, payload = {}) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ action, username: this.username, type: this.type, pcid: this.pcid, ...payload }));
      } else {
        console.error("WebSocket is not connected");
      }
    }
  
    close() {
      if (this.ws) {
        this.ws.close(1000, this.username);
      }
    }
  }
  
  export default PCWebSocketClient;
  