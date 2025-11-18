import { HistoryRepository } from "../infrastructure/HistoryRepository.js";
import { MaintenanceOrderRepository } from "../../maintenanceOrder/infrastructure/MaintenanceOrderRepository.js";
import { MachineRepository } from "../../machine/infrastructure/MachineRepository.js";
import { History } from "../domain/History.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { NotificationService } from "../../notification/application/NotificationService.js";

export const HistoryService={
  
    async list(user = null){
        // Se for técnico, filtra apenas ordens concluídas por ele
        const userId = user && String(user.role || '').toUpperCase().trim() === "TECHNICIAN" ? user.id : null;
        return await HistoryRepository.findAll(userId);
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
    const wasAlreadyCompleted = order.status === "COMPLETED";
    
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
      notes: data.notes || (wasAlreadyCompleted
        ? "Ordem reaberta e concluída novamente" 
        : "Ordem de serviço concluída"),
    });

    const savedHistory = await HistoryRepository.create(history);

    // Notifica o criador da ordem quando ela é concluída
    // Apenas se o criador for diferente do técnico que está concluindo
    const creatorId = order.createdById || order.createdBy?.id;
    if (creatorId && user && user.id !== creatorId) {
      try {
        const orderTitle = order.title || `Ordem #${order.id.substring(0, 8)}`;
        const technicianName = user.name || "Técnico";
        
        await NotificationService.create({
          title: wasAlreadyCompleted ? "Ordem de Serviço Reaberta e Concluída" : "Ordem de Serviço Concluída",
          message: wasAlreadyCompleted
            ? `${technicianName} reabriu e concluiu novamente a ordem de serviço "${orderTitle}"`
            : `${technicianName} concluiu a ordem de serviço "${orderTitle}"`,
          userId: creatorId
        });
      } catch (notifError) {
        // Não falha a conclusão se a notificação falhar
        console.error("❌ Erro ao enviar notificação ao criador da ordem:", notifError);
      }
    }

    return savedHistory; 
  },

async findByOrder(orderId){
    return await HistoryRepository.findByOrder(orderId);
}
}