import prisma from "../../../infrastructure/database/prismaClient.js";

export const DashboardRepository = {
    async getSumary(userId = null){
        // Se userId for fornecido (técnico), filtra apenas ordens atribuídas a ele
        const whereClause = userId ? { userId } : {};
        
        const [
            totalMachines,
            totalOrders,
            pendingOrders,
            completedOrders,
            totalPieces,
            settings,
        ] = await Promise.all([
            userId ? Promise.resolve(0) : prisma.machine.count(), // Técnico não precisa ver total de máquinas
            prisma.maintenanceOrder.count({ where: whereClause }),
            prisma.maintenanceOrder.count({ where: { ...whereClause, status: "PENDING" } }),
            prisma.maintenanceOrder.count({ where: { ...whereClause, status: "COMPLETED" } }),
            userId ? Promise.resolve(0) : prisma.piece.count(), // Técnico não precisa ver total de peças
            prisma.settings.findFirst(),
        ]);

        let overdueOrders = 0;
        const durationMin = settings?.defaultRepairDuration || 0;
        if (durationMin > 0) {
            const threshold = new Date(Date.now() - durationMin * 60 * 1000);
            overdueOrders = await prisma.maintenanceOrder.count({
                where: {
                    ...whereClause,
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
    async getRecentOrders(userId = null){
        const whereClause = userId ? { userId } : {};
        return await prisma.maintenanceOrder.findMany({
            where: whereClause,
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                machine: true,
                user: { select: { id: true, name: true} },
            },
        })
    }
}