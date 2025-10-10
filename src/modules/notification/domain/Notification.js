export class Notification{
    constructor({message,userId=null,schedule=null}){
        if(!message) throw new Error("Campos obrigatórios: message");
        this.message=message;
        this.userId=userId;
        this.schedule=schedule;
        this.read=false;
        this.createdAt=new Date();
    }
    toJSON(){
        return{
            message: this.message,
            userId: this.userId,
            schedule: this.schedule,
            read: this.read,
            createdAt: this.createdAt,
        }
    }
}