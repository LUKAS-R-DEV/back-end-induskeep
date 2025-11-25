export class AnalyticsReport{
    constructor({totalMachines, totalOrders, completedOrders, pendingOrders, inProgressOrders, totalTechnicians, overdueSchedules, avgRepairTime, avgFailureInterval, piecesUsedLastMonth }){
     this.totalMachines=totalMachines;
     this.totalOrders=totalOrders;
     this.completedOrders=completedOrders;
     this.pendingOrders=pendingOrders;
     this.inProgressOrders=inProgressOrders;
     this.totalTechnicians=totalTechnicians;
     this.overdueSchedules=overdueSchedules;
     this.avgRepairTime=avgRepairTime;
     this.avgFailureInterval=avgFailureInterval;
     this.piecesUsedLastMonth=piecesUsedLastMonth;
    }
    toJson(){
        return{
            totalMachines: this.totalMachines,
            totalOrders: this.totalOrders,
            completedOrders: this.completedOrders,
            pendingOrders: this.pendingOrders,
            inProgressOrders: this.inProgressOrders,
            totalTechnicians: this.totalTechnicians,
            overdueSchedules: this.overdueSchedules,
            avgRepairTime: this.avgRepairTime,
            avgFailureInterval: this.avgFailureInterval,
            piecesUsedLastMonth: this.piecesUsedLastMonth,
        }
    }
}