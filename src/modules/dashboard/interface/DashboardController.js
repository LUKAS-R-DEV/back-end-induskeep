import { DashboardService } from "../application/DashboardService.js";

export const getDashboardData = async (req, res,next) => {
    try {
        const data = await DashboardService.getDashboardData();
        res.status(200).json(data);
    } catch (err) {
       next(err);
    }
};