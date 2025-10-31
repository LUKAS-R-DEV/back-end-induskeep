import { Router } from "express";
import * as MaintenanceOrderController from "./MaintenanceOrderController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", MaintenanceOrderController.getAll);
router.get("/:id", MaintenanceOrderController.getById);
router.post("/", MaintenanceOrderController.create);
router.put("/:id", MaintenanceOrderController.update);
router.delete("/:id", MaintenanceOrderController.remove);

export default router;
