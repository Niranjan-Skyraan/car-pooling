"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const rider_swagger_js_1 = require("./swagger/rider.swagger.js");
const driver_swagger_js_1 = require("./swagger/driver.swagger.js");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const index_js_1 = __importDefault(require("./routes/index.js"));
const app = (0, express_1.default)();
// Allow requests from other origins
app.use((0, cors_1.default)());
// Parse JSON request bodies
app.use(express_1.default.json());
// Parse URL-encoded request bodies
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api-docs/rider", swagger_ui_express_1.default.serveFiles(rider_swagger_js_1.riderSwaggerSpec), swagger_ui_express_1.default.setup(rider_swagger_js_1.riderSwaggerSpec));
app.use("/api-docs/driver", swagger_ui_express_1.default.serveFiles(driver_swagger_js_1.driverSwaggerSpec), swagger_ui_express_1.default.setup(driver_swagger_js_1.driverSwaggerSpec));
app.use("/api", index_js_1.default);
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is running",
    });
});
/*
 * 404 Handler
 */
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
exports.default = app;
