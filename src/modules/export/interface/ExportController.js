import { ExportService } from "../application/ExportService.js";

export const exportModule = async (req, res, next) => {
  try {
    const { module } = req.params;
    const { format = "json" } = req.query;
    const userId = req.user?.id || null;

    // ✅ Corrigido: passando como objeto
    const result = await ExportService.exportData({ module, format, userId });

    res.setHeader("Content-Disposition", `attachment; filename="${result.fileName}"`);
    res.setHeader("Content-Type", result.contentType);
    res.send(result.content);
  } catch (err) {
    next(err);
  }
};
