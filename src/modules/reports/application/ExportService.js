// src/modules/reports/application/ExportService.js
import { PdfAdapter } from "../infrastructure/PdfAdapter.js";
import { CsvAdapter } from "../infrastructure/CsvAdapter.js";
import { ReportService } from "./ReportService.js";

export const ExportService = {
  async generate(type, dataset) {
    let data;

    switch (dataset) {
      case "overview":
        data = await ReportService.getOverview();
        break;
      case "history":
        data = await ReportService.getHistory();
        break;
      case "stock-critical":
        data = await ReportService.getStockCritical();
        break;
      default:
        throw new Error("Tipo de relatório inválido");
    }

    if (type === "pdf") {
      return await PdfAdapter.generate(data, dataset);
    }

    if (type === "csv") {
      return await CsvAdapter.generate(data, dataset);
    }

    throw new Error("Tipo de exportação inválido");
  },
};
