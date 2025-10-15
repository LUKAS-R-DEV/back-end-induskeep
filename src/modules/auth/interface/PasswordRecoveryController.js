import { PasswordRecoveryService } from "../application/PasswordRecoveryService.js"

export const requestReset=async(req,res,next)=>{
    try{
        const {email}=req.body;
        const response=await PasswordRecoveryService.requestReset(email);
        res.status(200).json(response);
    }catch(err){
        next(err)
    }
}
export const resetPassword=async(req,res,next)=>{
    try{
        const {token,newPassword}=req.body;
        const response=await PasswordRecoveryService.resetPassword(token,newPassword);
        res.status(200).json(response);
    }catch(err){
        next(err)
    }
}
