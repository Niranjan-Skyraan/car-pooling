import express from "express";
import cors from "cors";
import { riderSwaggerSpec } from "./swagger/rider.swagger.js";
import { driverSwaggerSpec } from "./swagger/driver.swagger.js";
import swaggerUi from "swagger-ui-express";
import routes from "./routes/index.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

// Allow requests from other origins
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));
app.use(
  "/api-docs/rider",
  swaggerUi.serveFiles(riderSwaggerSpec),
  swaggerUi.setup(riderSwaggerSpec)
);

app.use(
  "/api-docs/driver",
  swaggerUi.serveFiles(driverSwaggerSpec),
  swaggerUi.setup(driverSwaggerSpec)
);

app.use("/api", routes);
app.get("/", (_req, res) => {
 res.send("welcome")
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


export default app;
