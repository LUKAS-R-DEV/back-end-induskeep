import { Router } from "express";
import * as ScheduleController from "./ScheduleController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", ScheduleController.getAll);
router.post("/", ScheduleController.create);
router.put("/:id", ScheduleController.update);
router.delete("/:id", ScheduleController.remove);

export default router;