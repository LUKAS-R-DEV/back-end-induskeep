export class ExportTask {
  constructor({ module, format, filters = {}, userId = null }) {
    if (!module || !format) throw new Error("Campos obrigatórios: module e format.");
    this.module = module;
    this.format = format.toLowerCase();
    this.filters = filters;
    this.userId = userId;
    this.createdAt = new Date();
  }

  toJson() {
    return {
      module: this.module,
      format: this.format,
      filters: this.filters,
      userId: this.userId,
      createdAt: this.createdAt
    };
  }
}
