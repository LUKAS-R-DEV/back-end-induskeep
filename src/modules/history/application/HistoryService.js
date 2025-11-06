import { HistoryRepository } from "../infrastructure/HistoryRepository.js";
import { MaintenanceOrderRepository } from "../../maintenanceOrder/infrastructure/MaintenanceOrderRepository.js";
import { MachineRepository } from "../../machine/infrastructure/MachineRepository.js";
import { History } from "../domain/History.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const HistoryService={
  
    async list(){
        return await HistoryRepository.findAll();
    },
   async create(data, user = null) {
    const order = await MaintenanceOrderRepository.findById(data.orderId);
    if (!order) throw new Error("Ordem de manutenção não encontrada.");
    
    // Se for técnico, verifica se a ordem pertence a ele
    const userRole = user ? String(user.role || '').toUpperCase().trim() : '';
    if (userRole === "TECHNICIAN" && order.userId !== user.id) {
      throw new AppError("Você não tem permissão para concluir esta ordem de serviço.", 403);
    }
    
    // Permite concluir mesmo se já estiver concluída (permite reabertura e nova conclusão)
    // Apenas verifica se não está cancelada
    if (order.status === "CANCELLED") {
      throw new AppError("Não é possível concluir uma ordem cancelada.", 400);
    }
    
    const wasInProgress = order.status === "IN_PROGRESS";
    
    // Atualiza o status para COMPLETED
    await MaintenanceOrderRepository.update(data.orderId, {
      status: "COMPLETED",
    });

    // Se a ordem estava em andamento, volta a máquina para ACTIVE
    if (wasInProgress) {
      const machine = await MachineRepository.findById(order.machineId);
      if (machine && machine.status === "MAINTENANCE") {
        await MachineRepository.update(order.machineId, { status: "ACTIVE" });
      }
    }

    // Cria novo registro no histórico (permite múltiplas conclusões)
    const history = new History({
      orderId: data.orderId,
      notes: data.notes || (order.status === "COMPLETED" 
        ? "Ordem reaberta e concluída novamente" 
        : "Ordem de serviço concluída"),
    });

    const savedHistory = await HistoryRepository.create(history);
    return savedHistory; 
  },

async findByOrder(orderId){
    return await HistoryRepository.findByOrder(orderId);
}
}