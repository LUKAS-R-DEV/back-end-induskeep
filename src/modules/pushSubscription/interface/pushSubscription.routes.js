import { Router } from "express";
import { PushSubscriptionController } from "./PushSubscriptionController.js";
import { authMiddleware } from "../../../infrastructure/security/authMiddleware.js";

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Obter chave pública VAPID (público, mas requer autenticação)
router.get("/vapid-key", PushSubscriptionController.getVapidKey);

// Criar subscription
router.post("/", PushSubscriptionController.create);

// Listar subscriptions do usuário
router.get("/", PushSubscriptionController.list);

// Deletar subscription
router.delete("/:endpoint", PushSubscriptionController.delete);

export default router;


