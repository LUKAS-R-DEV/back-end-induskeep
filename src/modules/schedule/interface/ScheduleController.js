import { ScheduleService } from "../application/ScheduleService.js";

export const getAll = async (req, res, next) => {
    try {
        const data = await ScheduleService.list();
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

export const create = async (req, res, next) => {
    try {
        const userRole = req.user?.role ? String(req.user.role).toUpperCase().trim() : '';
        const isSupervisorOrAdmin = userRole === "SUPERVISOR" || userRole === "ADMIN";
        
        // Se for supervisor/admin, separa createdById (gerador) de userId (técnico responsável)
        // Se for técnico, usa o mesmo ID para ambos (compatibilidade)
        const data = {
            ...req.body,
            userId: isSupervisorOrAdmin && req.body.userId ? req.body.userId : req.user?.id,
            createdById: req.user?.id, // Sempre salva quem criou o agendamento
        };
    
        const schedule = await ScheduleService.create(data);
        res.status(201).json(schedule);
    } catch (err) {
        next(err);
    }
}
export const update = async (req, res, next) => {
        try {
          const id = req.params.id.replace(/['"]+/g, "");
          const schedule = await ScheduleService.update(id, req.body, req.user);
          res.status(200).json(schedule);
        } catch (err) {
          next(err);
        }
      };
export const remove = async (req, res, next) => {
    try {
      const id = req.params.id.replace(/['"]+/g, "");
      const deleted = await ScheduleService.remove(id);
      res.status(200).json(deleted);
    } catch (err) {
      next(err);
    }
  };
