import { SettingsService } from "../application/SettingsService.js";

export const getSettings=async(req,res,next)=>{
    try{
        const settings=await SettingsService.get();
        res.status(200).json(settings);
    }catch(err){
        next(err)
    }
}

export const updateSettings=async(req,res,next)=>{
    try{
        const updated=await SettingsService.update(req.body);
        res.status(200).json(updated);
    }catch(err){
        next(err)
    }
}