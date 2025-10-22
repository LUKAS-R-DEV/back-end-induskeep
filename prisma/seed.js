import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco...");

  // =======================
  // 1️⃣ Usuários
  // =======================
  const passwordHash = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@induskeep.com" },
    update: {},
    create: {
      name: "Admin Master",
      email: "admin@induskeep.com",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  const technician = await prisma.user.upsert({
    where: { email: "tech@induskeep.com" },
    update: {},
    create: {
      name: "Lucas Técnico",
      email: "tech@induskeep.com",
      password: passwordHash,
      role: "TECHNICIAN",
    },
  });

  console.log("✅ Usuários criados:", admin.email, technician.email);

  // =======================
  // 2️⃣ Máquinas
  // =======================
  const machinesData = [
    {
      name: "Compressor A12",
      serial: "CMP-A12",
      location: "Setor 1",
      status: "ACTIVE",
      userId: admin.id,
    },
    {
      name: "Esteira X55",
      serial: "EST-X55",
      location: "Setor 3",
      status: "ACTIVE",
      userId: admin.id,
    },
    {
      name: "Torno Mecânico Z100",
      serial: "TRN-Z100",
      location: "Setor 2",
      status: "MAINTENANCE",
      userId: admin.id,
    },
  ];
  await prisma.machine.createMany({ data: machinesData, skipDuplicates: true });
  console.log("✅ Máquinas criadas:", machinesData.length);

  // =======================
  // 3️⃣ Peças
  // =======================
  const piecesData = [
    { name: "Filtro de Ar", code: "FLTR-001", quantity: 10, minStock: 3, unitPrice: 25.5 },
    { name: "Correia 32mm", code: "COR-032", quantity: 20, minStock: 5, unitPrice: 15.0 },
    { name: "Óleo Lubrificante", code: "OIL-100", quantity: 5, minStock: 2, unitPrice: 39.9 },
    { name: "Parafuso X", code: "PX-01", quantity: 2, minStock: 5, unitPrice: 1.2 },
  ];
  await prisma.piece.createMany({ data: piecesData, skipDuplicates: true });
  console.log("✅ Peças criadas:", piecesData.length);

  // =======================
  // 4️⃣ Ordens de Manutenção
  // =======================
  const [machine1, machine2] = await prisma.machine.findMany();
  const orders = await prisma.maintenanceOrder.createMany({
    data: [
      {
        title: "Troca de filtro",
        description: "Filtro saturado detectado no compressor.",
        status: "PENDING",
        userId: technician.id,
        machineId: machine1.id,
      },
      {
        title: "Substituição de correia",
        description: "Correia desgastada na esteira X55.",
        status: "COMPLETED",
        userId: technician.id,
        machineId: machine2.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Ordens de manutenção criadas:", orders.count);

  // =======================
  // 5️⃣ Itens de Ordem
  // =======================
  const [piece1, piece2] = await prisma.piece.findMany({ take: 2 });
  const [order1, order2] = await prisma.maintenanceOrder.findMany();
  await prisma.orderItem.createMany({
    data: [
      { orderId: order1.id, pieceId: piece1.id, quantity: 1 },
      { orderId: order2.id, pieceId: piece2.id, quantity: 2 },
    ],
  });
  console.log("✅ Itens de ordem criados.");

  // =======================
  // 6️⃣ Agendamentos
  // =======================
  const schedule = await prisma.schedule.create({
    data: {
      date: new Date(Date.now() + 1000 * 60 * 60 * 24),
      notes: "Manutenção preventiva programada para amanhã.",
      userId: technician.id,
      machineId: machine1.id,
    },
  });
  console.log("✅ Agendamento criado:", schedule.id);

  // =======================
  // 7️⃣ Notificações
  // =======================
  await prisma.notification.create({
    data: {
      title: "Manutenção agendada",
      message: "Manutenção preventiva marcada para amanhã às 9h.",
      userId: technician.id,
      scheduleId: schedule.id,
    },
  });
  console.log("✅ Notificação criada.");

  // =======================
  // 8️⃣ Histórico
  // =======================
  await prisma.history.createMany({
    data: [
      {
        notes: "Troca de correia realizada com sucesso.",
        completedAt: new Date(),
        orderId: order2.id,
      },
      {
        notes: "Filtro substituído com sucesso.",
        completedAt: new Date(),
        orderId: order1.id,
      }
    ],
    skipDuplicates: true,
  });
  console.log("✅ Histórico criado.");

  // =======================
  // 9️⃣ Movimentações de estoque
  // =======================
  await prisma.stockMovement.createMany({
    data: [
      {
        pieceId: piece1.id,
        quantity: 3,
        type: "ENTRY",
        userId: admin.id,
      },
      {
        pieceId: piece2.id,
        quantity: 1,
        type: "EXIT",
        userId: admin.id,
      },
    ],
  });
  console.log("✅ Movimentações de estoque criadas.");

  // =======================
  // 🔟 Configurações iniciais
  // =======================
  const settings = await prisma.settings.upsert({
    where: { notificationEmail: "alerts@induskeep.com" },
    update: {},
    create: {
      minStockThreshold: 5,
      autoNotifyLowStock: true,
      defaultRepairDuration: 48,
      notificationEmail: "alerts@induskeep.com",
      maintenanceWindow: "08:00-17:00",
    },
  });

  console.log("✅ Configurações criadas:", settings.id);

  // =======================
  // 1️⃣1️⃣ Logs de auditoria simulados
  // =======================
  await prisma.auditLog.createMany({
    data: [
      {
        userId: admin.id,
        action: "Criação de máquina",
        module: "machines",
        route: "/api/machines",
        method: "POST",
        statusCode: 201,
        ip: "127.0.0.1",
        payload: { name: "Compressor A12", serial: "CMP-A12" },
      },
      {
        userId: technician.id,
        action: "Atualização de peça",
        module: "pieces",
        route: "/api/pieces/COR-032",
        method: "PUT",
        statusCode: 200,
        ip: "127.0.0.1",
        payload: { quantity: 18 },
      },
      {
        userId: admin.id,
        action: "Criação de ordem de manutenção",
        module: "maintenanceOrders",
        route: "/api/maintenanceOrders",
        method: "POST",
        statusCode: 201,
        ip: "127.0.0.1",
        payload: { title: "Troca de filtro", machine: "Compressor A12" },
      },
    ],
  });
  console.log("✅ Logs de auditoria simulados inseridos.");

  console.log("🌱 Seed completo com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
