import{MachineRepository} from "../infrastructure/MachineRepository.js";
import { Machine } from "../domain/Machine.js";

export const MachineService={
  async list(){
    return await MachineRepository.findAll();
  },
  async create(data){
    const existing=await MachineRepository.findBySerial(data.serial);
    if(existing){
        throw new Error("Maquina ja cadastrada");
    }
    const machine=new Machine(data)
    return await MachineRepository.create(machine);
  },
  async update (id,data){
    const found=await MachineRepository.findById(id);
    if(!found) throw new Error("Maquina nao encontrada");
    return await MachineRepository.update(id,data);
  },
  async remove(id){
    const found = await MachineRepository.findById(id);
    if(!found) throw new Error("Maquina nao encontrada");
    const hasOrders=await MachineRepository.hasOrders(id);
    if(hasOrders) throw new Error("Maquina possui ordens de manutencao");
    return await MachineRepository.delete(id);
  }

}