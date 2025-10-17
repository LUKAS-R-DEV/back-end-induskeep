import prisma from "../../../infrastructure/database/prismaClient.js";

export const DashboardRepository = {
    async getSumary(){
        const totalMachines = await prisma.machine.count();
        const totalOrders = await prisma.maintenanceOrder.count();
        const pendingOrders = await prisma.maintenanceOrder.count({ where: { status: "PENDING" } });
        const completedOrders=await prisma.maintenanceOrder.count({ where: { status: "COMPLETED" } });
        const totalPieces=await prisma.piece.count();

        return {
            totalMachines,
            totalOrders,
            pendingOrders,
            completedOrders,
            totalPieces
        }
    },
    async getLowStockPieces(){
        const settings=await prisma.settings.findFirst();
        const minStock=settings?.minStockThreshold?? 5;
        return prisma.piece.findMany({where:{quantity:{lt:minStock}},
            select:{id:true,name:true,code:true,quantity:true}});
            
        },
    async getRecentOrders(){
        return await prisma.maintenanceOrder.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                machine: true,
                user: { select: { id: true, name: true} },
            },
        })
    }
}