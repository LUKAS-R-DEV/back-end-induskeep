import {Router } from 'express';
import * as PieceController from "./PieceController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";
import { validateUuidParam } from "../../../interface/middlewares/validateUuid.js";

const router=Router();

router.use(authMiddleware);

router.get("/",PieceController.getAll);
router.post("/",PieceController.create);
router.put("/:id", validateUuidParam(), PieceController.update);
router.delete("/:id", validateUuidParam(), PieceController.remove);
export default router;