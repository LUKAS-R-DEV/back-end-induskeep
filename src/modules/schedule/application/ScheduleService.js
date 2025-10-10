import { ScheduleRepository } from "../infrastructure/ScheduleRepository.js";
import { Schedule } from "../domain/Schedule.js";

export const ScheduleService={
    async list(){
        return await ScheduleRepository.findAll();
    },
    async create(data){
        const schedule=new Schedule(data);
        return await ScheduleRepository.create(schedule.toJson());
    },
    async update(id,data){
        const found=await ScheduleRepository.findById(id);
        if(!found) throw new Error('agendamento nao encontrado');
        return await ScheduleRepository.update(id,data);
    },
    async remove(id){
        const found=await ScheduleRepository.findById(id);
        if(!found) throw new Error('agendamento nao encontrado');
        return await ScheduleRepository.delete(id);
    }
}