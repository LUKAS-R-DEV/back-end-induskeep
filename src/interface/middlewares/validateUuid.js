// src/interface/middlewares/validateUuid.js
import { AppError } from "../../shared/errors/AppError.js";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateUuidParam = (paramName = "id") => (req, res, next) => {
  const raw = req.params?.[paramName] ?? "";
  const id = String(raw).replace(/['"]/g, "");
  if (!uuidRegex.test(id)) {
    return next(new AppError(`ID inválido: ${id}`, 400));
  }
  next();
};
