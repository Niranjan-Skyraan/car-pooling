import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

export const initializeWebSocket = (server: Server): WebSocketServer => {
  const wss = new WebSocketServer({
    server,
  });

  wss.on("connection", (socket: WebSocket, request) => {
    console.log("WebSocket client connected");

    console.log(
      "Client IP:",
      request.socket.remoteAddress
    );

    /*
     * Receive message
     */
    socket.on("message", (message) => {
      const data = message.toString();

      console.log("Received:", data);

      /*
       * Send response
       */
      socket.send(
        JSON.stringify({
          success: true,
          message: "Message received",
        })
      );
    });

    /*
     * Client disconnected
     */
    socket.on("close", () => {
      console.log("WebSocket client disconnected");
    });

    /*
     * WebSocket error
     */
    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    /*
     * Initial connection response
     */
    socket.send(
      JSON.stringify({
        success: true,
        message: "WebSocket connected",
      })
    );
  });

  console.log("WebSocket server initialized");

  return wss;
};
