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

    async update(id, data){
        return await prisma.orderItem.update({
            where: { id },
            data
        })
    },

    async delete(id){
        return await prisma.orderItem.delete({where:{id}})
    },

    async findByOrder(orderId){
        return await prisma.orderItem.findMany({
            where: { orderId },
            include: {
                piece: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        quantity: true,
                        unitPrice: true
                    }
                }
            },
            orderBy: { usedAt: 'desc' }
        })
    }
}