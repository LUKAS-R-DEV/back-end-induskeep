import prisma from "../../../infrastructure/database/prismaClient.js";

export const ExportRepository = {
  async getDataByModule(module, filters = {}) {
    switch (module) {
      case "users":
        return prisma.user.findMany({ include: { machines: true, orders: true } });
      case "machines":
        return prisma.machine.findMany({ include: { orders: true, schedules: true } });
      case "pieces":
        return prisma.piece.findMany({ include: { items: true } });
      case "orders":
        return prisma.maintenanceOrder.findMany({
          include: { user: true, machine: true, items: true, history: true },
        });
      case "stock":
        return prisma.stockMovement.findMany({
          include: { piece: true, user: true },
        });
      case "history":
        return prisma.history.findMany({
          include: { order: { include: { user: true, machine: true } } },
        });
      case "reports":
        // Por padrão exporta o histórico completo, alinhado com a página de Relatórios
        return prisma.history.findMany({
          include: { order: { include: { user: true, machine: true } } },
        });
      default:
        throw new Error(`Módulo não suportado: ${module}`);
    }
  },
};
