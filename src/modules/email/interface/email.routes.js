import { Router } from "express";
import * as EmailController from "./EmailController.js";

const router = Router();
router.post("/send", EmailController.sendEmail);
export default router;