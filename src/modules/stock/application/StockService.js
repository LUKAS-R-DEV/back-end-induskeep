import { StockRepository } from "../infrastructure/StockRepository.js";
import { StockMovement } from "../domain/StockMovement.js";
import { AppError } from "../../../shared/errors/AppError.js";


export const StockService = {
  // 📍 Lista todas as movimentações de estoque
  async list(user = null) {
    try {
      // Se for técnico, filtra apenas movimentações dele
      const userId = user && String(user.role || '').toUpperCase().trim() === "TECHNICIAN" ? user.id : null;
      return await StockRepository.findAll(userId);
    } catch (error) {
      console.error("❌ Erro ao listar movimentações de estoque:", error);
      throw new AppError("Erro interno ao listar movimentações de estoque.", 500);
    }
  },

  // 📍 Registra uma movimentação de estoque
  async move(data, user = null) {
    if (!data.pieceId || !data.quantity || !data.type) {
      throw new AppError("Campos obrigatórios ausentes: pieceId, quantity e type.", 400);
    }

    // Observação é obrigatória
    if (!data.notes || !data.notes.trim()) {
      throw new AppError("Observação é obrigatória. Informe o motivo da movimentação.", 400);
    }

    if (data.quantity <0||data.quantity===0) {
      throw new AppError("Quantidade deve ser maior que zero.", 400);
    }

    if (!['ENTRY', 'EXIT', 'ADJUSTMENT'].includes(data.type)) {
      throw new AppError("Tipo de movimentação inválido. Use: ENTRY, EXIT ou ADJUSTMENT.", 400);
    }

    // Se for técnico, permite apenas saída (EXIT)
    const userRole = user ? String(user.role || '').toUpperCase().trim() : '';
    if (userRole === "TECHNICIAN" && data.type !== "EXIT") {
      throw new AppError("Técnicos podem realizar apenas saídas de estoque (EXIT).", 403);
    }

    try {
      const movement = new StockMovement(data);
      return await StockRepository.registerMovement(movement);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao registrar movimentação de estoque:", error);
      throw new AppError("Erro interno ao registrar movimentação de estoque.", 500);
    }
  },

  // 📍 Busca movimentações por peça
  async findByPiece(pieceId) {
    if (!pieceId) {
      throw new AppError("ID da peça não informado.", 400);
    }

    try {
      return await StockRepository.findByPiece(pieceId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao buscar movimentações por peça:", error);
      throw new AppError("Erro interno ao buscar movimentações por peça.", 500);
    }
  },

  // 📍 Busca movimentações por período
  async findByPeriod(startDate, endDate, user = null) {
    if (!startDate || !endDate) {
      throw new AppError("Data inicial e final são obrigatórias.", 400);
    }

    try {
      // Se for técnico, filtra apenas movimentações dele
      const userId = user && String(user.role || '').toUpperCase().trim() === "TECHNICIAN" ? user.id : null;
      return await StockRepository.findByPeriod(startDate, endDate, userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao buscar movimentações por período:", error);
      throw new AppError("Erro interno ao buscar movimentações por período.", 500);
    }
  },

  // 📍 Remove uma movimentação
  async remove(id) {
    if (!id) {
      throw new AppError("ID da movimentação não informado.", 400);
    }

    const found = await StockRepository.findById(id);
    if (!found) {
      throw new AppError("Movimentação não encontrada.", 404);
    }

    try {
      await StockRepository.delete(id);
      return { message: "Movimentação removida com sucesso." };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao remover movimentação:", error);
      throw new AppError("Erro interno ao remover movimentação.", 500);
    }
  },
};