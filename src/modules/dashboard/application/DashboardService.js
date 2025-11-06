import { DashboardRepository } from "../infrastructure/DashboardRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";


export const DashboardService = {
    async getDashboardData(user = null) {
        try{
            // Se for técnico, filtra apenas dados relacionados a ele
            const userRole = user ? String(user.role || '').toUpperCase().trim() : '';
            const userId = userRole === "TECHNICIAN" ? user.id : null;
            
            const sumary=await DashboardRepository.getSumary(userId);
            const recentOrders=await DashboardRepository.getRecentOrders(userId);
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
