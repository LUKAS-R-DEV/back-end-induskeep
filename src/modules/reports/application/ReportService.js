import prisma from "../../../infrastructure/database/prismaClient.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const ReportService = {
    async getOverview() {
        try {
            const [
                totalOrders,
                completedOrders,
                pendingOrders,
                totalMachines,
                lowStockPieces,
                totalUsers
            ] = await Promise.all([
                prisma.maintenanceOrder.count(),
                prisma.maintenanceOrder.count({ where: { status: "COMPLETED" } }),
                prisma.maintenanceOrder.count({ where: { status: "PENDING" } }),
                prisma.machine.count(),
                prisma.piece.count({ where: { quantity: { lt: 5 } } }),
                prisma.user.count(),
            ]);

            return {
                totalMaintenanceOrders: totalOrders,
                completedOrders,
                pendingOrders,
                machinesActive: totalMachines,
                lowStockPieces,
                totalUsers,
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao gerar relatório de visão geral.", 500);
        }
    },
    async getHistory(startDate, endDate) {
        try {
            const filters = {
                where: {
                    completedAt: {},
                },
                include: {
                    order: {
                        include: {
                            machine: true,
                            user: { select: { id: true, name: true, email: true } },
                        },
                    },
                },
                orderBy: { completedAt: "desc" },
            };

            if (startDate) {
                filters.where.completedAt = {
                    gte: new Date(startDate)
                };
            }
            if (endDate) {
                filters.where.completedAt = {
                    ...filters.where.completedAt,
                    lte: new Date(endDate)
                };
            }

            return await prisma.history.findMany(filters);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao gerar relatório de histórico.", 500);
        }
    },
    async getStockCritical() {
        try {
            return await prisma.piece.findMany({
                where: { quantity: { lt: prisma.piece.fields.minStock } },
                select: { id: true, name: true, quantity: true, minStock: true },
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao gerar relatório de estoque crítico.", 500);
        }
    }
}
    
    
