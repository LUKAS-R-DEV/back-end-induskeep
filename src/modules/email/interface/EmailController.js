import { EmailService } from "../application/EmailService.js";

export const sendEmail=async(req,res,next)=>{
    try{
        const {to,subject,content,template}=req.body;
        const result=await EmailService.sendEmail({to,subject,content,template});
        res.status(200).json(result);
    }catch(err){
        next(err)
    }
}