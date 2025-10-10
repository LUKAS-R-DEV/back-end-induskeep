import { StockRepository } from "../infrastructure/StockRepository.js";
import { StockMovement } from "../domain/StockMovement.js";


export const StockService={
    async list(){
        return await StockRepository.findAll();
    },

    async move(data){
        const movement=new StockMovement(data);
        return await StockRepository.registerMovement(movement);
    }
}