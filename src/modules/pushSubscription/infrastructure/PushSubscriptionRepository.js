import prisma from "../../../infrastructure/database/prismaClient.js";

export const PushSubscriptionRepository = {
  async create(data) {
    try {
      return await prisma.pushSubscription.create({
        data: {
          endpoint: data.endpoint,
          p256dh: data.p256dh,
          auth: data.auth,
          userId: data.userId,
        },
      });
    } catch (error) {
      console.error("❌ Erro ao criar push subscription:", error);
      throw error;
    }
  },

  async findByEndpoint(endpoint) {
    try {
      return await prisma.pushSubscription.findUnique({
        where: { endpoint },
        include: { user: true },
      });
    } catch (error) {
      console.error("❌ Erro ao buscar push subscription:", error);
      throw error;
    }
  },

  async findByUserId(userId) {
    try {
      return await prisma.pushSubscription.findMany({
        where: { userId },
        include: { user: true },
      });
    } catch (error) {
      console.error("❌ Erro ao buscar push subscriptions do usuário:", error);
      throw error;
    }
  },

  async delete(endpoint) {
    try {
      return await prisma.pushSubscription.delete({
        where: { endpoint },
      });
    } catch (error) {
      console.error("❌ Erro ao deletar push subscription:", error);
      throw error;
    }
  },

  async deleteByUserId(userId) {
    try {
      return await prisma.pushSubscription.deleteMany({
        where: { userId },
      });
    } catch (error) {
      console.error("❌ Erro ao deletar push subscriptions do usuário:", error);
      throw error;
    }
  },

  async findAll() {
    try {
      return await prisma.pushSubscription.findMany({
        include: { user: true },
      });
    } catch (error) {
      console.error("❌ Erro ao listar push subscriptions:", error);
      throw error;
    }
  },
};

