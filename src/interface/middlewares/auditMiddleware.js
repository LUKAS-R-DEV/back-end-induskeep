import { AuditLogRepository } from "../../modules/audit/infrastructure/AuditLogRepository.js";

export const auditMiddleware = async (req, res, next) => {
  const start = Date.now();
  const originalEnd = res.end;

  res.end = async function (...args) {
    try {
      const duration = Date.now() - start;

      // Monta dados do log
      const logData = {
        action: `${req.method} ${req.originalUrl}`,
        module: req.originalUrl.split("/")[2]?.toUpperCase() || "UNKNOWN",
        route: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        ip: req.ip || req.connection?.remoteAddress,
        payload: req.method !== "GET" ? req.body : null,
        duration,
        userAgent: req.headers["user-agent"] || "unknown",
      };

      // Conecta usuário se estiver autenticado
      if (req.user?.id) {
        logData.user = { connect: { id: req.user.id } };
      }

      // Cria o log
      await AuditLogRepository.create(logData);
    } catch (err) {
      console.error("❌ Falha ao registrar auditoria:", err.message);
    }

    // Finaliza a resposta
    originalEnd.apply(res, args);
  };

  next();
};
