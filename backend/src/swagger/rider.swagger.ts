import swaggerJsdoc from "swagger-jsdoc";

const riderSwaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Carpooling Rider API",
      version: "1.0.0",
      description: "API documentation for the Carpooling Rider application",
    },

    servers: [
      {
        url:  `${process.env.SERVER_URL || "http://localhost:5000"}`,
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

export const riderSwaggerSpec = swaggerJsdoc(riderSwaggerOptions);