import {Router} from 'express';
import UserRoutes from "../../modules/user/interface/user.routes.js";
import MachineRoutes from "../../modules/machine/interface/Machine.routes.js";
import PieceRoutes from "../../modules/piece/interface/Piece.routes.js";
const router=Router();
router.use("/auth",UserRoutes);
router.use("/machines",MachineRoutes);
router.use("/pieces",PieceRoutes);

export default router;