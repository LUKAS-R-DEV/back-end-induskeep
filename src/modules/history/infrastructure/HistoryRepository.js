import prisma from "../../../infrastructure/database/prismaClient.js";

export const HistoryRepository={

    async findAll(){
        return await prisma.history.findMany({
            include:{
                order:{
                    include:{
                        machine:true,
                        user:{select:{id:true,name:true,email:true}},
                    },
                },
            },
            orderBy:{ completedAt: "desc" },
        });
    },

    async findByOrder(orderId){
        return await prisma.history.findMany({
            where:{orderId},
            include:{
                order:{
                    include:{
                        machine:true,
                        user:{select:{id:true,name:true,email:true}},
                    },
                },
            },
            orderBy:{ completedAt: "desc" },
        });
    },

    async create(data) {
    return await prisma.history.create({
      data, // agora o Prisma recebe o objeto corretamente
      include: {
        order: {
          include: {
            machine: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  },
};

