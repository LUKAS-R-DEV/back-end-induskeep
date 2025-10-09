import { MachineService } from "../application/MachineService.js";

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
    res.status(201).json(machine);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const machine = await MachineService.update(req.params.id, req.body);
    res.status(200).json(machine);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const deleted = await MachineService.remove(req.params.id);
    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
};
