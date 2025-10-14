import { AuditLogService } from "../application/AuditLogService.js";

export const list = async (req, res, next) => {
  try {
    const { page, pageSize, module, action, userId } = req.query;
    const data = await AuditLogService.list({
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 20,
      module,
      action,
      userId,
    });
    res.status(200).json(data);
  } catch (err) { next(err); }
};

export const purge = async (req, res, next) => {
  try {
    const { olderThan } = req.body; // ISO string
    const result = await AuditLogService.purgeOlderThan(olderThan);
    res.status(200).json(result);
  } catch (err) { next(err); }
};
