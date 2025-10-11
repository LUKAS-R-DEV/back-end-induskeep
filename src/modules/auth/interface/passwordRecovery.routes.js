import { Router } from "express";
import * as PasswordRecoveryController from "./PasswordRecoveryController.js";

const router = Router();

router.post("/forgot-password", PasswordRecoveryController.requestReset);
router.post("/reset-password", PasswordRecoveryController.resetPassword);

export default router;
