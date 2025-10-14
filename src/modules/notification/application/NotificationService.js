import { NotificationRepository } from "../infrastructure/NotificationRepository.js";
import { Notification } from "../domain/Notification.js";
import { AppError } from "../../../shared/errors/AppError.js";

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
    if (!data.title || !data.message) {
      throw new AppError("Campos obrigatórios ausentes: title e message.", 400);
    }

    if (!data.scheduleId && !data.userId) {
      throw new AppError("Campos obrigatórios: scheduleId ou userId.", 400);
    }

    try {
      const notification = new Notification(data);
      return await NotificationRepository.create(notification.toJSON());
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao criar notificação:", error);
      throw new AppError("Erro interno ao criar notificação.", 500);
    }
  },

  // 📍 Atualiza uma notificação
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