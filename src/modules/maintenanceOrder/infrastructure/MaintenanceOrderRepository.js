import prisma from "../../../infrastructure/database/prismaClient.js";

export const MaintenanceOrderRepository = {
  async findAll() {
    return await prisma.maintenanceOrder.findMany({
      include: {
        machine: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id) {
    return await prisma.maintenanceOrder.findUnique({
      where: { id },
      include: {
        machine: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async create(data) {
    return await prisma.maintenanceOrder.create({ data });
  },

  async update(id, data) {
    return await prisma.maintenanceOrder.update({ where: { id }, data });
  },

  async delete(id) {
    return await prisma.maintenanceOrder.delete({ where: { id } });
  },
};

