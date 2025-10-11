import prisma from "../../../infrastructure/database/prismaClient.js";

export const PasswordRecoveryRepository = {
    async create(data) {
        return await prisma.passwordResetToken.create({ data });
    },

    async findByToken(token) {
        return await prisma.passwordResetToken.findUnique({ where: { token } });
    },

    async deleteByUser(userId) {
        return await prisma.passwordResetToken.deleteMany({ where: { userId } });
    },


};