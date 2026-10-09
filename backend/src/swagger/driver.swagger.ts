import swaggerJsdoc from "swagger-jsdoc";

const driverSwaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Carpooling Driver API",
      version: "1.0.0",
      description: "API documentation for the Carpooling Driver application",
    },

    servers: [
      {
        url:  `${process.env.SERVER_URL || "http://localhost:5000"}`,
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

export const driverSwaggerSpec = swaggerJsdoc(driverSwaggerOptions);