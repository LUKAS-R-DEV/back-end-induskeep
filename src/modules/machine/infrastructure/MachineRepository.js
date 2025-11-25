import prisma from "../../../infrastructure/database/prismaClient.js";

export const MachineRepository={
    async findAll(includeOrders = false){
        const include = {
            user: { select: { id: true, name: true, email: true } },
        };
        
        if (includeOrders) {
            include.orders = {
                select: { id: true, status: true, createdAt: true }
            };
        }
        
        return prisma.machine.findMany({
            include,
            orderBy: { name: "asc" },
        });
        
},

    async findById(id){
        if(!id) throw new Error("Id da maquina nao informado");
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