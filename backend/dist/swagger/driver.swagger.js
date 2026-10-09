"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverSwaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const driverSwaggerOptions = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Carpooling Driver API",
            version: "1.0.0",
            description: "API documentation for the Carpooling Driver application",
        },
        servers: [
            {
                url: `${process.env.SERVER_URL || "http://localhost:5000"}`,
                description: "Local server",
            },
        ],
        tags: [
            {
                name: "Driver Authentication",
                description: "Driver signup and login APIs",
            },
            {
                name: "Driver",
                description: "Driver APIs",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: [
        "./src/routes/driver/**/*.ts",
    ],
};
exports.driverSwaggerSpec = (0, swagger_jsdoc_1.default)(driverSwaggerOptions);
