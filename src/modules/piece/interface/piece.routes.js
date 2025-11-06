import {Router } from 'express';
import * as PieceController from "./PieceController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";
import { validateUuidParam } from "../../../interface/middlewares/validateUuid.js";
import { requirePermission } from "../../../infrastructure/security/requirePermission.js";

const router=Router();

router.use(authMiddleware);

router.get("/",PieceController.getAll);
router.get("/:id", validateUuidParam(), PieceController.getById);
router.post("/", requirePermission("CREATE_PIECE"), PieceController.create);
router.put("/:id", validateUuidParam(), requirePermission("UPDATE_PIECE"), PieceController.update);
router.delete("/:id", validateUuidParam(), requirePermission("DELETE_PIECE"), PieceController.remove);
export default router;