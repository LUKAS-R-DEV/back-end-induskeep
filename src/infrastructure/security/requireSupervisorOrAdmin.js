import { AppError } from "../../shared/errors/AppError.js";

/**
 * Middleware que permite acesso apenas para SUPERVISOR ou ADMIN
 */
export function requireSupervisorOrAdmin(req, res, next) {
  try {
    if (!req.user) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    // Comparação case-insensitive para garantir que funcione mesmo se o role estiver em minúsculas
    const userRole = String(req.user.role || '').toUpperCase().trim();
    
    if (userRole !== "SUPERVISOR" && userRole !== "ADMIN") {
      throw new AppError("Acesso restrito a supervisores e administradores.", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
}

