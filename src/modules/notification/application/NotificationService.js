import { NotificationRepository } from "../infrastructure/NotificationRepository.js";
import { Notification } from "../domain/Notification.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { PushSubscriptionService } from "../../pushSubscription/application/PushSubscriptionService.js";

export const NotificationService = {
  // 📍 Lista todas as notificações
  async list() {
    try {
      return await NotificationRepository.findAll();
    } catch (error) {
      console.error("❌ Erro ao listar notificações:", error);
      throw new AppError("Erro interno ao listar notificações.", 500);
    }
  },

  // 📍 Cria notificação se não houver outra igual recente
  async createIfNotExists({ title, message, userId = null, scheduleId = null, windowMinutes = 1440 }) {
    if (!message) {
      throw new AppError("Campo obrigatório ausente: message.", 400);
    }

    const since = new Date(Date.now() - windowMinutes * 60 * 1000);
    const existing = await NotificationRepository.findRecent({ title: title || "Notificação do sistema", message, since });
    if (existing) {
      return existing;
    }

    return this.create({ title, message, userId, scheduleId });
  },

  // 📍 Lista notificações por usuário
  async listByUser(userId) {
    if (!userId) {
      throw new AppError("ID do usuário é obrigatório.", 400);
    }

    try {
      return await NotificationRepository.findAllByUser(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao buscar notificações do usuário:", error);
      throw new AppError("Erro interno ao buscar notificações do usuário.", 500);
    }
  },

  // 📍 Cria uma nova notificação
  async create(data) {
  if (!data.message) {
    throw new AppError("Campo obrigatório ausente: message.", 400);
  }

  // Permite notificações automáticas sem userId/scheduleId
  const notificationData = {
    title: data.title || "Notificação do sistema",
    message: data.message,
    userId: data.userId || null,
    scheduleId: data.scheduleId || null,
    read: false,
  };

  try {
    const notification = new Notification(notificationData);
    const savedNotification = await NotificationRepository.create(notification.toJSON());

    // Envia push notification se houver userId
    if (data.userId) {
      try {
        await PushSubscriptionService.sendNotificationToUser(data.userId, {
          title: notificationData.title,
          body: notificationData.message,
          icon: "/favicon.svg",
          badge: "/favicon.svg",
          data: {
            notificationId: savedNotification.id,
            url: "/notificacoes",
          },
        });
      } catch (pushError) {
        // Não falha a criação da notificação se o push falhar
        console.error("⚠️ Erro ao enviar push notification:", pushError);
      }
    }

    return savedNotification;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("❌ Erro ao criar notificação:", error);
    throw new AppError("Erro interno ao criar notificação.", 500);
  }
  },

 
  async update(id, data) {
    if (!id) {
      throw new AppError("ID da notificação não informado.", 400);
    }
    if (!Object.keys(data).length) {
      throw new AppError("Nenhum dado informado para atualização.", 400);
    }

    const found = await NotificationRepository.findById(id);
    if (!found) {
      throw new AppError("Notificação não encontrada.", 404);
    }

    try {
      return await NotificationRepository.update(id, data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao atualizar notificação:", error);
      throw new AppError("Erro interno ao atualizar notificação.", 500);
    }
  },

  // 📍 Remove uma notificação
  async delete(id) {
    if (!id) {
      throw new AppError("ID da notificação não informado.", 400);
    }

    const found = await NotificationRepository.findById(id);
    if (!found) {
      throw new AppError("Notificação não encontrada.", 404);
    }

    try {
      await NotificationRepository.delete(id);
      return { message: "Notificação removida com sucesso." };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao deletar notificação:", error);
      throw new AppError("Erro interno ao deletar notificação.", 500);
    }
  },

  // Alias para manter compatibilidade com o controller
  async remove(id) {
    return this.delete(id);
  },

  // 📍 Marca notificação como lida
  async markAsRead(id) {
    if (!id) {
      throw new AppError("ID da notificação não informado.", 400);
    }

    const found = await NotificationRepository.findById(id);
    if (!found) {
      throw new AppError("Notificação não encontrada.", 404);
    }

    try {
      return await NotificationRepository.markAsRead(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao marcar notificação como lida:", error);
      throw new AppError("Erro interno ao marcar notificação como lida.", 500);
    }
  },

  // 📍 Busca uma notificação por ID
  async findById(id) {
    if (!id) {
      throw new AppError("ID da notificação não informado.", 400);
    }

    try {
      const notification = await NotificationRepository.findById(id);
      if (!notification) {
        throw new AppError("Notificação não encontrada.", 404);
      }
      return notification;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao buscar notificação:", error);
      throw new AppError("Erro interno ao buscar notificação.", 500);
    }
  },
};