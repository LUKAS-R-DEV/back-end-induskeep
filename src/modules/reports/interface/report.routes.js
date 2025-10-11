// src/modules/reports/interface/report.routes.js
import { Router } from "express";
import * as ReportController from "./ReportController.js";

const router = Router();

router.get("/overview", ReportController.getOverview);
router.get("/history", ReportController.getHistory);
router.get("/export", ReportController.exportReport);

export default router;
