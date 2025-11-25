import { PushSubscriptionRepository } from "../infrastructure/PushSubscriptionRepository.js";
import { PushSubscription } from "../domain/PushSubscription.js";
import { AppError } from "../../../shared/errors/AppError.js";
import webpush from "web-push";

// Configuração do web-push (deve ser configurada via variáveis de ambiente)
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@induskeep.com";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
  console.log("✅ VAPID keys configuradas para Web Push");
} else {
  console.warn("⚠️  VAPID keys não configuradas. Notificações push não estarão disponíveis.");
  console.warn("   Configure VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY no arquivo .env");
}

export const PushSubscriptionService = {
  // 📍 Registra uma nova subscription
  async create(data, userId) {
    if (!data.endpoint || !data.keys || !data.keys.p256dh || !data.keys.auth) {
      throw new AppError("Dados de subscription inválidos. Endpoint e keys são obrigatórios.", 400);
    }

    try {
      // Verifica se já existe uma subscription com este endpoint
      const existing = await PushSubscriptionRepository.findByEndpoint(data.endpoint);
      if (existing) {
        // Se já existe e pertence ao mesmo usuário, retorna a existente
        if (existing.userId === userId) {
          return existing;
        }
        // Se pertence a outro usuário, atualiza para o usuário atual
        await PushSubscriptionRepository.delete(data.endpoint);
      }

      const subscription = new PushSubscription({
        endpoint: data.endpoint,
        p256dh: data.keys.p256dh,
        auth: data.keys.auth,
        userId,
      });

      return await PushSubscriptionRepository.create(subscription.toJSON());
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao criar push subscription:", error);
      throw new AppError("Erro interno ao criar push subscription.", 500);
    }
  },

  // 📍 Remove uma subscription
  async delete(endpoint, userId) {
    if (!endpoint) {
      throw new AppError("Endpoint é obrigatório.", 400);
    }

    try {
      const subscription = await PushSubscriptionRepository.findByEndpoint(endpoint);
      if (!subscription) {
        throw new AppError("Subscription não encontrada.", 404);
      }

      // Verifica se a subscription pertence ao usuário
      if (subscription.userId !== userId) {
        throw new AppError("Você não tem permissão para remover esta subscription.", 403);
      }

      return await PushSubscriptionRepository.delete(endpoint);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao deletar push subscription:", error);
      throw new AppError("Erro interno ao deletar push subscription.", 500);
    }
  },

  // 📍 Lista subscriptions de um usuário
  async listByUser(userId) {
    try {
      return await PushSubscriptionRepository.findByUserId(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao listar push subscriptions:", error);
      throw new AppError("Erro interno ao listar push subscriptions.", 500);
    }
  },

  // 📍 Envia notificação push para um usuário
  async sendNotificationToUser(userId, payload) {
    try {
      const subscriptions = await PushSubscriptionRepository.findByUserId(userId);
      
      if (subscriptions.length === 0) {
        console.log(`⚠️ Nenhuma subscription encontrada para o usuário ${userId}`);
        return { sent: 0, failed: 0 };
      }

      const results = await Promise.allSettled(
        subscriptions.map((sub) =>
          this.sendNotification(sub, payload)
        )
      );

      const sent = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      // Remove subscriptions inválidas (404, 410, etc)
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          const error = result.reason;
          if (error?.statusCode === 404 || error?.statusCode === 410) {
            console.log(`🗑️ Removendo subscription inválida: ${subscriptions[index].endpoint}`);
            PushSubscriptionRepository.delete(subscriptions[index].endpoint).catch(console.error);
          }
        }
      });

      return { sent, failed };
    } catch (error) {
      console.error("❌ Erro ao enviar notificação push:", error);
      throw new AppError("Erro interno ao enviar notificação push.", 500);
    }
  },

  // 📍 Envia notificação push para uma subscription específica
  async sendNotification(subscription, payload) {
    try {
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      };

      await webpush.sendNotification(pushSubscription, JSON.stringify(payload));
      return { success: true };
    } catch (error) {
      console.error("❌ Erro ao enviar push notification:", error);
      throw error;
    }
  },

  // 📍 Retorna a chave pública VAPID
  getVapidPublicKey() {
    return vapidPublicKey || null;
  },
};

