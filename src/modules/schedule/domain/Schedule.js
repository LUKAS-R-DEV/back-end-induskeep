export class Schedule{
    constructor({date,notes=null,userId,machineId,createdById}){
        if(!date || !userId || !machineId){
            throw new Error("Campos obrigatórios: date, userId e machineId");
        }
        this.date=date;
        this.notes=notes;
        this.userId=userId;
        this.machineId=machineId;
        // Se createdById não for fornecido, assume que é o mesmo que userId (compatibilidade)
        this.createdById=createdById || userId;
        this.createdAt=new Date();
    }
    toJSON(){
        return{
            date: this.date,
            notes: this.notes,
            userId: this.userId,
            machineId: this.machineId,
            createdById: this.createdById,
            createdAt: this.createdAt,
        }
    }
}