import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "../../../infrastructure/database/prismaClient.js";
import { PasswordResetToken } from "../domain/PasswordResetToken.js";
import { PasswordRecoveryRepository } from "../infrastructure/PasswordRecoveryRepository.js";
import { EmailAdapter } from "../../../infrastructure/adapters/EmailAdapter.js";

export const PasswordRecoveryService = {
  async requestReset(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Usuário não encontrado.");

    // Deleta tokens anteriores
    await PasswordRecoveryRepository.deleteByUser(user.id);

    // Cria novo token com validade de 15 min
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

    const resetToken = new PasswordResetToken({ token, userId: user.id, expiresAt });
    await PasswordRecoveryRepository.create(resetToken.toJson());

    await EmailAdapter.sendPasswordRecovery(email, token);
    return {
      message: "Token de recuperação gerado com sucesso.",
      token, 
    };
  },

  async resetPassword(token, newPassword) {
    const record = await PasswordRecoveryRepository.findByToken(token);
    if (!record) throw new Error("Token inválido.");

    if (record.expiresAt < new Date()) {
      throw new Error("Token expirado. Solicite uma nova recuperação.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hashedPassword },
    });

    await PasswordRecoveryRepository.deleteByUser(record.userId);

    return { message: "Senha redefinida com sucesso." };
  },
};
