import { NotificationRepository } from "../infrastructure/NotificationRepository.js";
import {Notification} from "../domain/Notification.js";

export const NotificationService={
    async listByUser(userId){
        return await NotificationRepository.findAllByUser(userId)
    },
    async create(data){
        if(!data.scheduleId && !data.userId){
            console.log("Campos obrigatório:scheduleId ou userId");
        }
        const notification=new Notification(data);
        return await NotificationRepository.create(notification.toJSON());

        
    },
    async delete(id){
        return await NotificationRepository.delete(id);
    },
    async markAsRead(id){
        return await NotificationRepository.markAsRead(id);
    }
}