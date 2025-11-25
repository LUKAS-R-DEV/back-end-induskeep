import prisma from "../../../infrastructure/database/prismaClient.js";

export const AnalyticsRepository = {
  async getGeneralStats() {
    const totalMachines = await prisma.machine.count();
    const totalOrders = await prisma.maintenanceOrder.count();
    const completedOrders = await prisma.maintenanceOrder.count({ where: { status: "COMPLETED" } });
    const pendingOrders = await prisma.maintenanceOrder.count({ where: { status: "PENDING" } });
    const inProgressOrders = await prisma.maintenanceOrder.count({ where: { status: "IN_PROGRESS" } });
    const totalTechnicians = await prisma.user.count({ where: { role: "TECHNICIAN", isActive: true } });
    
    // Peças usadas no último mês (últimos 30 dias) - métrica mais útil que total acumulado
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const piecesUsedLastMonth = await prisma.orderItem.aggregate({
      _sum: { quantity: true },
      where: {
        usedAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    // Contar agendamentos atrasados (data passou e ainda não foram executados)
    const now = new Date();
    const overdueSchedules = await prisma.schedule.count({
      where: { date: { lt: now } },
    });

    return {
      totalMachines,
      totalOrders,
      completedOrders,
      pendingOrders,
      inProgressOrders,
      totalTechnicians,
      overdueSchedules,
      piecesUsedLastMonth: piecesUsedLastMonth._sum.quantity || 0,
    };
  },

  async getAvgRepairTime() {
    // MTTR: Tempo médio de reparo
    // Calcula o tempo desde a criação da ordem até a conclusão
    // (considerando que a ordem é criada quando a falha é detectada)
    const histories = await prisma.history.findMany({
      include: { order: true },
    });

    if (histories.length === 0) return null;

    const diffs = histories
      .map(h => {
        if (!h.order || !h.order.createdAt || !h.completedAt) return null;
        
        const start = new Date(h.order.createdAt);
        const end = new Date(h.completedAt);
        
        // Validar datas
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
        
        const diffHours = (end - start) / (1000 * 60 * 60);
        
        // Ignora valores negativos ou muito grandes (possíveis erros de dados)
        // Aceita valores entre 0.01 horas (36 segundos) e 8760 horas (1 ano)
        return diffHours > 0.01 && diffHours < 8760 ? diffHours : null;
      })
      .filter(d => d !== null);

    if (diffs.length === 0) return null;

    const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    return Number(avg.toFixed(2));
  },

  async getAvgFailureInterval() {
    // MTBF: Intervalo médio entre falhas
    // Calcula o tempo entre ordens concluídas da mesma máquina
    const histories = await prisma.history.findMany({
      include: { 
        order: {
          include: { machine: true }
        }
      },
      orderBy: { completedAt: "asc" },
    });

    if (histories.length < 2) return null;

    // Agrupa por máquina
    const machineOrders = {};
    histories.forEach(h => {
      if (!h.order || !h.order.machineId || !h.completedAt) return;
      const machineId = h.order.machineId;
      if (!machineOrders[machineId]) {
        machineOrders[machineId] = [];
      }
      machineOrders[machineId].push(h.completedAt);
    });

    // Calcula intervalos entre falhas para cada máquina
    const allDiffs = [];
    Object.values(machineOrders).forEach(completionDates => {
      if (completionDates.length < 2) return;
      
      for (let i = 1; i < completionDates.length; i++) {
        const date1 = new Date(completionDates[i - 1]);
        const date2 = new Date(completionDates[i]);
        
        // Validar datas
        if (Number.isNaN(date1.getTime()) || Number.isNaN(date2.getTime())) continue;
        
        const diff = (date2 - date1) / (1000 * 60 * 60); // horas
        // Ignora valores negativos ou muito grandes
        // Aceita valores entre 0.01 horas e 87600 horas (~10 anos)
        if (diff > 0.01 && diff < 87600) {
          allDiffs.push(diff);
        }
      }
    });

    if (allDiffs.length === 0) return null;

    const avg = allDiffs.reduce((a, b) => a + b, 0) / allDiffs.length;
    return Number(avg.toFixed(2));
  },
};
