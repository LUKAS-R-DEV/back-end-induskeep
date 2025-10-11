import { NotificationRepository } from "../infrastructure/NotificationRepository.js";
import { Notification } from "../domain/Notification.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const NotificationService = {
    async listByUser(userId) {
        try {
            if (!userId) throw new AppError("ID do usuário é obrigatório.", 400);
            return await NotificationRepository.findAllByUser(userId);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao buscar notificações do usuário.", 500);
        }
    },

    async create(data) {
        try {
            if (!data.scheduleId && !data.userId) {
                throw new AppError("Campos obrigatórios: scheduleId ou userId.", 400);
            }
            const notification = new Notification(data);
            return await NotificationRepository.create(notification.toJSON());
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao criar notificação.", 500);
        }
    },

    async delete(id) {
        try {
            if (!id) throw new AppError("ID da notificação é obrigatório.", 400);
            const found = await NotificationRepository.findById(id);
            if (!found) throw new AppError("Notificação não encontrada.", 404);
            return await NotificationRepository.delete(id);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao deletar notificação.", 500);
        }
    },

    async markAsRead(id) {
        try {
            if (!id) throw new AppError("ID da notificação é obrigatório.", 400);
            const found = await NotificationRepository.findById(id);
            if (!found) throw new AppError("Notificação não encontrada.", 404);
            return await NotificationRepository.markAsRead(id);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao marcar notificação como lida.", 500);
        }
    }
}