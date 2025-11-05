import { AppError } from "../../shared/errors/AppError.js";


export function requireAdmin(req, res, next) {
  try {
    if (!req.user) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    // Comparação case-insensitive para garantir que funcione mesmo se o role estiver em minúsculas
    const userRole = String(req.user.role || '').toUpperCase().trim();
    
    if (userRole !== "ADMIN") {
      throw new AppError("Acesso restrito a administradores.", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
}
