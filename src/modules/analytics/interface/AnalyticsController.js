import { AnalyticsService } from "../application/AnalyticsService.js";

export const getReport=async(req,res,next)=>{
    try{
        const report=await AnalyticsService.getSystemReport();
        res.status(200).json(report);
        }catch(error){
            next(error)
    }
}