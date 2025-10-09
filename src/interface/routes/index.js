import {Router} from 'express';
import userRoutes from "../../modules/user/interface/user.routes.js";
import MachineRoutes from "../../modules/machine/interface/Machine.routes.js";
const router=Router();
router.use("/auth",userRoutes);
router.use("/machines",MachineRoutes);

export default router;