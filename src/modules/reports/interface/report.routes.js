// src/modules/reports/interface/report.routes.js
import { Router } from "express";
import * as ReportController from "./ReportController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";
import { requireSupervisorOrAdmin } from "../../../infrastructure/security/requireSupervisorOrAdmin.js";
const router = Router();
router.use(authMiddleware);



router.get("/overview",requireSupervisorOrAdmin,ReportController.getOverview);
router.get("/history",requireSupervisorOrAdmin,ReportController.getHistory);
router.get("/export",requireSupervisorOrAdmin,ReportController.exportReport);

export default router;
