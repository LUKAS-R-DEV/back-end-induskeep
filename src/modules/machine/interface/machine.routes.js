import {Router} from 'express';
import * as MachineController from "./MachineController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";
import { requirePermission } from "../../../infrastructure/security/requirePermission.js";

const router=Router();

router.use(authMiddleware);
router.get("/",MachineController.getAll);
router.get("/:id",MachineController.getById);
router.post("/", requirePermission("CREATE_MACHINE"), MachineController.create);
router.put("/:id", requirePermission("UPDATE_MACHINE"), MachineController.update);
router.delete("/:id", requirePermission("DELETE_MACHINE"), MachineController.remove);
export default router