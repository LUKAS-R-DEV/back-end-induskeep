import {Router } from 'express';
import * as PieceController from "./PieceController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";

const router=Router();

router.use(authMiddleware);

router.get("/",PieceController.getAll);
router.post("/",PieceController.create);
router.put("/:id",PieceController.update);
router.delete("/:id",PieceController.remove);
export default router;