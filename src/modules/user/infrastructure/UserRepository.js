
import prisma from "../../../infrastructure/database/prismaClient.js";


export const UserRepository={
    async findByEmail(email){
        return prisma.user.findUnique({where:{email}})
    },

async findById(id){
    return prisma.user.findUnique({where:{id}});

},
async create(data){
    return prisma.user.create({
  data: typeof data.toJSON === "function" ? data.toJSON() : { ...data },
});
},
};