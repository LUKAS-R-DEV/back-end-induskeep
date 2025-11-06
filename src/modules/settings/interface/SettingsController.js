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
        console.log('📥 Recebendo atualização de configurações:', req.body);
        const updated=await SettingsService.update(req.body);
        console.log('✅ Configurações atualizadas com sucesso:', updated);
        res.status(200).json(updated);
    }catch(err){
        console.error('❌ Erro ao atualizar configurações:', err);
        next(err)
    }
}