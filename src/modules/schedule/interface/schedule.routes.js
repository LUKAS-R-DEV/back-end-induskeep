import { Router } from "express";
import * as ScheduleController from "./ScheduleController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";
import { requirePermission } from "../../../infrastructure/security/requirePermission.js";

const router = Router();

router.use(authMiddleware);

// Listar agendamentos - todos os usuários autenticados podem ver
router.get("/", ScheduleController.getAll);

// Criar agendamento - apenas SUPERVISOR e ADMIN (que têm CREATE_SCHEDULE)
router.post("/", requirePermission("CREATE_SCHEDULE"), ScheduleController.create);

// Atualizar agendamento - apenas SUPERVISOR e ADMIN
router.put("/:id", requirePermission("CREATE_SCHEDULE"), ScheduleController.update);

// Deletar agendamento - apenas SUPERVISOR e ADMIN
router.delete("/:id", requirePermission("CREATE_SCHEDULE"), ScheduleController.remove);

export default router;