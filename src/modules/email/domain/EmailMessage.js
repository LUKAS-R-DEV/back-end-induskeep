export class EmailMessage{
    constructor({to,subject,content,template=null}){
        if(!to || !subject || !content) throw new Error("Campos obrigatórios: to, subject e content");
        this.to=to;
        this.subject=subject;
        this.content=content;
        this.template=template;
        this.sentAt=new Date();
    }
    toJson(){
        return {
            to: this.to,
            subject: this.subject,
            content: this.content,
            template: this.template,
            sentAt: this.sentAt
        }
    }
}