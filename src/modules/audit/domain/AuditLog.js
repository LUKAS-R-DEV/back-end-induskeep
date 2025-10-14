export class AuditLog {
  constructor({ action, module, targetId = null, userId = null, ip = null, userAgent = null, metadata = null }) {
    if (!action || !module) throw new Error("Campos obrigatórios: action e module.");
    this.action = action;
    this.module = module;
    this.targetId = targetId;
    this.userId = userId;
    this.ip = ip;
    this.userAgent = userAgent;
    this.metadata = metadata;
  }
  toJson() {
    return {
      action: this.action,
      module: this.module,
      targetId: this.targetId,
      userId: this.userId,
      ip: this.ip,
      userAgent: this.userAgent,
      metadata: this.metadata,
    };
  }
}
