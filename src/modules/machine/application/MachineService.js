import { MachineRepository } from "../infrastructure/MachineRepository.js";
import { Machine } from "../domain/Machine.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const MachineService={
  async list(){
    return await MachineRepository.findAll();
  },
  async create(data){
    try {
      const existing = await MachineRepository.findBySerial(data.serial);
      if(existing){
        throw new AppError("Máquina já cadastrada com este número de série.", 409);
      }
      const machine = new Machine(data);
      return await MachineRepository.create(machine);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao criar máquina.", 500);
    }
  },
  async update(id, data){
    try {
      const found = await MachineRepository.findById(id);
      if(!found) throw new AppError("Máquina não encontrada.", 404);
      return await MachineRepository.update(id, data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao atualizar máquina.", 500);
    }
  },
  async remove(id){
    try {
      const found = await MachineRepository.findById(id);
      if(!found) throw new AppError("Máquina não encontrada.", 404);
      
      const hasOrders = await MachineRepository.hasOrders(id);
      if(hasOrders) throw new AppError("Não é possível excluir máquina que possui ordens de manutenção.", 409);
      
      return await MachineRepository.delete(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Erro ao remover máquina.", 500);
    }
  }

};