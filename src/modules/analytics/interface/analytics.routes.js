import { Router } from "express";
import * as AnalyticsController from "./AnalyticsController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", AnalyticsController.getReport);

export default router;
