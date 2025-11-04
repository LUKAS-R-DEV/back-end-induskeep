import {Router} from 'express';
import * as UserController from "./UserController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";
import { requireAdmin } from '../../../infrastructure/security/requireAdmin.js';
const router=Router();
router.post("/register",authMiddleware,requireAdmin,UserController.register);
router.post("/login",UserController.login);
router.get("/users/:id",authMiddleware,requireAdmin,UserController.getById);
router.get("/users",authMiddleware,requireAdmin,UserController.getAll);
router.get("/me",authMiddleware,UserController.profile);
router.put("/users/:id",authMiddleware,requireAdmin,UserController.adminUpdate);
router.post("/users/:id/deactivate",authMiddleware,requireAdmin,UserController.deactivate);
router.post("/users/:id/reactivate",authMiddleware,requireAdmin,UserController.reactivate);
export default router