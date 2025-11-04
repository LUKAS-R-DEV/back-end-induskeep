// src/modules/reports/interface/report.routes.js
import { Router } from "express";
import * as ReportController from "./ReportController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";
import { requireAdmin } from "../../../infrastructure/security/requireAdmin.js";
const router = Router();
router.use(authMiddleware);



router.get("/overview",requireAdmin,ReportController.getOverview);
router.get("/history",requireAdmin,ReportController.getHistory);
router.get("/export",requireAdmin,ReportController.exportReport);

export default router;
