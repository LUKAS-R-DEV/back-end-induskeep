import { HistoryRepository } from "../infrastructure/HistoryRepository.js";
import { MaintenanceOrderRepository } from "../../maintenanceOrder/infrastructure/MaintenanceOrderRepository.js";
import { History } from "../domain/History.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const HistoryService = {
    async list() {
        try {
            return await HistoryRepository.findAll();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao buscar histórico.", 500);
        }
    },

    async create(data) {
        try {
            if (!data.orderId) throw new AppError("ID da ordem de manutenção é obrigatório.", 400);
            
            const order = await MaintenanceOrderRepository.findById(data.orderId);
            if (!order) throw new AppError("Ordem de manutenção não encontrada.", 404);

            await MaintenanceOrderRepository.update(data.orderId, {
                status: "COMPLETED",
            });

            const history = new History({
                orderId: data.orderId,
                notes: data.notes,
            });

            const savedHistory = await HistoryRepository.create(history);
            return savedHistory;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao criar histórico.", 500);
        }
    },

    async findByOrder(orderId) {
        try {
            if (!orderId) throw new AppError("ID da ordem de manutenção é obrigatório.", 400);
            return await HistoryRepository.findByOrder(orderId);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao buscar histórico da ordem.", 500);
        }
    }
}