import { PieceService } from "../application/PieceService.js";
import { AuditLogService } from "../../audit/application/AuditLogService.js";
import { sanitize } from "../../../shared/sanitize.js";

export const getAll=async (req,res,next)=>{
    try{
        const data=await PieceService.list();
        res.status(200).json(data);
    }catch(err){
        next(err)
    }
};

export const create = async (req, res, next) => {
    try {
        const piece = await PieceService.create(req.body);
        
        // Log após a criação
        await AuditLogService.log({
            action: "CREATE",
            module: "PIECE",
            targetId: piece.id,
            userId: req.user?.id || null,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            metadata: sanitize(req.body),
        });

        res.status(201).json(piece);
    } catch (err) {
        next(err);
    }
};
export const update = async (req, res, next) => {
    try {
        const id = req.params.id.replace(/['"]+/g, "");
        const piece = await PieceService.update(id, req.body);
        
        // Log após a atualização
        await AuditLogService.log({
            action: "UPDATE",
            module: "PIECE",
            targetId: id,
            userId: req.user?.id || null,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            metadata: sanitize(req.body),
        });

        res.status(200).json(piece);
    } catch (err) {
        next(err);
    }
};

export const remove = async (req, res, next) => {
    try {
        const id = req.params.id.replace(/['"]+/g, "");
        const piece = await PieceService.remove(id);
        
        // Log após a remoção
        await AuditLogService.log({
            action: "DELETE",
            module: "PIECE",
            targetId: id,
            userId: req.user?.id || null,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            metadata: sanitize(req.body),
        });

        res.status(200).json(piece);
    } catch (err) {
        next(err);
    }
};
