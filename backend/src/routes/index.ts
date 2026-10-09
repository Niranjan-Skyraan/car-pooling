import { Router } from "express";

import driverRoutes from "./driver/index.js";
import riderRoutes from "./rider/index.js";

const router = Router();

router.use("/driver", driverRoutes);
router.use("/rider", riderRoutes);

export default router;