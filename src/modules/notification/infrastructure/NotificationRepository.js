import prisma from "../../../infrastructure/database/prismaClient.js";

export const NotificationRepository={

    async findAllByUser(userId){
        return await prisma.notification.findMany({
            where:{userId},
            include:{
                schedule:{
                    include:{
                        machine:true
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        })
    },

    async findAll(){
      return await prisma.notification.findMany({
        include:{
                schedule:{
                    include:{
                        machine:true
                    },
                },
            },
            orderBy: { createdAt: "desc" },
      })
    },
    async create(data) {
  return await prisma.notification.create({
    data: {
      title: data.title||"Notificação do sistema",
      message: data.message,
      read: data.read ?? false,
      createdAt: data.createdAt ?? new Date(),
      ...(data.userId && {
        user: { connect: { id: data.userId } },
      }),
      ...(data.scheduleId && {
        schedule: { connect: { id: data.scheduleId } },
      }),
    },
  });
},

    async markAsRead(id){
        return await prisma.notification.update({where:{id},data:{read:true}})
    },
    async delete(id){
        return await prisma.notification.delete({where:{id}})
    }


}
