// src/modules/reports/application/ExportService.js
import { PdfAdapter } from "../infrastructure/PdfAdapter.js";
import { CsvAdapter } from "../infrastructure/CsvAdapter.js";
import { ReportService } from "./ReportService.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const ExportService = {
    async generate(type, dataset) {
        try {
            if (!type) throw new AppError("Tipo de exportação é obrigatório.", 400);
            if (!dataset) throw new AppError("Dataset é obrigatório.", 400);

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
                    throw new AppError("Tipo de relatório inválido.", 400);
            }

            if (type === "pdf") {
                return await PdfAdapter.generate(data, dataset);
            }

            if (type === "csv") {
                return await CsvAdapter.generate(data, dataset);
            }

            throw new AppError("Tipo de exportação inválido.", 400);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao gerar exportação.", 500);
        }
    },
};
