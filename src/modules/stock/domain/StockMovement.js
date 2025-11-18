export class StockMovement{
    constructor({pieceId,quantity,type,userId,notes}){
       if(!pieceId || !quantity || !type || !userId){
           throw new Error("Campos obrigatórios: pieceId, quantity, type e userId");
       }
       if(!notes || !notes.trim()){
           throw new Error("Observação é obrigatória");
       }
       this.pieceId=pieceId;
       this.quantity=quantity;
       this.type=type;
       this.userId=userId;
       this.notes=notes.trim();
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