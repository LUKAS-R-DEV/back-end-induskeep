import { AuditLogRepository } from "../infrastructure/AuditLogRepository.js";
import { AuditLog } from "../domain/AuditLog.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const AuditLogService = {
  async log({ action, module, targetId = null, userId = null, ip = null, userAgent = null, metadata = null }) {
    try {
      const entry = new AuditLog({ action, module, targetId, userId, ip, userAgent, metadata });
      return await AuditLogRepository.create(entry.toJson());
    } catch (err) {
      console.error("❌ Erro ao gravar audit log:", err);
      return null;
    }
  },

  async list(filters) {
    try {
      return await AuditLogRepository.list(filters);
    } catch (err) {
      throw new AppError("Erro interno ao listar audit logs.", 500);
    }
  },

  async purgeOlderThan(dateISO) {
    if (!dateISO) throw new AppError("Data não informada.", 400);
    try {
      const res = await AuditLogRepository.purgeOlderThan(dateISO);
      return { message: "Registros antigos removidos.", count: res.count };
    } catch (err) {
      throw new AppError("Erro interno ao limpar audit logs.", 500);
    }
  }
};
