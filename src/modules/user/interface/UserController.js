import { UserService } from "../application/UserService.js";
import { AuditLogService } from "../../audit/application/AuditLogService.js";
import { sanitize } from "../../../shared/sanitize.js";

export const register = async (req, res, next) => {
    try {
        const{name,email,password,role="TECHNICIAN"} = req.body
        const user = await UserService.register({name,email,password,role});
        
        await AuditLogService.log({
            action: "CREATE",
            module: "USER",
            targetId: user.id,
            userId: user.id, 
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            metadata: sanitize(req.body),
        });

        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};

// Admin: atualiza qualquer usuário por ID
export const adminUpdate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await UserService.update(id, req.body);

        await AuditLogService.log({
            action: "UPDATE",
            module: "USER",
            targetId: id,
            userId: req.user?.id,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            metadata: sanitize(req.body),
        });

        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

// Admin: inativar usuário
export const deactivate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { deactivationReason } = req.body || {};
        const payload = {
            isActive: false,
            deactivatedAt: new Date().toISOString(),
            deactivationReason: deactivationReason ?? null,
        };
        const user = await UserService.update(id, payload);

        await AuditLogService.log({
            action: "DEACTIVATE",
            module: "USER",
            targetId: id,
            userId: req.user?.id,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            metadata: sanitize(payload),
        });

        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

// Admin: reativar usuário
export const reactivate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const payload = {
            isActive: true,
            deactivatedAt: null,
            deactivationReason: null,
        };
        const user = await UserService.update(id, payload);

        await AuditLogService.log({
            action: "REACTIVATE",
            module: "USER",
            targetId: id,
            userId: req.user?.id,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            metadata: sanitize(payload),
        });

        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const data = await UserService.list();
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
}

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

        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

export const profile = async (req, res, next) => {
    try {
        const user = await UserService.profile(req.user.id);
        res.status(200).json(user);
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

        res.status(200).json(user);
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

        res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (err) {
        next(err);
    }

};

export const getById = async (req, res, next) => {
    try {
        const id = req.params.id.replace(/['"]+/g, "");
        const user = await UserService.findById(id);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

