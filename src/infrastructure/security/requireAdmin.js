import { AppError } from "../../shared/errors/AppError.js";


export function requireAdmin(req, res, next) {
  try {
    if (!req.user) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    if (req.user.role !== "ADMIN") {
      throw new AppError("Acesso restrito a administradores.", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
}
