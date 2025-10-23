import { ScheduleRepository } from "../infrastructure/ScheduleRepository.js";
import { Schedule } from "../domain/Schedule.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { MachineRepository } from "../../machine/infrastructure/MachineRepository.js";
import { NotificationService } from "../../notification/application/NotificationService.js";

export const ScheduleService = {
  // 📍 Lista todos os agendamentos
  async list() {
    try {
      return await ScheduleRepository.findAll();
    } catch (error) {
      console.error("❌ Erro ao listar agendamentos:", error);
      throw new AppError("Erro interno ao listar agendamentos.", 500);
    }
  },

  // 📍 Cria um novo agendamento
  async create(data) {
    if (!data.machineId || !data.date || !data.notes ) {
      throw new AppError("Campos obrigatórios ausentes: machineId, date e notes", 400);
    }
    let machine = null;
    if (data.machineId) {
      machine = await MachineRepository.findById(data.machineId);
      if (!machine) {
        throw new AppError("Máquina nao encontrada.", 404);
      }
    }

    try {
      const schedule = new Schedule(data);
      const created = await ScheduleRepository.create(schedule.toJson());

      // Notificação imediata de criação do agendamento (deduplicada por 60 minutos)
      try {
        await NotificationService.createIfNotExists({
          title: "Agendamento criado",
          message: `Agendamento #${created.id} para a máquina "${machine?.name ?? ""}" em ${new Date(created.date).toISOString()}`,
          userId: created.userId ?? null,
          scheduleId: created.id,
          windowMinutes: 60,
        });
      } catch (_) {
        // Não quebrar fluxo do create por falha de notificação
      }

      return created;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao criar agendamento:", error);
      throw new AppError("Erro interno ao criar agendamento.", 500);
    }
  },

  // 📍 Atualiza um agendamento
  async update(id, data) {
    if (!id) {
      throw new AppError("ID do agendamento não informado.", 400);
    }
    if (!Object.keys(data).length) {
      throw new AppError("Nenhum dado informado para atualização.", 400);
    }

    const found = await ScheduleRepository.findById(id);
    if (!found) {
      throw new AppError("Agendamento não encontrado.", 404);
    }

    try {
      return await ScheduleRepository.update(id, data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao atualizar agendamento:", error);
      throw new AppError("Erro interno ao atualizar agendamento.", 500);
    }
  },

  // 📍 Remove um agendamento
  async remove(id) {
    if (!id) {
      throw new AppError("ID do agendamento não informado.", 400);
    }

    const found = await ScheduleRepository.findById(id);
    if (!found) {
      throw new AppError("Agendamento não encontrado.", 404);
    }

    try {
      await ScheduleRepository.delete(id);
      return { message: "Agendamento removido com sucesso." };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao remover agendamento:", error);
      throw new AppError("Erro interno ao remover agendamento.", 500);
    }
  },

  // 📍 Busca um agendamento por ID
  async findById(id) {
    if (!id) {
      throw new AppError("ID do agendamento não informado.", 400);
    }

    try {
      const schedule = await ScheduleRepository.findById(id);
      if (!schedule) {
        throw new AppError("Agendamento não encontrado.", 404);
      }
      return schedule;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao buscar agendamento:", error);
      throw new AppError("Erro interno ao buscar agendamento.", 500);
    }
  },

  // 📍 Busca agendamentos por máquina
  async findByMachine(machineId) {
    if (!machineId) {
      throw new AppError("ID da máquina não informado.", 400);
    }

    try {
      return await ScheduleRepository.findByMachine(machineId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao buscar agendamentos por máquina:", error);
      throw new AppError("Erro interno ao buscar agendamentos por máquina.", 500);
    }
  },

  // 📍 Busca agendamentos por período
  async findByPeriod(startDate, endDate) {
    if (!startDate || !endDate) {
      throw new AppError("Data inicial e final são obrigatórias.", 400);
    }

    try {
      return await ScheduleRepository.findByPeriod(startDate, endDate);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao buscar agendamentos por período:", error);
      throw new AppError("Erro interno ao buscar agendamentos por período.", 500);
    }
  },
};