import {Router} from 'express';
import userRoutes from "../../modules/user/interface/user.routes.js";
import machineRoutes from "../../modules/machine/interface/machine.routes.js";
import pieceRoutes from "../../modules/piece/interface/piece.routes.js";
import maintenanceOrderRoutes from "../../modules/maintenanceOrder/interface/maintenanceOrder.routes.js";
import ordemItemRoutes from "../../modules/orderItem/interface/orderItem.routes.js";
import scheduleRoutes from "../../modules/schedule/interface/schedule.routes.js";

const router=Router();
router.use("/auth",userRoutes);
router.use("/machines",machineRoutes);
router.use("/pieces",pieceRoutes);
router.use("/orders",maintenanceOrderRoutes);
router.use("/order-items",ordemItemRoutes);
router.use("/schedules",scheduleRoutes);

export default router;