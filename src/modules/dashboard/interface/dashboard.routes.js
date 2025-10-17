import { Router } from "express";
import * as DashboardController from "./DashboardController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";

const router = Router();
router.use(authMiddleware);
router.get("/", DashboardController.getDashboardData);
export default router;