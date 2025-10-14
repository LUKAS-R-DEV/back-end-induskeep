import { MachineRepository } from "../infrastructure/MachineRepository.js";
import { Machine } from "../domain/Machine.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const MachineService = {
  // 📍 Lista todas as máquinas
  async list() {
    return await MachineRepository.findAll();
  },


  async create({ name, serial, location, userId }) {
    if (!name || !serial || !userId) {
      throw new AppError("Campos obrigatórios ausentes: name, serial e userId.", 400);
    }

    const existing = await MachineRepository.findBySerial(serial);
    if (existing) {
      throw new AppError("Número de série já cadastrado.", 409);
    }

    try {
      const machine = new Machine(name, serial, location, userId);
      return await MachineRepository.create(machine.toJson());
    } catch (error) {
      console.error("❌ Erro ao criar máquina:", error);
      throw new AppError("Erro interno ao criar máquina.", 500);
    }
  },

 
  async update(id, data) {
    if (!id) throw new AppError("ID da máquina não informado.", 400);
    if (!Object.keys(data).length) throw new AppError("Nenhum dado informado para atualização.", 400);

    const machine = await MachineRepository.findById(id);
    if (!machine) {
      throw new AppError("Máquina não encontrada.", 404);
    }

    try {
      return await MachineRepository.update(id, data);
    } catch (error) {
      console.error("❌ Erro ao atualizar máquina:", error);
      throw new AppError("Erro interno ao atualizar máquina.", 500);
    }
  },

  async remove(id) {
    if (!id) throw new AppError("ID da máquina não informado.", 400);

    const machine = await MachineRepository.findById(id);
    if (!machine) {
      throw new AppError("Máquina não encontrada.", 404);
    }

    try {
      await MachineRepository.delete(id);
      return { message: "Máquina removida com sucesso." };
    } catch (error) {
      console.error("❌ Erro ao excluir máquina:", error);
      throw new AppError("Erro interno ao excluir máquina.", 500);
    }
  },
};
