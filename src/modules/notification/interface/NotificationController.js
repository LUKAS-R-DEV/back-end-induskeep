import {NotificationService} from "../application/NotificationService.js";
import { sendScheduleReminders, notifyOverdueOrders, sendDailyDigest } from "../../../jobs/notificationJobs.js";

export const getAllByUser = async (req, res, next) => {
    try {
        const userId=req.user?.id;
        const data = await NotificationService.listByUser(userId);
        res.status(200).json(data);
       
    } catch (err) {
        next(err);
    }
};
export const getAll = async (req, res, next) => {
    try {
        const data = await NotificationService.list();
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
}

export const create=async(req,res,next)=>{
    try{
   const data={
    ...req.body,
    userId:req.user?.id
   }
    const notification=await NotificationService.create(data);
    res.status(201).json(notification);
    }catch(err){
        next(err)
    }
};

export const markAsRead=async(req,res,next)=>{
    try{
    const id=req.params.id.replace(/['"]+/g, "");
    const updated=await NotificationService.markAsRead(id);
    res.status(201).json(updated);
    }catch(err){
        next(err)
    }
};

export const remove=async(req,res,next)=>{
    try{
    const id=req.params.id.replace(/['"]+/g, "");
    const deleted=await NotificationService.remove(id);
    res.status(201).json(deleted);
    }catch(err){
        next(err)
    }
};

// Admin: executa jobs de notificação manualmente
export const runJobs = async (req, res, next) => {
    try {
        const [reminders, overdue, digest] = await Promise.all([
            sendScheduleReminders(),
            notifyOverdueOrders(),
            sendDailyDigest(),
        ]);
        res.status(200).json({ reminders, overdue, digest });
    } catch (err) {
        next(err);
    }
};