export class AnalyticsReport{
    constructor({totalMachines, totalOrders, completedOrders, avgRepairTime, avgFailureInterval, totalPiecesUsed }){
     this.totalMachines=totalMachines;
     this.totalOrders=totalOrders;
     this.completedOrders=completedOrders;
     this.avgRepairTime=avgRepairTime;
     this.avgFailureInterval=avgFailureInterval;
     this.totalPiecesUsed=totalPiecesUsed;
    }
    toJson(){
        return{
            totalMachines: this.totalMachines,
            totalOrders: this.totalOrders,
            completedOrders: this.completedOrders,
            avgRepairTime: this.avgRepairTime,
            avgFailureInterval: this.avgFailureInterval,
            totalPiecesUsed: this.totalPiecesUsed,
        }
    }
}