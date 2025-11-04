import { AppError } from "../../shared/errors/AppError";

export function requireSupervisor(req, res, next) {
    try {
        if (!req.user) {
            throw new AppError("Usuário não autenticado.", 401);
        }

        if (req.user.role !== "SUPERVISOR") {
            throw new AppError("Acesso restrito a supervisores.", 403); 
        }
        next();
    } catch (error) {
        next(error);
    }
}

