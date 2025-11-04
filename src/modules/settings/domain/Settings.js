export class Settings{
    constructor({
        minStockThreshold=5,
        autoNotifyLowStock=true,
        defaultRepairDuration=null,
        notificationEmail=null,
        maintenanceWindow=null
    }){
        this.minStockThreshold=minStockThreshold ?? 5;
        this.autoNotifyLowStock=autoNotifyLowStock ?? true;
        this.defaultRepairDuration=defaultRepairDuration ?? null;
        this.notificationEmail=notificationEmail ?? null;
        this.maintenanceWindow=maintenanceWindow ?? null;
    }
    toJson(){
        return {
            minStockThreshold: this.minStockThreshold,
            autoNotifyLowStock: this.autoNotifyLowStock,
            defaultRepairDuration: this.defaultRepairDuration,
            notificationEmail: this.notificationEmail || "",
            maintenanceWindow: this.maintenanceWindow || "08:00-18:00"
        }
    }
}