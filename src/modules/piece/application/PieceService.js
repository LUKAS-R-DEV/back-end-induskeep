import { PieceRepository } from "../infrastructure/PieceRepository.js";
import { Piece } from "../domain/Piece.js";

export const PieceService={
    async list(){
        return await PieceRepository.findAll();
    },
    async create(data){
        const existing=await PieceRepository.findByCode(data.code);
        if(existing) throw new Error('peça ja cadastrada')
            const piece=new Piece(data);
            return await PieceRepository.create(piece);
    },
    async update(id,data){
        const found=await PieceRepository.findById(id);
        if(!found) throw new Error('peça nao encontrada');
        return await PieceRepository.update(id,data);
    },
    async remove(id){
        const found=await PieceRepository.findById(id);
        if(!found) throw new Error('peça nao encontrada');
        return await PieceRepository.delete(id);
    }
}