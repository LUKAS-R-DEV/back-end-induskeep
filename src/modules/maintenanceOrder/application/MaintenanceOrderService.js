import { MaintenanceOrderRepository } from "../infrastructure/MaintenanceOrderRepository.js";
import { MaintenanceOrder } from "../domain/MaintenanceOrder.js";

export const MaintenanceOrderService = {
  async list() {
    return await MaintenanceOrderRepository.findAll();
  },

  async create(data) {
    const order = new MaintenanceOrder(data);
    return await MaintenanceOrderRepository.create(order);
  },

  async update(id, data) {
    const found = await MaintenanceOrderRepository.findById(id);
    if (!found) throw new Error("Ordem de manutenção não encontrada.");

    return await MaintenanceOrderRepository.update(id, data);
  },

  async remove(id) {
    const found = await MaintenanceOrderRepository.findById(id);
    if (!found) throw new Error("Ordem de manutenção não encontrada.");

    return await MaintenanceOrderRepository.delete(id);
  },
};
