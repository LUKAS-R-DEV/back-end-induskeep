import { Router } from "express";
import * as StockController from "./StockController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/movements", StockController.getAll);
router.get("/piece/:pieceId", StockController.getByPiece);
router.post("/", StockController.create);

export default router;