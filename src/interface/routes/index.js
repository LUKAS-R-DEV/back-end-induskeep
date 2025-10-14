import {Router} from 'express';
import userRoutes from "../../modules/user/interface/user.routes.js";
import machineRoutes from "../../modules/machine/interface/machine.routes.js";
import pieceRoutes from "../../modules/piece/interface/piece.routes.js";
import maintenanceOrderRoutes from "../../modules/maintenanceOrder/interface/maintenanceOrder.routes.js";
import ordemItemRoutes from "../../modules/orderItem/interface/orderItem.routes.js";
import scheduleRoutes from "../../modules/schedule/interface/schedule.routes.js";
import notificationRoutes from "../../modules/notification/interface/notification.routes.js";
import historyRoutes from "../../modules/history/interface/history.routes.js";
import stockRoutes from "../../modules/stock/interface/stock.routes.js";
import reportRoutes from "../../modules/reports/interface/report.routes.js";
import passordRecoveryRoutes from "../../modules/auth/interface/passwordRecovery.routes.js";
import analyticsRoutes from "../../modules/analytics/interface/analytics.routes.js";
import auditRoutes from "../../modules/audit/interface/audit.routes.js";
import exportRoutes from "../../modules/export/interface/export.routes.js";

const router=Router();

router.use("/auth",userRoutes);
router.use("/machines",machineRoutes);
router.use("/pieces",pieceRoutes);
router.use("/orders",maintenanceOrderRoutes);
router.use("/order-items",ordemItemRoutes);
router.use("/schedules",scheduleRoutes);
router.use("/notifications",notificationRoutes);
router.use("/history",historyRoutes);
router.use("/stock",stockRoutes);
router.use("/reports",reportRoutes);
router.use("/auth",passordRecoveryRoutes);
router.use("/analytics",analyticsRoutes);
router.use("/audit",auditRoutes);
router.use("/export",exportRoutes);

export default router;

