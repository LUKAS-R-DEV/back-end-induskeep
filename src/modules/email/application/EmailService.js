import { EmailAdapter } from "../../../infrastructure/adapters/EmailAdapter.js";
import { EmailMessage } from "../domain/EmailMessage.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const EmailService={
    async sendEmail({to,subject,content,template}){
        try{
            const email=new EmailMessage({to,subject,content,template});
            const payload = email.toJson();
            const result = await EmailAdapter.sendEmail({
                to: payload.to,
                subject: payload.subject,
                html: payload.content,
                text: payload.content
            });
            return{status:"success",messageId:result?.messageId||"N/A"};
        }catch(err){
            if(err instanceof AppError) throw err;
            throw new AppError("Falha ao enviar e-mail",500);
        }
    }
}