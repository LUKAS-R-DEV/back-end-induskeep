import { PushSubscriptionService } from "../application/PushSubscriptionService.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const PushSubscriptionController = {
  async create(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      const subscription = await PushSubscriptionService.create(req.body, userId);
      return res.status(201).json(subscription);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode || 400).json({ error: error.message });
      }
      console.error("❌ Erro no controller de push subscription:", error);
      return res.status(500).json({ error: "Erro interno ao criar push subscription." });
    }
  },

  async delete(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      const { endpoint } = req.params;
      // Decodifica o endpoint que foi codificado no frontend
      const decodedEndpoint = decodeURIComponent(endpoint);
      await PushSubscriptionService.delete(decodedEndpoint, userId);
      return res.status(200).json({ message: "Subscription removida com sucesso." });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode || 400).json({ error: error.message });
      }
      console.error("❌ Erro no controller de push subscription:", error);
      return res.status(500).json({ error: "Erro interno ao deletar push subscription." });
    }
  },

  async list(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      const subscriptions = await PushSubscriptionService.listByUser(userId);
      return res.status(200).json(subscriptions);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode || 400).json({ error: error.message });
      }
      console.error("❌ Erro no controller de push subscription:", error);
      return res.status(500).json({ error: "Erro interno ao listar push subscriptions." });
    }
  },

  async getVapidKey(req, res) {
    try {
      const publicKey = PushSubscriptionService.getVapidPublicKey();
      if (!publicKey) {
        return res.status(503).json({ error: "VAPID keys não configuradas." });
      }
      return res.status(200).json({ publicKey });
    } catch (error) {
      console.error("❌ Erro ao obter VAPID key:", error);
      return res.status(500).json({ error: "Erro interno ao obter VAPID key." });
    }
  },
};

