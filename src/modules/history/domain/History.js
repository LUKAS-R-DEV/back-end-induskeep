export class History{
    constructor({orderId,notes=null}){
        if(!orderId) throw new Error("Campos obrigatórios: orderId");
        this.orderId=orderId;
        this.notes=notes;
        this.completedAt=new Date();
    }
    toJson(){
        return{
            orderId: this.orderId,
            notes: this.notes,
            completedAt: this.completedAt,
        }
    }
}