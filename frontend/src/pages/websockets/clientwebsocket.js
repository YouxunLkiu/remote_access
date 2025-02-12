import React, { useEffect } from "react";

  class WebSocketClient {
    constructor(username, type) {
      this.username = username;
      this.type = type;
      this.ws = null;
    }
  
    connect() {
      if (this.ws == null) {
        this.ws = new WebSocket("ws://localhost:4000");
      }
   
  
      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.sendMessage("check-in", { message: "try-connection" });
      };
  
      this.ws.onmessage = (event) => {
        console.log("Received: on open", event.data);
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
        this.ws.send(JSON.stringify({ action, username: this.username, type: this.type, ...payload }));
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
  
  export default WebSocketClient;
  