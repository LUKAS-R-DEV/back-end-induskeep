import { HistoryRepository } from "../infrastructure/HistoryRepository.js";
import { MaintenanceOrderRepository } from "../../maintenanceOrder/infrastructure/MaintenanceOrderRepository.js";
import { MachineRepository } from "../../machine/infrastructure/MachineRepository.js";
import { History } from "../domain/History.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { NotificationService } from "../../notification/application/NotificationService.js";
import { OrderItemService } from "../../orderItem/application/OrderItemService.js";
import { StockService } from "../../stock/application/StockService.js";
import { UserRepository } from "../../user/infrastructure/UserRepository.js";

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
    
    // OBRIGATÓRIO: Apenas ordens em execução podem ser concluídas
    if (order.status !== "IN_PROGRESS") {
      throw new AppError("Apenas ordens em execução podem ser concluídas. A ordem deve estar com status 'Em Andamento' (IN_PROGRESS).", 400);
    }
    
    // Atualiza o status para COMPLETED
    await MaintenanceOrderRepository.update(data.orderId, {
      status: "COMPLETED",
    });

    // Volta a máquina para ACTIVE (ordem estava em IN_PROGRESS)
    const machine = await MachineRepository.findById(order.machineId);
    if (machine && machine.status === "MAINTENANCE") {
      await MachineRepository.update(order.machineId, { status: "ACTIVE" });
    }

    // Cria novo registro no histórico
    const history = new History({
      orderId: data.orderId,
      notes: data.notes || "Ordem de serviço concluída",
    });

    const savedHistory = await HistoryRepository.create(history);

    const pieces = Array.isArray(data.pieces) ? data.pieces : [];

    // Processa peças utilizadas (agora opcional)
    if (pieces.length > 0) {
      try {
        for (const pieceData of pieces) {
          if (!pieceData.pieceId || !pieceData.quantity || pieceData.quantity <= 0) {
            throw new AppError("Dados de peça inválidos. Cada peça deve ter um ID e quantidade maior que zero.", 400);
          }
          
          // Cria o OrderItem (vincula peça à ordem)
          await OrderItemService.create({
            orderId: data.orderId,
            pieceId: pieceData.pieceId,
            quantity: pieceData.quantity
          });

          // Cria movimentação de estoque (saída - EXIT) para histórico
          // A movimentação já atualiza a quantidade da peça automaticamente
          const orderTitle = order.title || `Ordem #${order.id.substring(0, 8)}`;
          const technicianName = user?.name || "Sistema";
          
          await StockService.move({
            pieceId: pieceData.pieceId,
            quantity: pieceData.quantity,
            type: "EXIT",
            notes: `Peça utilizada na manutenção: ${orderTitle} - Concluída por ${technicianName}`,
            userId: user?.id || order.userId
          });
        }
      } catch (pieceError) {
        // Se houver erro ao adicionar peças, reverte a conclusão
        console.error("❌ Erro ao adicionar peças à ordem:", pieceError);
        if (pieceError instanceof AppError) {
          throw pieceError;
        }
        throw new AppError("Erro ao processar peças utilizadas: " + pieceError.message, 400);
      }
    }

    // Notifica o criador da ordem e os administradores quando ela é concluída
    try {
      const orderTitle = order.title || `Ordem #${order.id.substring(0, 8)}`;
      const technicianName = user?.name || "Técnico";
      const machineName = order.machine?.name || "Equipamento";
      
      const notificationTitle = "Ordem de Serviço Concluída";
      const notificationMessage = `${technicianName} concluiu a ordem de serviço "${orderTitle}" no equipamento ${machineName}`;

      // Notifica o criador da ordem (se diferente do técnico que está concluindo)
      const creatorId = order.createdById || order.createdBy?.id;
      if (creatorId && user && user.id !== creatorId) {
        try {
          await NotificationService.create({
            title: notificationTitle,
            message: notificationMessage,
            userId: creatorId
          });
        } catch (notifError) {
          console.error("❌ Erro ao enviar notificação ao criador da ordem:", notifError);
        }
      }

      // Notifica todos os administradores ativos
      try {
        const allUsers = await UserRepository.findAll();
        const admins = allUsers.filter(u => 
          u.role === "ADMIN" && 
          u.isActive === true &&
          (!user || u.id !== user.id) // Não notifica o próprio técnico se ele for admin
        );

        // Envia notificação para cada administrador
        for (const admin of admins) {
          try {
            await NotificationService.create({
              title: notificationTitle,
              message: notificationMessage,
              userId: admin.id
            });
          } catch (adminNotifError) {
            console.error(`❌ Erro ao enviar notificação para admin ${admin.id}:`, adminNotifError);
          }
        }
      } catch (adminError) {
        console.error("❌ Erro ao buscar administradores para notificação:", adminError);
      }
    } catch (notifError) {
      // Não falha a conclusão se a notificação falhar
      console.error("❌ Erro ao enviar notificações:", notifError);
    }

    return savedHistory; 
  },

async findByOrder(orderId){
    return await HistoryRepository.findByOrder(orderId);
}
}