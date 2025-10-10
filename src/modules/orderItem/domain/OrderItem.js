export class OrderItem{
    constructor({orderId,pieceId,quantity=1}){
        if(!orderId || !pieceId){
            throw new Error("Campos obrigatórios: orderId e pieceId");
        } if(quantity<=0){
        throw new Error("Quantidade deve ser maior que zero");
    }
    this.orderId=orderId;
    this.pieceId=pieceId;
    this.quantity=quantity;
    this.usedAt=new Date();
        
    }
    toJson(){
        return{
            orderId: this.orderId,
            pieceId: this.pieceId,
            quantity: this.quantity,
            usedAt: this.usedAt,
        }
    }
   
    
}