import { ScheduleRepository } from "../infrastructure/ScheduleRepository.js";
import { Schedule } from "../domain/Schedule.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const ScheduleService = {
    async list() {
        try {
            return await ScheduleRepository.findAll();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao buscar agendamentos.", 500);
        }
    },

    async create(data) {
        try {
            const schedule = new Schedule(data);
            return await ScheduleRepository.create(schedule.toJson());
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao criar agendamento.", 500);
        }
    },

    async update(id, data) {
        try {
            if (!id) throw new AppError("ID do agendamento é obrigatório.", 400);
            
            const found = await ScheduleRepository.findById(id);
            if (!found) throw new AppError("Agendamento não encontrado.", 404);
            
            return await ScheduleRepository.update(id, data);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao atualizar agendamento.", 500);
        }
    },

    async remove(id) {
        try {
            if (!id) throw new AppError("ID do agendamento é obrigatório.", 400);
            
            const found = await ScheduleRepository.findById(id);
            if (!found) throw new AppError("Agendamento não encontrado.", 404);
            
            return await ScheduleRepository.delete(id);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao remover agendamento.", 500);
        }
    }
}