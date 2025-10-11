import prisma from "../../../infrastructure/database/prismaClient.js";

export const ReportService={
   async getOverview() {
    const [
      totalOrders,
      completedOrders,
      pendingOrders,
      totalMachines,
      lowStockPieces,
      totalUsers
    ] = await Promise.all([
      prisma.maintenanceOrder.count(),
      prisma.maintenanceOrder.count({ where: { status: "COMPLETED" } }),
      prisma.maintenanceOrder.count({ where: { status: "PENDING" } }),
      prisma.machine.count(),
      prisma.piece.count({ where: { quantity: { lt: 5 } } }),
      prisma.user.count(),
    ]);

    return {
      totalMaintenanceOrders: totalOrders,
      completedOrders,
      pendingOrders,
      machinesActive: totalMachines,
      lowStockPieces,
      totalUsers,
    };
  },
    async getHistory(startDate,endDate){
        const filters={
            where:{
                completedAt:{},
            },
            include:{
                order:{
                    include:{
                        machine:true,
                        user:{select:{id:true,name:true,email:true}},
                    },
                },
            },
            orderBy:{completedAt:"desc"},
        }
        if(startDate){
            filters.where.completedAt={
                gte:new Date(startDate)
            }
        }
        if(endDate){
            filters.where.completedAt={
                lte:new Date(endDate)
            }
        }
    },
    async getStockCritical(){
        return await prisma.piece.findMany({
            where:{quantity:{lt:prisma.piece.fields.minStock}},
            select:{id:true,name:true,quantity:true,minStock:true},
        })
    }

    }
    
    
