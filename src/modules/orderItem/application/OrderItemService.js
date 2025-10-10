import { OrderItemRepository } from "../infrastructure/OrderItemRepository.js";
import {PieceRepository} from "../../piece/infrastructure/PieceRepository.js"
import { OrderItem } from "../domain/OrderItem.js";

export const OrderItemService={
    async list(){
        return await OrderItemRepository.findAll();
    },

    async create(data){
        const piece=await PieceRepository.findById(data.pieceId);
        if(!piece) throw new Error('peça nao encontrada');
        if(piece.quantity<data.quantity) throw new Error('quantidade insuficiente');
        const item=new OrderItem(data);
        await PieceRepository.update(piece.id,{quantity:piece.quantity-data.quantity});
        return await OrderItemRepository.create(item);
    },

    async remove(id){
        const found=await OrderItemRepository.findById(id)
        if(!found) throw new Error('item nao encontrado');
        const piece=await PieceRepository.findById(found.pieceId);
        await PieceRepository.update(found.pieceId,{quantity:piece.quantity+found.quantity});
        return await OrderItemRepository.delete(id);
    }
    
}