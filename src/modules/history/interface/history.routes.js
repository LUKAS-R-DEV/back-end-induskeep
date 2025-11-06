import { Router } from "express";
import * as HistoryController from "./HistoryController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";
import { requirePermission } from "../../../infrastructure/security/requirePermission.js";

const router = Router();

router.use(authMiddleware);

// Apenas supervisor e admin podem ver histórico (técnico não tem VIEW_HISTORY)
router.get("/", requirePermission("VIEW_HISTORY"), HistoryController.getAll);
router.get("/order/:id", requirePermission("VIEW_HISTORY"), HistoryController.getByOrder);
router.post("/", HistoryController.create);

export default router;