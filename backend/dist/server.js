"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const app_js_1 = __importDefault(require("./app.js"));
const database_js_1 = require("./config/database.js");
const websocket_server_js_1 = require("./websocket/websocket.server.js");
const PORT = Number(process.env.PORT) || 5000;
// Create HTTP server
// Express handles HTTP requests through this server.
const server = http_1.default.createServer(app_js_1.default);
//Initialize WebSocket
// WebSocket uses the same HTTP server.
const wss = (0, websocket_server_js_1.initializeWebSocket)(server);
// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await (0, database_js_1.connectDatabase)();
        // Start HTTP + WebSocket server
        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`WebSocket running on ws://localhost:${PORT}`);
            console.log(`Swagger Docs Path: ${process.env.SERVER_URL || "http://localhost:5000"}/api-docs`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
