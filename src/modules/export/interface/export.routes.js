import{Router} from 'express';
import * as ExportController from "./ExportController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";

const router=Router();
router.use(authMiddleware);
router.get("/:module",ExportController.exportModule);
export default router