import prisma from "../infrastructure/database/prismaClient.js";
import { NotificationService } from "../modules/notification/application/NotificationService.js";
import { SettingsService } from "../modules/settings/application/SettingsService.js";

// Envia lembretes de agendamento 3 dias antes para o criador
export async function sendScheduleReminders3Days() {
  const now = new Date();
  // Calcula 3 dias a partir de agora (72 horas)
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  // Janela de 24 horas para capturar agendamentos que estão entre 3 e 4 dias no futuro
  const in4Days = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);

  const schedules = await prisma.schedule.findMany({
    where: {
      date: { 
        gte: in3Days, 
        lt: in4Days 
      },
    },
    include: { 
      machine: true, 
      createdBy: { select: { id: true, name: true } },
      user: { select: { id: true, name: true } }
    },
    orderBy: { date: "asc" },
  });

  let created = 0;
  for (const s of schedules) {
    // Notifica apenas o criador do agendamento (não o técnico atribuído)
    if (s.createdById) {
      const scheduleDate = new Date(s.date);
      const dateStr = scheduleDate.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const title = "Lembrete de Agendamento - 3 Dias";
      const message = `Faltam 3 dias para o agendamento da máquina "${s.machine?.name || "(sem nome)"}" em ${dateStr}`;
      
      const res = await NotificationService.createIfNotExists({
        title,
        message,
        userId: s.createdById,
        scheduleId: s.id,
        windowMinutes: 1440, // Evita duplicatas no mesmo dia
      });
      if (res?.id) created++;
    }
  }
  return { scanned: schedules.length, created };
}

// Envia lembretes de agendamento 24h antes
export async function sendScheduleReminders() {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const schedules = await prisma.schedule.findMany({
    where: {
      date: { gte: now, lte: in24h },
    },
    include: { machine: true, user: { select: { id: true, name: true } } },
    orderBy: { date: "asc" },
  });

  let created = 0;
  for (const s of schedules) {
    const title = "Lembrete de manutenção";
    const message = `Agendamento #${s.id} para a máquina "${s.machine?.name || "(sem nome)"}" em ${s.date.toISOString()}`;
    const res = await NotificationService.createIfNotExists({
      title,
      message,
      userId: s.user?.id || null,
      scheduleId: s.id,
      windowMinutes: 1440,
    });
    if (res?.id) created++;
  }
  return { scanned: schedules.length, created };
}

// Notifica ordens atrasadas com base em defaultRepairDuration (minutos)
export async function notifyOverdueOrders() {
  const settings = await SettingsService.get();
  const durationMin = settings.defaultRepairDuration || 0;
  if (!durationMin) return { scanned: 0, created: 0 };

  const threshold = new Date(Date.now() - durationMin * 60 * 1000);

  const orders = await prisma.maintenanceOrder.findMany({
    where: {
      status: { not: "COMPLETED" },
      createdAt: { lte: threshold },
    },
    include: { machine: true, user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  let created = 0;
  for (const o of orders) {
    const title = "Ordem de manutenção atrasada";
    const message = `Ordem #${o.id} para máquina "${o.machine?.name || "(sem nome)"}" está atrasada (criada em ${o.createdAt.toISOString()}).`;
    const res = await NotificationService.createIfNotExists({
      title,
      message,
      userId: o.user?.id || null,
      windowMinutes: 1440,
    });
    if (res?.id) created++;
  }
  return { scanned: orders.length, created };
}

// Envia um resumo diário de notificações não lidas por usuário
export async function sendDailyDigest() {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  // Agrupa por usuário as não lidas
  const unreadByUser = await prisma.notification.groupBy({
    by: ["userId"],
    where: { read: false, userId: { not: null } },
    _count: { _all: true },
  });

  let created = 0;
  for (const row of unreadByUser) {
    if (!row.userId) continue;
    const count = row._count._all;
    if (count <= 0) continue;

    const title = "Resumo diário de notificações";
    const message = `Você possui ${count} notificações não lidas.`;

    const res = await NotificationService.createIfNotExists({
      title,
      message,
      userId: row.userId,
      windowMinutes: 1440,
    });
    if (res?.id) created++;
  }
  return { users: unreadByUser.length, created };
}
