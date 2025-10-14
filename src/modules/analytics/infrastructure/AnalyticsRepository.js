import prisma from "../../../infrastructure/database/prismaClient.js";

export const AnalyticsRepository = {
  async getGeneralStats() {
    const totalMachines = await prisma.machine.count();
    const totalOrders = await prisma.maintenanceOrder.count();
    const completedOrders = await prisma.maintenanceOrder.count({ where: { status: "COMPLETED" } });
    const totalPiecesUsed = await prisma.orderItem.aggregate({
      _sum: { quantity: true },
    });

    return {
      totalMachines,
      totalOrders,
      completedOrders,
      totalPiecesUsed: totalPiecesUsed._sum.quantity || 0,
    };
  },

  async getAvgRepairTime() {
    const histories = await prisma.history.findMany({
      include: { order: true },
    });

    if (histories.length === 0) return 0;

    const diffs = histories.map(h => {
      const start = new Date(h.order.createdAt);
      const end = new Date(h.completedAt);
      return (end - start) / (1000 * 60 * 60); // horas
    });

    const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    return Number(avg.toFixed(2));
  },

  async getAvgFailureInterval() {
    const schedules = await prisma.schedule.findMany({
      orderBy: { date: "asc" },
    });

    if (schedules.length < 2) return 0;

    const diffs = [];
    for (let i = 1; i < schedules.length; i++) {
      const diff =
        (new Date(schedules[i].date) - new Date(schedules[i - 1].date)) /
        (1000 * 60 * 60 * 24); // dias
      diffs.push(diff);
    }

    const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    return Number(avg.toFixed(2));
  },
};
