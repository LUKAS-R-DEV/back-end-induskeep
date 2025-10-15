import prisma from "../../../infrastructure/database/prismaClient.js";

export const SettingsRepository = {
  async get() {
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          minStockThreshold: 5,
          autoNotifyLowStock: true,
          defaultRepairDuration: null,
          notificationEmail: null,
          maintenanceWindow: null,
        },
      });
    }

    return settings;
  },

  async update(data) {
    const existing = await prisma.settings.findFirst();
    if (existing) {
      return await prisma.settings.update({
        where: { id: existing.id },
        data,
      });
    } else {
      return await prisma.settings.create({ data });
    }
  },
};
