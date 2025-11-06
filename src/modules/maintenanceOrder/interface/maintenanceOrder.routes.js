import { Router } from "express";
import * as MaintenanceOrderController from "./MaintenanceOrderController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";
import { requirePermission } from "../../../infrastructure/security/requirePermission.js";

const router = Router();

router.use(authMiddleware);

// Listar e visualizar ordens - todos os usuários autenticados podem ver
router.get("/", MaintenanceOrderController.getAll);
router.get("/:id", MaintenanceOrderController.getById);

// Criar ordem - apenas SUPERVISOR e ADMIN (que têm CREATE_ORDER)
router.post("/", requirePermission("CREATE_ORDER"), MaintenanceOrderController.create);

// Atualizar ordem - apenas SUPERVISOR e ADMIN (que têm UPDATE_ORDER)
router.put("/:id", requirePermission("UPDATE_ORDER"), MaintenanceOrderController.update);

// Deletar ordem - Supervisor e Admin
router.delete("/:id", requirePermission("DELETE_ORDER"), MaintenanceOrderController.remove);

export default router;
