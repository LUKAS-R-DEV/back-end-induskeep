import prisma from "../../../infrastructure/database/prismaClient.js";

export const MaintenanceOrderRepository = {
  async findAll(userId = null) {
    const where = userId ? { userId } : {};
    return await prisma.maintenanceOrder.findMany({
      where,
      include: {
        machine: true,
        user: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id) {
    try {
      const order = await prisma.maintenanceOrder.findUnique({
        where: { id },
        include: {
          machine: {
            select: {
              id: true,
              name: true,
              serial: true,
              location: true,
              status: true
            }
          },
          user: { 
            select: { id: true, name: true, email: true } 
          },
          createdBy: { 
            select: { id: true, name: true, email: true } 
          },
        },
      });
      
      return order;
    } catch (error) {
      console.error("❌ Erro no findById do MaintenanceOrderRepository:", error);
      console.error("❌ Detalhes:", { 
        id, 
        errorCode: error.code, 
        errorMessage: error.message,
        errorName: error.name,
        errorMeta: error.meta
      });
      throw error;
    }
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

