
import prisma from "../../../infrastructure/database/prismaClient.js";


export const UserRepository={
    async findByEmail(email){
        return prisma.user.findUnique({where:{email}})
    },

async findById(id){
    return prisma.user.findUnique({where:{id}});

},

async findAll(){
    return prisma.user.findMany({select:{id:true,name:true,email:true,role:true}});
},
async create(data){
    return prisma.user.create({
  data: typeof data.toJSON === "function" ? data.toJSON() : { ...data },
});
},
};