import prisma from "../infrastructure/database/prismaClient.js";
import { NotificationService } from "../modules/notification/application/NotificationService.js";
import { SettingsService } from "../modules/settings/application/SettingsService.js";

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
