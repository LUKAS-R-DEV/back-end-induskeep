import { DashboardService } from "../application/DashboardService.js";

export const getDashboardData = async (req, res,next) => {
    try {
        const data = await DashboardService.getDashboardData(req.user);
        res.status(200).json(data);
    } catch (err) {
       next(err);
    }
};