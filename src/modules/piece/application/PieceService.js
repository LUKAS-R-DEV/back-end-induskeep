import { PieceRepository } from "../infrastructure/PieceRepository.js";
import { Piece } from "../domain/Piece.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const PieceService = {
    async list() {
        try {
            return await PieceRepository.findAll();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao buscar peças.", 500);
        }
    },

    async create(data) {
        try {
            if (!data.code) throw new AppError("Código da peça é obrigatório.", 400);
            
            const existing = await PieceRepository.findByCode(data.code);
            if (existing) throw new AppError("Peça já cadastrada com este código.", 409);
            
            const piece = new Piece(data);
            return await PieceRepository.create(piece);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao criar peça.", 500);
        }
    },

    async update(id, data) {
        try {
            if (!id) throw new AppError("ID da peça é obrigatório.", 400);
            
            const found = await PieceRepository.findById(id);
            if (!found) throw new AppError("Peça não encontrada.", 404);
            
            return await PieceRepository.update(id, data);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao atualizar peça.", 500);
        }
    },

    async remove(id) {
        try {
            if (!id) throw new AppError("ID da peça é obrigatório.", 400);
            
            const found = await PieceRepository.findById(id);
            if (!found) throw new AppError("Peça não encontrada.", 404);
            
            return await PieceRepository.delete(id);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao remover peça.", 500);
        }
    }
}