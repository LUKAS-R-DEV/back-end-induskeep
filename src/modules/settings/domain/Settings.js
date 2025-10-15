export class Settings{
    constructor({
        minStockThreshold=5,
        autoNotifyLowStock,
        defaultRepairDuration,
        notificationEmail,
        maintenanceWindow
    }){
        this.minStockThreshold=minStockThreshold;
        this.autoNotifyLowStock=autoNotifyLowStock;
        this.defaultRepairDuration=defaultRepairDuration;
        this.notificationEmail=notificationEmail;
        this.maintenanceWindow=maintenanceWindow;
    }
    toJson(){
        return {
            minStockThreshold: this.minStockThreshold,
            autoNotifyLowStock: this.autoNotifyLowStock,
            defaultRepairDuration: this.defaultRepairDuration,
            notificationEmail: this.notificationEmail,
            maintenanceWindow: this.maintenanceWindow
        }
    }
}