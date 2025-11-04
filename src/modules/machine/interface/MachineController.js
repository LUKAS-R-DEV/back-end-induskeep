import { MachineService } from "../application/MachineService.js";
import { AuditLogService } from "../../audit/application/AuditLogService.js";
import { sanitize } from "../../../shared/sanitize.js";

export const getAll = async (req, res, next) => {
  try {
    const data = await MachineService.list();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      userId: req.user?.id, 
    };

    const machine = await MachineService.create(data);
    
    // Log após a criação para ter o ID da máquina
    await AuditLogService.log({
      action: "CREATE",
      module: "MACHINE",
      targetId: machine.id,
      userId: req.user?.id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: sanitize(req.body),
    });

    res.status(201).json(machine);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const machine = await MachineService.update(req.params.id, req.body);
    
    // Log após a atualização
    await AuditLogService.log({
      action: "UPDATE", 
      module: "MACHINE",
      targetId: req.params.id,
      userId: req.user?.id || null,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: sanitize(req.body),
    });

    res.status(200).json(machine);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const deleted = await MachineService.remove(req.params.id);
    
    // Log após a remoção
    await AuditLogService.log({
      action: "DELETE",
      module: "MACHINE",
      targetId: req.params.id,
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
export const getById = async (req, res, next) => {
  try {
    const machine = await MachineService.findById(req.params.id);
    res.status(200).json(machine);
  } catch (err) {
    next(err);
  }
};
