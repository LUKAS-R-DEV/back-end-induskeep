import { MaintenanceOrderRepository } from "../infrastructure/MaintenanceOrderRepository.js";
import { MaintenanceOrder } from "../domain/MaintenanceOrder.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const MaintenanceOrderService = {
  // 📍 Lista todas as ordens de manutenção
  async list() {
    try {
      return await MaintenanceOrderRepository.findAll();
    } catch (error) {
      console.error("❌ Erro ao listar ordens de manutenção:", error);
      throw new AppError("Erro interno ao listar ordens de manutenção.", 500);
    }
  },

  // 📍 Cria uma nova ordem de manutenção
  async create(data) {
    if (!data.machineId || !data.description || !data.priority) {
      throw new AppError("Campos obrigatórios ausentes: machineId, description e priority.", 400);
    }

    try {
      const order = new MaintenanceOrder(data);
      return await MaintenanceOrderRepository.create(order);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao criar ordem de manutenção:", error);
      throw new AppError("Erro interno ao criar ordem de manutenção.", 500);
    }
  },

  // 📍 Atualiza uma ordem de manutenção
  async update(id, data) {
    if (!id) {
      throw new AppError("ID da ordem de manutenção não informado.", 400);
    }
    if (!Object.keys(data).length) {
      throw new AppError("Nenhum dado informado para atualização.", 400);
    }

    const found = await MaintenanceOrderRepository.findById(id);
    if (!found) {
      throw new AppError("Ordem de manutenção não encontrada.", 404);
    }

    try {
      return await MaintenanceOrderRepository.update(id, data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao atualizar ordem de manutenção:", error);
      throw new AppError("Erro interno ao atualizar ordem de manutenção.", 500);
    }
  },

  // 📍 Remove uma ordem de manutenção
  async remove(id) {
    if (!id) {
      throw new AppError("ID da ordem de manutenção não informado.", 400);
    }

    const found = await MaintenanceOrderRepository.findById(id);
    if (!found) {
      throw new AppError("Ordem de manutenção não encontrada.", 404);
    }

    try {
      await MaintenanceOrderRepository.delete(id);
      return { message: "Ordem de manutenção removida com sucesso." };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao remover ordem de manutenção:", error);
      throw new AppError("Erro interno ao remover ordem de manutenção.", 500);
    }
  },

  // 📍 Busca uma ordem de manutenção por ID
  async findById(id) {
    if (!id) {
      throw new AppError("ID da ordem de manutenção não informado.", 400);
    }

    try {
      const order = await MaintenanceOrderRepository.findById(id);
      if (!order) {
        throw new AppError("Ordem de manutenção não encontrada.", 404);
      }
      return order;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao buscar ordem de manutenção:", error);
      throw new AppError("Erro interno ao buscar ordem de manutenção.", 500);
    }
  },
};
