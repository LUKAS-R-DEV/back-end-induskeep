import { AnalyticsRepository } from "../infrastructure/AnalyticsRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { AnalyticsReport } from "../domain/Analytics.js";

export const AnalyticsService={
    async getSystemReport(){
        try{
            const stats=await AnalyticsRepository.getGeneralStats();
            const avgRepairTime=await AnalyticsRepository.getAvgRepairTime();
            const avgFailureInterval=await AnalyticsRepository.getAvgFailureInterval();
            
            const report=new AnalyticsReport({
               ...stats,
               avgRepairTime,
               avgFailureInterval, 
            })
            return report.toJson();
            }catch(err){
    throw new AppError("Erro interno ao gerar relatório.", 500);
}
    }
}