export class Schedule{
    constructor({date,notes=null,userId,machineId}){
        if(!date || !userId || !machineId){
            throw new Error("Campos obrigatórios: date, userId e machineId");
        }
        this.date=date;
        this.notes=notes;
        this.userId=userId;
        this.machineId=machineId;
        this.createdAt=new Date();
    }
    toJson(){
        return{
            date: this.date,
            notes: this.notes,
            userId: this.userId,
            machineId: this.machineId,
            createdAt: this.createdAt,
        }
    }
}