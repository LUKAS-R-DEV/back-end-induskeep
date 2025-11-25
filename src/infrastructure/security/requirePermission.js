import { AppError } from "../../shared/errors/AppError.js";
import { RolePolicy } from "../../modules/infrastructure/domain/RolePolicy.js";

/**
 * Middleware que verifica se o usuário tem uma permissão específica
 * @param {string} permission - A permissão necessária (ex: "CREATE_ORDER", "VIEW_MACHINES")
 */
export function requirePermission(permission) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError("Usuário não autenticado.", 401);
      }

      const userRole = String(req.user.role || '').toUpperCase().trim();
      const userPermissions = RolePolicy[userRole] || [];

      // ADMIN tem acesso total
      if (userPermissions.includes("ALL")) {
        return next();
      }

      // Verifica se o usuário tem a permissão necessária
      if (!userPermissions.includes(permission)) {
        throw new AppError(
          `Acesso negado. É necessária a permissão: ${permission}`,
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}















