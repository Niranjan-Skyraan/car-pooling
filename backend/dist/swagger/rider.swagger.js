"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.riderSwaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const riderSwaggerOptions = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Carpooling Rider API",
            version: "1.0.0",
            description: "API documentation for the Carpooling Rider application",
        },
        servers: [
            {
                url: `${process.env.SERVER_URL || "http://localhost:5000"}`,
                description: "Local server",
            },
        ],
        tags: [
            {
                name: "Rider Authentication",
                description: "Rider signup and login APIs",
            },
            {
                name: "Rider",
                description: "Rider APIs",
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
        "./src/routes/rider/**/*.ts",
    ],
};
exports.riderSwaggerSpec = (0, swagger_jsdoc_1.default)(riderSwaggerOptions);
