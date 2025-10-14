import { UserService } from "../application/UserService.js";
import { AuditLogService } from "../../audit/application/AuditLogService.js";
import { sanitize } from "../../../shared/sanitize.js";

export const register = async (req, res, next) => {
    try {
        const user = await UserService.register(req.body);
        
        // Log após o registro
        await AuditLogService.log({
            action: "CREATE",
            module: "USER",
            targetId: user.id,
            userId: user.id, // O próprio usuário se registrou
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            metadata: sanitize(req.body),
        });

        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const data = await UserService.login(req.body);
        
        // Log do login
        await AuditLogService.log({
            action: "LOGIN",
            module: "AUTH",
            targetId: data.user.id,
            userId: data.user.id,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            metadata: sanitize({ email: req.body.email }),
        });

        res.json(data);
    } catch (err) {
        next(err);
    }
};

export const profile = async (req, res, next) => {
    try {
        const user = await UserService.profile(req.user.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        const user = await UserService.update(req.user.id, req.body);
        
        // Log após a atualização
        await AuditLogService.log({
            action: "UPDATE",
            module: "USER",
            targetId: req.user.id,
            userId: req.user.id,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            metadata: sanitize(req.body),
        });

        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const logout = async (req, res, next) => {
    try {
        // Log do logout
        await AuditLogService.log({
            action: "LOGOUT",
            module: "AUTH",
            targetId: req.user?.id,
            userId: req.user?.id,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            metadata: {},
        });

        res.json({ message: "Logout realizado com sucesso" });
    } catch (err) {
        next(err);
    }
};
