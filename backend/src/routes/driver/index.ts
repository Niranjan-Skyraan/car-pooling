import { Router } from "express";

import authRoutes from "./auth.routes.js";

const driverRouter = Router();

driverRouter.use("/auth", authRoutes);

export default driverRouter;