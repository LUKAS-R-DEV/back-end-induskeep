import { SettingsRepository } from "../infrastructure/SettingsRepository.js";
import { Settings } from "../domain/Settings.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const SettingsService = {
  async get() {
    const settings = await SettingsRepository.get();
    
    if (!settings) {
      const defaults = new Settings({});
      return defaults.toJson();
    }

    // Retorna os dados do banco com valores padrão para campos null
    const merged = new Settings({
      minStockThreshold: settings.minStockThreshold ?? 5,
      autoNotifyLowStock: settings.autoNotifyLowStock ?? true,
      defaultRepairDuration: settings.defaultRepairDuration ?? null,
      notificationEmail: settings.notificationEmail ?? "",
      maintenanceWindow: settings.maintenanceWindow ?? "08:00-18:00"
    });

    return merged.toJson();
  },

  async update(data) {
    try {
      const updated = await SettingsRepository.update(data);
      return updated;
    } catch (error) {
      console.error("❌ Erro ao atualizar configurações:", error);
      throw new AppError("Erro ao atualizar configurações.", 500);
    }
  },
};
