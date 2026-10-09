"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWebSocket = void 0;
const ws_1 = require("ws");
const initializeWebSocket = (server) => {
    const wss = new ws_1.WebSocketServer({
        server,
    });
    wss.on("connection", (socket, request) => {
        console.log("WebSocket client connected");
        console.log("Client IP:", request.socket.remoteAddress);
        /*
         * Receive message
         */
        socket.on("message", (message) => {
            const data = message.toString();
            console.log("Received:", data);
            /*
             * Send response
             */
            socket.send(JSON.stringify({
                success: true,
                message: "Message received",
            }));
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
        socket.send(JSON.stringify({
            success: true,
            message: "WebSocket connected",
        }));
    });
    console.log("WebSocket server initialized");
    return wss;
};
exports.initializeWebSocket = initializeWebSocket;
