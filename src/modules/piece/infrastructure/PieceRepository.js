import prisma from "../../../infrastructure/database/prismaClient.js";

export const PieceRepository={
    async findAll(){
        return prisma.Piece.findMany(); //return Prisma.Piece.findMany();
    },
    async findById(id){
        return prisma.Piece.findUnique({where:{id}})
    },
    async findByCode(code){
        return prisma.Piece.findUnique({where:{code}})
    },
    async create(data){
        return prisma.Piece.create({data})
    },
    async update(id,data){
        return prisma.Piece.update({where:{id},data})
    },
    async countOrderItemsByPieceId(pieceId){
        return prisma.orderItem.count({ where: { pieceId } });
    },
    async countStockMovementsByPieceId(pieceId){
        return prisma.stockMovement.count({ where: { pieceId } });
    },
    async delete(id){
        return prisma.Piece.delete({where:{id}})
    }
}