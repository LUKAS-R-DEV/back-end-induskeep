import {Router} from 'express';
import * as OrderItemController from "./OrderItemController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";

const router=Router();
router.use(authMiddleware);
router.get("/",OrderItemController.getAll);
router.post("/",OrderItemController.create);
router.delete("/:id",OrderItemController.remove);
export default router