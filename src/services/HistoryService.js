import { HistoryRepository } from "../infrastructure/HistoryRepository.js";
import { MaintenanceOrderRepository } from "../../maintenanceOrder/infrastructure/MaintenanceOrderRepository.js";
import { History } from "../domain/History.js";

export const HistoryService={
  
    async list(){
        return await HistoryRepository.findAll();
    },
   async create(data) {
    const order = await MaintenanceOrderRepository.findById(data.orderId);
    if (!order) throw new Error("Ordem de manutenção não encontrada.");

    await MaintenanceOrderRepository.update(data.orderId, {
      status: "COMPLETED",
    });

    const history = new History({
      orderId: data.orderId,
      notes: data.notes,
    });

    const savedHistory = await HistoryRepository.create(history);
    return savedHistory; // ✅ ESSENCIAL: devolve o histórico criado
  },

async findByOrder(orderId){
    return await HistoryRepository.findByOrder(orderId);
}
}