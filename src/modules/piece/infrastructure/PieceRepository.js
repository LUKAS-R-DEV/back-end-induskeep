import { Prisma } from "@prisma/client";
export const PieceRepository={
    async findAll(){
        return Prisma.Piece.findMany();
    },
    async findById(id){
        return Prisma.Piece.findUnique({where:{id}})
    },
    async findByCode(code){
        return Prisma.Piece.findUnique({where:{code}})
    },
    async create(data){
        return Prisma.Piece.create({data})
    },
    async update(id,data){
        return Prisma.Piece.update({where:{id},data})
    },
    async delete(id){
        return Prisma.Piece.delete({where:{id}})
    }
}