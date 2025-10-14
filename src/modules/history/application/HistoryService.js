import { HistoryRepository } from "../infrastructure/HistoryRepository.js";
import { MaintenanceOrderRepository } from "../../maintenanceOrder/infrastructure/MaintenanceOrderRepository.js";
import { History } from "../domain/History.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const HistoryService = {
  // 📍 Lista todo o histórico
  async list() {
    try {
      return await HistoryRepository.findAll();
    } catch (error) {
      console.error("❌ Erro ao listar histórico:", error);
      throw new AppError("Erro interno ao listar histórico.", 500);
    }
  },

  // 📍 Cria um novo registro de histórico
  async create(data) {
    if (!data.orderId) {
      throw new AppError("ID da ordem de manutenção é obrigatório.", 400);
    }

    try {
      const order = await MaintenanceOrderRepository.findById(data.orderId);
      if (!order) {
        throw new AppError("Ordem de manutenção não encontrada.", 404);
      }

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
      console.error("❌ Erro ao criar histórico:", error);
      throw new AppError("Erro interno ao criar histórico.", 500);
    }
  },

  // 📍 Busca histórico por ordem
  async findByOrder(orderId) {
    if (!orderId) {
      throw new AppError("ID da ordem de manutenção é obrigatório.", 400);
    }

    try {
      return await HistoryRepository.findByOrder(orderId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao buscar histórico da ordem:", error);
      throw new AppError("Erro interno ao buscar histórico da ordem.", 500);
    }
  },

  // 📍 Busca um registro de histórico por ID
  async findById(id) {
    if (!id) {
      throw new AppError("ID do histórico não informado.", 400);
    }

    try {
      const history = await HistoryRepository.findById(id);
      if (!history) {
        throw new AppError("Histórico não encontrado.", 404);
      }
      return history;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao buscar histórico:", error);
      throw new AppError("Erro interno ao buscar histórico.", 500);
    }
  },

  // 📍 Atualiza um registro de histórico
  async update(id, data) {
    if (!id) {
      throw new AppError("ID do histórico não informado.", 400);
    }
    if (!Object.keys(data).length) {
      throw new AppError("Nenhum dado informado para atualização.", 400);
    }

    const found = await HistoryRepository.findById(id);
    if (!found) {
      throw new AppError("Histórico não encontrado.", 404);
    }

    try {
      return await HistoryRepository.update(id, data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao atualizar histórico:", error);
      throw new AppError("Erro interno ao atualizar histórico.", 500);
    }
  },

  // 📍 Remove um registro de histórico
  async remove(id) {
    if (!id) {
      throw new AppError("ID do histórico não informado.", 400);
    }

    const found = await HistoryRepository.findById(id);
    if (!found) {
      throw new AppError("Histórico não encontrado.", 404);
    }

    try {
      await HistoryRepository.delete(id);
      return { message: "Histórico removido com sucesso." };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao remover histórico:", error);
      throw new AppError("Erro interno ao remover histórico.", 500);
    }
  },
};