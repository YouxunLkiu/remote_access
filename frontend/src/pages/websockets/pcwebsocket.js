import React, { useEffect } from "react";

const PCWebSocketClient = ({ username, pcID }) => {
  useEffect(() => {
    const ws = new WebSocket(`ws://centralserver.com?pcID=${pcID}&type=pc`);

    ws.onopen = () => {
      console.log(`User(${username}) on PC (${pcID}) connected to the central server`);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received from central server:", message);

      if (message.action === "initiate_training") {
        console.log(`Starting training on PC (${pcID})...`);
        // Here, you could trigger a local shell script or API call to start the training.
      }
    };

    ws.onclose = () => {
      console.log("PC WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [pcID]);

  return <div>PC WebSocket Client Active</div>;
};

export default PCWebSocketClient;