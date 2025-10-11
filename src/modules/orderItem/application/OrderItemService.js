import { OrderItemRepository } from "../infrastructure/OrderItemRepository.js";
import { PieceRepository } from "../../piece/infrastructure/PieceRepository.js";
import { OrderItem } from "../domain/OrderItem.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const OrderItemService = {
    async list() {
        try {
            return await OrderItemRepository.findAll();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao buscar itens da ordem.", 500);
        }
    },

    async create(data) {
        try {
            if (!data.pieceId) throw new AppError("ID da peça é obrigatório.", 400);
            if (!data.quantity || data.quantity <= 0) throw new AppError("Quantidade deve ser maior que zero.", 400);

            const piece = await PieceRepository.findById(data.pieceId);
            if (!piece) throw new AppError("Peça não encontrada.", 404);
            
            if (piece.quantity < data.quantity) throw new AppError("Quantidade insuficiente em estoque.", 400);
            
            const item = new OrderItem(data);
            await PieceRepository.update(piece.id, { quantity: piece.quantity - data.quantity });
            return await OrderItemRepository.create(item);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao criar item da ordem.", 500);
        }
    },

    async remove(id) {
        try {
            if (!id) throw new AppError("ID do item é obrigatório.", 400);
            
            const found = await OrderItemRepository.findById(id);
            if (!found) throw new AppError("Item não encontrado.", 404);
            
            const piece = await PieceRepository.findById(found.pieceId);
            if (piece) {
                await PieceRepository.update(found.pieceId, { quantity: piece.quantity + found.quantity });
            }
            
            return await OrderItemRepository.delete(id);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao remover item da ordem.", 500);
        }
    }
}