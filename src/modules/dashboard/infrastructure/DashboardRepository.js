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

        // Contar agendamentos atrasados (data passou e ainda não foram executados)
        const now = new Date();
        const overdueSchedulesWhere = userId 
            ? { userId, date: { lt: now } }
            : { date: { lt: now } };
        
        const overdueSchedules = await prisma.schedule.count({
            where: overdueSchedulesWhere,
        });

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
            overdueSchedules,
            completionRate,
        }
    },
    async getLowStockPieces(){
        // Estoque crítico: apenas peças com quantidade <= 0 (sem estoque)
        // Isso alinha com a lógica da página de estoque onde:
        // - crítico = quantity <= 0
        // - baixo = quantity <= minStock (mas > 0)
        return prisma.piece.findMany({
            where: { quantity: { lte: 0 } },
            select: { id: true, name: true, code: true, quantity: true }
        });
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