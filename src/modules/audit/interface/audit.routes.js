import { Router } from "express";
import * as AuditLogController from "./AuditLogController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

// GET /api/audit?page=1&pageSize=20&module=MACHINE&action=CREATE&userId=<uuid>
router.get("/", AuditLogController.list);

// POST /api/audit/purge { "olderThan": "2025-01-01T00:00:00.000Z" }
router.post("/purge", AuditLogController.purge);

export default router;
