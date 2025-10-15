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

    
    const merged = new Settings({
      ...new Settings({}),
      ...settings,
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
