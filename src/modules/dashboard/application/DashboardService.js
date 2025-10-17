import { DashboardRepository } from "../infrastructure/DashboardRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";


export const DashboardService = {
    async getDashboardData() {
        try{
            const sumary=await DashboardRepository.getSumary();
            const recentOrders=await DashboardRepository.getRecentOrders();
            const lowStockPieces=await DashboardRepository.getLowStockPieces();

            return {
                sumary,
                recentOrders,
                lowStockPieces
            }
        }catch(error){
            throw new AppError("Erro ao carregar dados do dashboard.", 500);
        }
        }
}
