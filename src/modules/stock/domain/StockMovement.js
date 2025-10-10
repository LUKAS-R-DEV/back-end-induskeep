export class StockMovement{
    constructor({pieceId,quantity,type,userId,notes=null}){
       if(!pieceId || !quantity || !type || !userId){
           throw new Error("Campos obrigatórios: pieceId, quantity, type e userId");
       }
       this.pieceId=pieceId;
       this.quantity=quantity;
       this.type=type;
       this.userId=userId;
       this.notes=notes;
       this.movedAt=new Date();
    }
    toJSON(){
        return{
            pieceId: this.pieceId,
            quantity: this.quantity,
            type: this.type,
            userId: this.userId,
            notes: this.notes,
            movedAt: this.movedAt,
        }
    }
}