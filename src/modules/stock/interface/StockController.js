import { StockService } from "../application/StockService.js";
import { AuditLogService } from "../../audit/application/AuditLogService.js";
import { sanitize } from "../../../shared/sanitize.js";

export const getAll=async (req,res,next)=>{
    try{
        const { startDate, endDate } = req.query;
        const data = (startDate && endDate)
          ? await StockService.findByPeriod(startDate, endDate, req.user)
          : await StockService.list(req.user);
        res.status(200).json(data);
    }catch(err){
        next(err)
    }
};

export const create = async (req, res, next) => {
    try {
        const data = {
            ...req.body,
            userId: req.user?.id
        };
        
        const movement = await StockService.move(data, req.user);
        
        // Log após a movimentação
        await AuditLogService.log({
            action: "CREATE",
            module: "STOCK_MOVEMENT",
            targetId: movement.id,
            userId: req.user?.id || null,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            metadata: sanitize(req.body),
        });

        res.status(201).json(movement);
    } catch (err) {
        next(err);
    }
};

export const getByPiece = async (req, res, next) => {
    try {
        const { pieceId } = req.params;
        const movements = await StockService.findByPiece(pieceId);
        res.status(200).json(movements);
    } catch (err) {
        next(err);
    }
};

export const getByPeriod = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const movements = await StockService.findByPeriod(startDate, endDate);
        res.status(200).json(movements);
    } catch (err) {
        next(err);
    }
};

export const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await StockService.remove(id);
        
        // Log após a remoção
        await AuditLogService.log({
            action: "DELETE",
            module: "STOCK_MOVEMENT",
            targetId: id,
            userId: req.user?.id || null,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            metadata: sanitize(req.body),
        });

        res.status(200).json(deleted);
    } catch (err) {
        next(err);
    }
};
