import { StockRepository } from "../infrastructure/StockRepository.js";
import { StockMovement } from "../domain/StockMovement.js";
import { AppError } from "../../../shared/errors/AppError.js";


export const StockService = {
    async list() {
        try {
            return await StockRepository.findAll();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao buscar movimentações de estoque.", 500);
        }
    },

    async move(data) {
        try {
            if (!data.pieceId) throw new AppError("ID da peça é obrigatório.", 400);
            if (!data.quantity) throw new AppError("Quantidade é obrigatória.", 400);
            if (!data.type) throw new AppError("Tipo de movimentação é obrigatório.", 400);
            
            const movement = new StockMovement(data);
            return await StockRepository.registerMovement(movement);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao registrar movimentação de estoque.", 500);
        }
    }
}