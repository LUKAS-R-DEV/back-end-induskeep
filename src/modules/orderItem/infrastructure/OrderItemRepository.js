import prisma from "../../../infrastructure/database/prismaClient.js";

export const OrderItemRepository={
    async findAll(){
        return await prisma.orderItem.findMany({
            include:{
                piece:true,
                order:{include:{machine:true}},
            },
            orderBy: { usedAt: "desc" },
        });
    },

    async findById(id){
        return await prisma.orderItem.findUnique({
            where:{id},
            include:{
                piece:true,
                order:{include:{machine:true}},
            }
        })
    },

    async create(data){
        return await prisma.orderItem.create({data})
    },

    async delete(id){
        return await prisma.orderItem.delete({where:{id}})
    }
}