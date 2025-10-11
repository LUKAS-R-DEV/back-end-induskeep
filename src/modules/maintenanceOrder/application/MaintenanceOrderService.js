import { MaintenanceOrderRepository } from "../infrastructure/MaintenanceOrderRepository.js";
import { MaintenanceOrder } from "../domain/MaintenanceOrder.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const MaintenanceOrderService = {
  async list() {
    return await MaintenanceOrderRepository.findAll();
  },

  async create(data) {
    try {
      const order = new MaintenanceOrder(data);
      return await MaintenanceOrderRepository.create(order);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao criar ordem de manutenção.", 500);
    }
  },

  async update(id, data) {
    try {
      const found = await MaintenanceOrderRepository.findById(id);
      if (!found) throw new AppError("Ordem de manutenção não encontrada.", 404);

      return await MaintenanceOrderRepository.update(id, data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao atualizar ordem de manutenção.", 500);
    }
  },

  async remove(id) {
    try {
      const found = await MaintenanceOrderRepository.findById(id);
      if (!found) throw new AppError("Ordem de manutenção não encontrada.", 404);

      return await MaintenanceOrderRepository.delete(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao remover ordem de manutenção.", 500);
    }
  },
};
