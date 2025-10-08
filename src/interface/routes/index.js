import {Router} from 'express';
import userRoutes from "../../modules/user/interface/user.routes.js";

const router=Router();
router.use("/auth",userRoutes);

export default router;