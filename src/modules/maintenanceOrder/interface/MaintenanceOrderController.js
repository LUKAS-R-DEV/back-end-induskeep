import { MaintenanceOrderService } from "../application/MaintenanceOrderService.js";
import { AuditLogService } from "../../audit/application/AuditLogService.js";
import { sanitize } from "../../../shared/sanitize.js";
import { ScheduleRepository } from "../../schedule/infrastructure/ScheduleRepository.js";

export const getAll = async (req, res, next) => {
  try {
    const data = await MaintenanceOrderService.list(req.user);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const userRole = req.user?.role ? String(req.user.role).toUpperCase().trim() : '';
    const isSupervisorOrAdmin = userRole === "SUPERVISOR" || userRole === "ADMIN";
    const isAdmin = userRole === "ADMIN";
    
    // Se a ordem está sendo criada a partir de um agendamento, valida permissão
    if (req.body.scheduleId) {
      const schedule = await ScheduleRepository.findById(req.body.scheduleId);
      
      if (!schedule) {
        return res.status(404).json({ error: "Agendamento não encontrado." });
      }
      
      // Apenas o criador do agendamento ou admin pode iniciar a manutenção
      const creatorId = schedule.createdById || schedule.createdBy?.id;
      if (!isAdmin && creatorId !== req.user?.id) {
        return res.status(403).json({ 
          error: "Acesso negado. Apenas o criador do agendamento ou um administrador pode iniciar a manutenção." 
        });
      }
    }
    
    // Se for supervisor/admin e tiver userId no body, usa o userId do body (técnico responsável)
    // Se não tiver userId no body, usa o próprio usuário (quando técnico cria para si mesmo)
    // Se for técnico, usa o userId do body se existir (ex: quando inicia de agendamento), senão usa o próprio id
    const data = {
      ...req.body,
      userId: req.body.userId || req.user?.id, // Sempre usa userId do body se existir (ex: agendamento), senão usa quem está criando
      createdById: req.user?.id, // Sempre salva quem criou a ordem
    };

    const order = await MaintenanceOrderService.create(data);
    
    // Log após a criação
    await AuditLogService.log({
      action: "CREATE",
      module: "MAINTENANCE_ORDER",
      targetId: order.id,
      userId: req.user?.id || null,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: sanitize(req.body),
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const id = req.params.id.replace(/['"]+/g, "");
    const order = await MaintenanceOrderService.update(id, req.body, req.user);
    
    // Log após a atualização
    await AuditLogService.log({
      action: "UPDATE",
      module: "MAINTENANCE_ORDER",
      targetId: id,
      userId: req.user?.id || null,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: sanitize(req.body),
    });

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const id = req.params.id.replace(/['"]+/g, "");
    const deleted = await MaintenanceOrderService.remove(id);
    
    // Log após a remoção
    await AuditLogService.log({
      action: "DELETE",
      module: "MAINTENANCE_ORDER",
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
export const getById = async (req, res, next) => {
  try {
    const id = req.params.id.replace(/['"]+/g, "");
    const order = await MaintenanceOrderService.findById(id, req.user);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};
