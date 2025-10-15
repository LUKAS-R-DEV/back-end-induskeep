import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "../../../infrastructure/database/prismaClient.js";
import { PasswordResetToken } from "../domain/PasswordResetToken.js";
import { PasswordRecoveryRepository } from "../infrastructure/PasswordRecoveryRepository.js";
import { EmailAdapter } from "../../../infrastructure/adapters/EmailAdapter.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { buildEmailTemplate } from "../../../infrastructure/templates/emailTemplate.js";
export const PasswordRecoveryService = {
  /**
   */




  async requestReset(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("Usuário não encontrado.", 404);

    
    await PasswordRecoveryRepository.deleteByUser(user.id);

    
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const resetToken = new PasswordResetToken({
      token,
      userId: user.id,
      expiresAt,
    });

    await PasswordRecoveryRepository.create(resetToken.toJson());

    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const html=buildEmailTemplate({
      title: "Recuperação de Senha",
  message: `
    Olá <strong>${user.name}</strong>,<br/><br/>
    Você solicitou a redefinição da sua senha no sistema <strong>IndusKeep</strong>.<br/>
    Clique no botão abaixo para criar uma nova senha.<br/><br/>
    <small>Este link expira em 15 minutos.</small>
  `,
  buttonText: "Redefinir Senha",
  buttonUrl: resetUrl,
    })


    await EmailAdapter.sendEmail({
      to: user.email,
      subject: "🔐 Recuperação de Senha - IndusKeep",
      html: `
        <h2>Olá, ${user.name}</h2>
        <p>Você solicitou a redefinição de senha no sistema <strong>IndusKeep</strong>.</p>
        <p>Clique no botão abaixo para definir uma nova senha (válido por 15 minutos):</p>
        <a href="${resetUrl}" 
          style="display:inline-block;padding:10px 20px;background:#0066cc;color:#fff;text-decoration:none;border-radius:6px;"
          target="_blank">Redefinir Senha</a>
        <p>Se você não solicitou essa ação, ignore este e-mail.</p>
        <br/>
        <small>Este link expira em 15 minutos.</small>
      `,
    });

    return {
      message: "E-mail de recuperação enviado com sucesso.",
    };
  },

  /**
   *
   */
  async resetPassword(token, newPassword) {
    const record = await PasswordRecoveryRepository.findByToken(token);
    if (!record) throw new AppError("Token inválido.", 400);

    if (record.expiresAt < new Date()) {
      throw new AppError("Token expirado. Solicite uma nova recuperação.", 400);
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
