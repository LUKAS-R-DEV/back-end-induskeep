import { EmailAdapter } from "../../../infrastructure/adapters/EmailAdapter.js";
import { EmailMessage } from "../domain/EmailMessage.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const EmailService={
    async sendEmail({to,subject,content,template}){
        try{
            const email=new EmailMessage({to,subject,content,template});
            const result=await EmailAdapter.send(email.toJson());
            return{status:"sucess",messageId:result?.messageId||"N/A"};
        }catch(err){
            if(error instanceof AppError) throw error;
            throw new AppError("Falha ao enviar e-mail",500);
        }
    }
}