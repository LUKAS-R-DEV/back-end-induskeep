import { Router } from "express";
import * as HistoryController from "./HistoryController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", HistoryController.getAll);
router.get("/order/:id", HistoryController.getByOrder);
router.post("/", HistoryController.create);

export default router;