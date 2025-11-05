import { AppError } from "../../shared/errors/AppError";

export function requireSupervisor(req, res, next) {
    try {
        if (!req.user) {
            throw new AppError("Usuário não autenticado.", 401);
        }

        // Comparação case-insensitive para garantir que funcione mesmo se o role estiver em minúsculas
        const userRole = String(req.user.role || '').toUpperCase().trim();
        
        if (userRole !== "SUPERVISOR") {
            throw new AppError("Acesso restrito a supervisores.", 403); 
        }
        next();
    } catch (error) {
        next(error);
    }
}

