import "dotenv/config";
import http from "http";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { initializeWebSocket } from "./websocket/websocket.server.js";


const PORT = Number(process.env.PORT) || 5000;

// Create HTTP server
// Express handles HTTP requests through this server.
const server = http.createServer(app);

//Initialize WebSocket
// WebSocket uses the same HTTP server.
const wss = initializeWebSocket(server);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase();
    // Start HTTP + WebSocket server
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`WebSocket running on ws://localhost:${PORT}`);
      console.log(`Swagger Docs Path: ${process.env.SERVER_URL || "http://localhost:5000"}/api-docs`);
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
};

startServer();
