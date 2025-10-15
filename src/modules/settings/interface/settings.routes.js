import { Router } from "express";
import * as SettingsController from "./SettingsController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";

const router = Router();


router.use(authMiddleware);
router.get("/", SettingsController.getSettings);
router.put("/", SettingsController.updateSettings);
export default router;