import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco...");

  // ========== 1️⃣ Usuário Admin ==========
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

  console.log("✅ Usuário admin criado:", admin.email);

  // ========== 2️⃣ Máquinas ==========
  const machines = await prisma.machine.createMany({
    data: [
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
    ],
    skipDuplicates: true,
  });

  console.log("✅ Máquinas criadas:", machines.count);

  // ========== 3️⃣ Peças ==========
  const pieces = await prisma.piece.createMany({
    data: [
      {
        name: "Filtro de Ar",
        code: "FLTR-001",
        quantity: 10,
        minStock: 3,
        unitPrice: 25.5,
      },
      {
        name: "Correia 32mm",
        code: "COR-032",
        quantity: 20,
        minStock: 5,
        unitPrice: 15.0,
      },
      {
        name: "Óleo Lubrificante",
        code: "OIL-100",
        quantity: 5,
        minStock: 2,
        unitPrice: 39.9,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Peças criadas:", pieces.count);

  console.log("🌱 Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
