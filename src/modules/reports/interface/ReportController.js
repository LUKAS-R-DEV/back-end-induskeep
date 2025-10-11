// src/modules/reports/interface/ReportController.js
import { ReportService } from "../application/ReportService.js";
import { ExportService } from "../application/ExportService.js";

export const getOverview = async (req, res, next) => {
  try {
    const data = await ReportService.getOverview();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await ReportService.getHistory(startDate, endDate);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const exportReport = async (req, res, next) => {
  try {
    const { type = "pdf", dataset = "overview" } = req.query;
    const file = await ExportService.generate(type, dataset);
    res.download(file);
  } catch (err) {
    next(err);
  }
};
