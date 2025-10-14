import prisma from "../../../infrastructure/database/prismaClient.js";

export const AuditLogRepository = {
  async create(data) {
    return prisma.auditLog.create({ data });
  },
  async list({ page = 1, pageSize = 20, module, action, userId }) {
    const where = {
      ...(module ? { module } : {}),
      ...(action ? { action } : {}),
      ...(userId ? { userId } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      prisma.auditLog.count({ where }),
    ]);
    return { items, total, page, pageSize };
  },
  async purgeOlderThan(dateISO) {
    return prisma.auditLog.deleteMany({ where: { createdAt: { lt: new Date(dateISO) } } });
  }
};
