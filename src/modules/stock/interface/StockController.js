import { StockService } from "../application/StockService.js";

export const getAll=async (req,res,next)=>{
    try{
        const data=await StockService.list();
        res.status(200).json(data);
    }catch(err){
        next(err)
    }
};

export const create=async(req,res,next)=>{
    try{
        const data={
            ...req.body,
            userId:req.user?.id
        }
        const movement=await StockService.move(data);
        res.status(201).json(movement);
    }catch(err){
        next(err)
    }
}
