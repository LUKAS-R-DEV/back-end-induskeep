import prisma from "../../../infrastructure/database/prismaClient";

export const MachineRepository={
    async findAll(){
        return prisma.machine.findMany({
            include:{
               user: { select: { id: true, name: true, email: true } },  
            },
        });
        
},

    async findById(id){
        return prisma.machine.findUnique({where:{id}})
    },

    async findBySerial(serial){
        return prisma.machine.findUnique({where:{serial}})
    },

    async create(data){
        return prisma.machine.create({
            data:typeof data.toJSON === "function" ? data.toJSON() : {...data},
        })
    },
    async update (id,data){
        return prisma.machine.update({where:{id},data})
    },
    async delete(id){
        return prisma.machine.delete({where:{id}})
    },
    async hasOrders(id){
        const count=await prisma.maintenanceOrder.count({where:{machineId:id}})
        return count>0
    },

};