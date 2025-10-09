import {Router} from 'express';
import * as MachineController from "./MachineController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";

const router=Router();

router.use(authMiddleware);
router.get("/",MachineController.getAll);
router.post("/",MachineController.create);
router.put("/:id",MachineController.update);
router.delete("/:id",MachineController.remove);
export default router