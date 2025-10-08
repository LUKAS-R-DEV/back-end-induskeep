export class Machine{
    constructor(name,serial,location,userId){
        if(!name || !serial || !location || !userId) throw new Error("Todos os campos devem ser preenchidos");
        this.name=name;
        this.serial=serial;
        this.location=location;
        this.status="ACTIVE";
        this.userId=userId;
    
    }   
    toJson(){
        return{
            name: this.name,
            serial: this.serial,
            location: this.location,
            status: this.status,
            userId: this.userId
        }
    };
}