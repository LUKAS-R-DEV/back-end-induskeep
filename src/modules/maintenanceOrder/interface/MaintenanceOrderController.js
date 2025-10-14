import { MaintenanceOrderService } from "../application/MaintenanceOrderService.js";
import { AuditLogService } from "../../audit/application/AuditLogService.js";
import { sanitize } from "../../../shared/sanitize.js";

export const getAll = async (req, res, next) => {
  try {
    const data = await MaintenanceOrderService.list();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      userId: req.user?.id, // vem do token
    };

    const order = await MaintenanceOrderService.create(data);
    
    // Log após a criação
    await AuditLogService.log({
      action: "CREATE",
      module: "MAINTENANCE_ORDER",
      targetId: order.id,
      userId: req.user?.id || null,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: sanitize(req.body),
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const id = req.params.id.replace(/['"]+/g, "");
    const order = await MaintenanceOrderService.update(id, req.body);
    
    // Log após a atualização
    await AuditLogService.log({
      action: "UPDATE",
      module: "MAINTENANCE_ORDER",
      targetId: id,
      userId: req.user?.id || null,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: sanitize(req.body),
    });

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const id = req.params.id.replace(/['"]+/g, "");
    const deleted = await MaintenanceOrderService.remove(id);
    
    // Log após a remoção
    await AuditLogService.log({
      action: "DELETE",
      module: "MAINTENANCE_ORDER",
      targetId: id,
      userId: req.user?.id || null,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: sanitize(req.body),
    });

    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
};
