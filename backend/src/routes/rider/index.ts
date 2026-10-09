import { Router } from "express";

import authRoutes from "./auth.routes.js";

const riderRouter = Router();

riderRouter.use("/auth", authRoutes);

export default riderRouter;