import prisma from "../../../infrastructure/database/prismaClient.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const ReportService = {
  // 📍 Gera relatório de visão geral
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
      console.error("❌ Erro ao gerar relatório de visão geral:", error);
      throw new AppError("Erro interno ao gerar relatório de visão geral.", 500);
    }
  },

  // 📍 Gera relatório de histórico
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
      console.error("❌ Erro ao gerar relatório de histórico:", error);
      throw new AppError("Erro interno ao gerar relatório de histórico.", 500);
    }
  },

  // 📍 Gera relatório de estoque crítico
  async getStockCritical() {
    try {
      return await prisma.piece.findMany({
        where: { quantity: { lt: prisma.piece.fields.minStock } },
        select: { id: true, name: true, quantity: true, minStock: true },
      });
    } catch (error) {
      console.error("❌ Erro ao gerar relatório de estoque crítico:", error);
      throw new AppError("Erro interno ao gerar relatório de estoque crítico.", 500);
    }
  },

  // 📍 Gera relatório de máquinas
  async getMachinesReport() {
    try {
      return await prisma.machine.findMany({
        include: {
          maintenanceOrders: {
            select: {
              id: true,
              status: true,
              priority: true,
              createdAt: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("❌ Erro ao gerar relatório de máquinas:", error);
      throw new AppError("Erro interno ao gerar relatório de máquinas.", 500);
    }
  },

  // 📍 Gera relatório de usuários
  async getUsersReport() {
    try {
      return await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
    } catch (error) {
      console.error("❌ Erro ao gerar relatório de usuários:", error);
      throw new AppError("Erro interno ao gerar relatório de usuários.", 500);
    }
  },

  // 📍 Gera relatório de movimentações de estoque
  async getStockMovements(startDate, endDate) {
    try {
      const filters = {
        include: {
          piece: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      };

      if (startDate || endDate) {
        filters.where = {
          createdAt: {},
        };
        
        if (startDate) {
          filters.where.createdAt.gte = new Date(startDate);
        }
        if (endDate) {
          filters.where.createdAt.lte = new Date(endDate);
        }
      }

      return await prisma.stockMovement.findMany(filters);
    } catch (error) {
      console.error("❌ Erro ao gerar relatório de movimentações de estoque:", error);
      throw new AppError("Erro interno ao gerar relatório de movimentações de estoque.", 500);
    }
  },
};
    
    
