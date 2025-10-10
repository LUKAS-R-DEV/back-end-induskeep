import prisma from "../../../infrastructure/database/prismaClient.js";

export const ScheduleRepository={
    async findAll(){
        return await prisma.schedule.findMany({
            include:{
                user:{select:{id:true,name:true,email:true}},
                machine:true,
            },
            orderBy: { date: "desc" },
        });
    },
    async findById(id){
        return await prisma.schedule.findUnique({
            where:{id},
            include:{
                user:{select:{id:true,name:true,email:true}},
                machine:true,
            }
        })
    },

    async create(data){
        return await prisma.schedule.create({data})
    },

    async update(id,data){
        return await prisma.schedule.update({where:{id},data})
    },

    async delete(id){
        return await prisma.schedule.delete({where:{id}})
    }

}