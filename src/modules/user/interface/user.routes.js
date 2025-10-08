import {Router} from 'express';
import * as UserController from "./UserController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";

const router=Router();
router.post("/register",UserController.register);
router.post("/login",UserController.login);
router.get("/me",authMiddleware,UserController.profile);
export default router