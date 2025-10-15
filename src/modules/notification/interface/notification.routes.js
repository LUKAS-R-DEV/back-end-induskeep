import {Router} from 'express';
import * as NotificationController from "./NotificationController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";

const router=Router();
router.use(authMiddleware);
router.get("/",NotificationController.getAllByUser);
router.get("/all",NotificationController.getAll);
router.post("/",NotificationController.create);
router.patch("/:id",NotificationController.markAsRead);
router.delete("/:id",NotificationController.remove);
export default router