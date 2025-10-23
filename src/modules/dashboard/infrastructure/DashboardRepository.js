import prisma from "../../../infrastructure/database/prismaClient.js";

export const DashboardRepository = {
    async getSumary(){
        const [
            totalMachines,
            totalOrders,
            pendingOrders,
            completedOrders,
            totalPieces,
            settings,
        ] = await Promise.all([
            prisma.machine.count(),
            prisma.maintenanceOrder.count(),
            prisma.maintenanceOrder.count({ where: { status: "PENDING" } }),
            prisma.maintenanceOrder.count({ where: { status: "COMPLETED" } }),
            prisma.piece.count(),
            prisma.settings.findFirst(),
        ]);

        let overdueOrders = 0;
        const durationMin = settings?.defaultRepairDuration || 0;
        if (durationMin > 0) {
            const threshold = new Date(Date.now() - durationMin * 60 * 1000);
            overdueOrders = await prisma.maintenanceOrder.count({
                where: {
                    status: { not: "COMPLETED" },
                    createdAt: { lte: threshold },
                },
            });
        }

        const completionRate = totalOrders > 0 ? Number((completedOrders / totalOrders).toFixed(2)) : 0;

        return {
            totalMachines,
            totalOrders,
            pendingOrders,
            completedOrders,
            totalPieces,
            overdueOrders,
            completionRate,
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