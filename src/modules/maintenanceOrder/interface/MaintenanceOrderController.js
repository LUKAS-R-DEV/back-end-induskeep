import { MaintenanceOrderService } from "../application/MaintenanceOrderService.js";

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
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const id = req.params.id.replace(/['"]+/g, "");
    const order = await MaintenanceOrderService.update(id, req.body);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const id = req.params.id.replace(/['"]+/g, "");
    const deleted = await MaintenanceOrderService.remove(id);
    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
};
