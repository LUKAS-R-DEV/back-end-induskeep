import { MaintenanceOrderRepository } from "../infrastructure/MaintenanceOrderRepository.js";
import { MaintenanceOrder } from "../domain/MaintenanceOrder.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { MachineRepository } from "../../machine/infrastructure/MachineRepository.js";
import { NotificationService } from "../../notification/application/NotificationService.js";

export const MaintenanceOrderService = {
  // 📍 Lista todas as ordens de manutenção
  async list(user = null) {
    try {
      // Se for técnico, filtra apenas ordens atribuídas a ele
      const userRole = user ? String(user.role || '').toUpperCase().trim() : '';
      const userId = userRole === "TECHNICIAN" ? user.id : null;
      return await MaintenanceOrderRepository.findAll(userId);
    } catch (error) {
      console.error("❌ Erro ao listar ordens de manutenção:", error);
      throw new AppError("Erro interno ao listar ordens de manutenção.", 500);
    }
  },

  // 📍 Cria uma nova ordem de manutenção
  async create(data) {
    if (!data.machineId || !data.description ) {
      throw new AppError("Campos obrigatórios ausentes: machineId e description", 400);
    }

    try {
      // Verifica se a máquina existe e está ativa
      const machine = await MachineRepository.findById(data.machineId);
      if (!machine) {
        throw new AppError("Máquina não encontrada.", 404);
      }
      if (machine.status === "INACTIVE") {
        throw new AppError("Não é possível criar ordem de serviço para uma máquina inativa.", 400);
      }

      // Sempre cria como PENDING - faz mais sentido uma ordem recém-criada estar pendente
      // O técnico pode iniciar a ordem depois através da interface
      const orderData = {
        ...data,
        status: "PENDING"
      };
      
      const order = new MaintenanceOrder(orderData);
      const createdOrder = await MaintenanceOrderRepository.create(order);

      // Notifica o técnico atribuído se for diferente de quem criou
      if (createdOrder.userId && createdOrder.createdById && createdOrder.userId !== createdOrder.createdById) {
        try {
          const machine = await MachineRepository.findById(createdOrder.machineId);
          const machineName = machine?.name || "Equipamento";
          
          await NotificationService.create({
            title: "Nova Ordem de Serviço Atribuída",
            message: `Uma nova ordem de serviço foi atribuída a você: "${createdOrder.title}" no equipamento ${machineName}`,
            userId: createdOrder.userId
          });
        } catch (notifError) {
          // Não falha a criação se a notificação falhar
          console.error("❌ Erro ao enviar notificação ao técnico:", notifError);
        }
      }

      return createdOrder;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao criar ordem de manutenção:", error);
      throw new AppError("Erro interno ao criar ordem de manutenção.", 500);
    }
  },

  // 📍 Atualiza uma ordem de manutenção
  async update(id, data, user = null) {
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

    // Se for técnico, verifica se a ordem pertence a ele
    const userRole = user ? String(user.role || '').toUpperCase().trim() : '';
    if (userRole === "TECHNICIAN" && found.userId !== user.id) {
      throw new AppError("Você não tem permissão para editar esta ordem de serviço.", 403);
    }

    try {
      const oldStatus = found.status;
      const newStatus = data.status;
      const machineId = found.machineId;
      const isStatusChanged = newStatus && oldStatus !== newStatus;
      const isTechnicianUpdating = userRole === "TECHNICIAN" && found.userId === user?.id;
      const hasDifferentCreator = found.createdById && found.createdById !== found.userId;
      const isSupervisorOrAdmin = userRole === "SUPERVISOR" || userRole === "ADMIN";

      // Supervisores e Admins só podem cancelar ordens, não podem mudar para outros status
      if (isStatusChanged && isSupervisorOrAdmin && newStatus !== "CANCELLED") {
        throw new AppError("Supervisores e administradores só podem cancelar ordens de serviço. Apenas técnicos podem alterar o status da ordem.", 403);
      }

      // Apenas técnicos podem iniciar ordens
      // CONCLUSÃO DEVE SER FEITA APENAS ATRAVÉS DO HISTORY (que exige peças)
      if (newStatus === "COMPLETED") {
        throw new AppError("Para concluir uma ordem, use o endpoint de histórico que exige informar as peças utilizadas.", 400);
      }
      
      if (newStatus === "IN_PROGRESS") {
        if (userRole !== "TECHNICIAN") {
          throw new AppError("Apenas o técnico responsável pode iniciar uma ordem de serviço.", 403);
        }
        if (found.userId !== user?.id) {
          throw new AppError("Você não tem permissão para iniciar esta ordem de serviço.", 403);
        }
      }

      // Verifica se o técnico foi alterado ou atribuído pela primeira vez
      const oldUserId = found.userId;
      const newUserId = data.userId;
      const technicianChanged = newUserId && (oldUserId !== newUserId);
      const technicianAssigned = newUserId && !oldUserId; // Primeira atribuição

      // Atualiza a ordem
      const updatedOrder = await MaintenanceOrderRepository.update(id, data);

      // Notifica o novo técnico se foi atribuído ou alterado
      if ((technicianChanged || technicianAssigned) && newUserId) {
        try {
          const machine = await MachineRepository.findById(machineId);
          const machineName = machine?.name || "Equipamento";
          
          await NotificationService.create({
            title: "Ordem de Serviço Atribuída",
            message: `Uma ordem de serviço foi atribuída a você: "${found.title}" no equipamento ${machineName}`,
            userId: newUserId
          });
        } catch (notifError) {
          // Não falha a atualização se a notificação falhar
          console.error("❌ Erro ao enviar notificação ao técnico:", notifError);
        }
      }

      // Busca a máquina para atualizar seu status
      const machine = await MachineRepository.findById(machineId);
      if (!machine) {
        console.warn(`⚠️ Máquina ${machineId} não encontrada ao atualizar ordem ${id}`);
        return updatedOrder;
      }

      // Lógica de atualização do status da máquina baseado no status da ordem
      if (newStatus === "IN_PROGRESS" && oldStatus !== "IN_PROGRESS") {
        // Ordem iniciada: máquina vai para MAINTENANCE (se estava ACTIVE)
        if (machine.status === "ACTIVE") {
          await MachineRepository.update(machineId, { status: "MAINTENANCE" });
        }
      } else if (newStatus === "CANCELLED" && oldStatus === "IN_PROGRESS") {
        // Ordem cancelada: máquina volta para ACTIVE (se estava em MAINTENANCE)
        if (machine.status === "MAINTENANCE") {
          await MachineRepository.update(machineId, { status: "ACTIVE" });
        }
      } else if (newStatus === "CANCELLED" && oldStatus !== "CANCELLED") {
        // Ordem cancelada: máquina volta para ACTIVE (se estava em MAINTENANCE)
        if (machine.status === "MAINTENANCE") {
          await MachineRepository.update(machineId, { status: "ACTIVE" });
        }
      }

      // Notifica o gerador da ordem quando o técnico modifica o status
      if (isStatusChanged && isTechnicianUpdating && hasDifferentCreator && found.createdById) {
        try {
          const statusMessages = {
            "IN_PROGRESS": "iniciou",
            "PAUSED": "pausou",
            "COMPLETED": "concluiu",
            "CANCELLED": "cancelou"
          };
          
          const action = statusMessages[newStatus] || "modificou";
          const orderTitle = found.title || `Ordem #${id.substring(0, 8)}`;
          
          await NotificationService.create({
            title: "Atualização de Ordem de Serviço",
            message: `O técnico responsável ${action} a ordem de serviço "${orderTitle}"`,
            userId: found.createdById
          });
        } catch (notifError) {
          // Não falha a atualização se a notificação falhar
          console.error("❌ Erro ao enviar notificação ao gerador da ordem:", notifError);
        }
      }

      return updatedOrder;
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
      const machineId = found.machineId;
      const orderStatus = found.status;

      // Deleta a ordem
      await MaintenanceOrderRepository.delete(id);

      // Se a ordem estava em andamento, volta a máquina para ACTIVE
      if (orderStatus === "IN_PROGRESS") {
        const machine = await MachineRepository.findById(machineId);
        if (machine && machine.status === "MAINTENANCE") {
          await MachineRepository.update(machineId, { status: "ACTIVE" });
        }
      }

      return { message: "Ordem de manutenção removida com sucesso." };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao remover ordem de manutenção:", error);
      throw new AppError("Erro interno ao remover ordem de manutenção.", 500);
    }
  },

  // 📍 Busca uma ordem de manutenção por ID
  async findById(id, user = null) {
    if (!id) {
      throw new AppError("ID da ordem de manutenção não informado.", 400);
    }

    try {
      const order = await MaintenanceOrderRepository.findById(id);
      if (!order) {
        throw new AppError("Ordem de manutenção não encontrada.", 404);
      }
      
      // Se for técnico, verifica se a ordem pertence a ele
      if (user && user.id && user.role) {
        const userRole = String(user.role || '').toUpperCase().trim();
        const userId = String(user.id || '').trim();
        
        if (userRole === "TECHNICIAN") {
          const orderUserId = order.userId ? String(order.userId).trim() : '';
          
          if (!orderUserId) {
            console.warn("⚠️ Ordem sem userId atribuído:", { orderId: id, order });
          }
          
          if (orderUserId && orderUserId !== userId) {
            throw new AppError("Você não tem permissão para visualizar esta ordem de serviço.", 403);
          }
        }
      }
      
      // Garante que os relacionamentos existam (pode ser null em ordens antigas)
      if (!order.machine) {
        order.machine = null;
      }
      if (!order.user) {
        order.user = null;
      }
      if (!order.createdBy) {
        order.createdBy = null;
      }
      
      return order;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao buscar ordem de manutenção:", error);
      console.error("❌ Stack trace:", error.stack);
      console.error("❌ Detalhes do erro:", { 
        id, 
        userId: user?.id, 
        userRole: user?.role,
        errorMessage: error.message,
        errorName: error.name
      });
      throw new AppError(`Erro interno ao buscar ordem de manutenção: ${error.message}`, 500);
    }
  },
};
