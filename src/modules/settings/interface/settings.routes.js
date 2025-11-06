import { Router } from "express";
import * as SettingsController from "./SettingsController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";
import { requirePermission } from "../../../infrastructure/security/requirePermission.js";

const router = Router();


router.use(authMiddleware);
router.get("/", requirePermission("MANAGE_SETTINGS"), SettingsController.getSettings);
router.put("/", requirePermission("MANAGE_SETTINGS"), SettingsController.updateSettings);
export default router;