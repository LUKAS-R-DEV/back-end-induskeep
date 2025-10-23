import prisma from "../../../infrastructure/database/prismaClient.js";

export const AuditLogRepository = {
  async create(data) {
    // Normaliza diferentes formatos de entrada (controllers vs middleware)
    const {
      targetId,
      metadata,
      userId,
      user, // pode vir como { connect: { id } } do middleware
      route,
      method,
      statusCode,
      payload,
      ip,
      userAgent,
      duration,
      action,
      module,
      ...rest
    } = data || {};

    const normalizedPayload =
      payload !== undefined
        ? payload
        : targetId !== undefined || metadata !== undefined
        ? { targetId: targetId ?? null, metadata: metadata ?? null }
        : null;

    const normalizedUserRelation = userId
      ? { user: { connect: { id: userId } } }
      : user
      ? { user }
      : {};

    const normalizedData = {
      action,
      module,
      route: route || "MANUAL",
      method: method || "SYSTEM",
      statusCode: typeof statusCode === "number" ? statusCode : 200,
      ip: ip ?? null,
      payload: normalizedPayload,
      userAgent: userAgent ?? null,
      duration: duration ?? null,
      ...normalizedUserRelation,
    };

    return prisma.auditLog.create({ data: normalizedData });
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
