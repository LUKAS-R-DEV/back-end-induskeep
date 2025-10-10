import {OrderItemService} from "../application/OrderItemService.js";

export const getAll=async (req,res,next)=>{
    try{
        const data=await OrderItemService.list();
        res.status(200).json(data);
    }catch(err){
        next(err)
    }
};

export const create=async(req,res,next)=>{
    try{
    const OrdemItem=await OrderItemService.create(req.body);
    res.status(201).json(OrdemItem);
    }catch(err){
        next(err)
    }
};

export const remove=async(req,res,next)=>{
    try{
        const id=req.params.id.replace(/['"]+/g, "")
        const deleted=await OrderItemService.remove(id);
        res.status(201).json(deleted);
        }catch(err){
            next(err)
    }
}