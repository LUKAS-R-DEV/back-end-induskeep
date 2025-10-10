import { HistoryService } from "../application/HistoryService.js";

export const getAll=async (req,res,next)=>{
    try{
        const data=await HistoryService.list();
        res.status(200).json(data);
    }catch(err){
        next(err)
    }
};

export const create=async(req,res,next)=>{
    try{
    const history=await HistoryService.create(req.body);
    res.status(201).json(history);
    }catch(err){
        next(err)
    }
};

export const getByOrder=async (req,res,next)=>{
    try{
        const orderId=req.params.id.replace(/['"]+/g, "");
        const history=await HistoryService.findByOrder(orderId);
        res.status(200).json(history);
    }catch(err){
        next(err)
    }
};