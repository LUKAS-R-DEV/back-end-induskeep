import { ExportRepository } from "../infrastructure/ExportRepository.js";
import { JsonFormatter } from "../infrastructure/formatters/JsonFormatter.js";
import { CsvFormatter } from "../infrastructure/formatters/CsvFormatter.js";
import { ExportTask } from "../domain/ExportTask.js";
import { AppError } from "../../../shared/errors/AppError.js";

const FORMATTERS = {
  json: JsonFormatter,
  csv: CsvFormatter,
};

export const ExportService = {
  async exportData({ module, format, filters = {}, userId }) {
    try {
     
      const fmt = (format || "").toLowerCase();

    
      if (!FORMATTERS[fmt]) {
        throw new AppError(
          `Formato não suportado: "${format}". Formatos válidos: csv, json.`,
          400
        );
      }

     
      const task = new ExportTask({ module, format: fmt, filters, userId });

      
      const data = await ExportRepository.getDataByModule(module, filters);

      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new AppError(`Nenhum dado encontrado para exportar (${module}).`, 404);
      }

      
      const formatter = FORMATTERS[fmt];
      const content = formatter.format(data);

     
      return {
        fileName: `${module}-${new Date().toISOString().split("T")[0]}.${formatter.extension}`,
        content,
        contentType: formatter.contentType || "application/octet-stream",
      };
    } catch (error) {
      console.error("❌ Erro ao exportar dados:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Erro interno ao gerar exportação.", 500);
    }
  },
};
