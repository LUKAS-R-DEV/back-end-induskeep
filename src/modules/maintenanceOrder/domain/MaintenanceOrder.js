export class MaintenanceOrder {
  constructor({ title, description = null, status = "PENDING", userId, machineId }) {
    if (!title || !userId || !machineId) {
      throw new Error("Campos obrigatórios: title, userId e machineId");
    }

    this.title = title.trim();
    this.description = description ? description.trim() : null;
    this.status = status;
    this.userId = userId;
    this.machineId = machineId;
  }

  toJSON() {
    return {
      title: this.title,
      description: this.description,
      status: this.status,
      userId: this.userId,
      machineId: this.machineId,
    };
  }
}
