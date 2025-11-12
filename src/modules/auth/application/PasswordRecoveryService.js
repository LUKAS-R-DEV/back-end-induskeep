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
   * Solicita recuperação de senha
   * @param {string} email - Email do usuário
   * @returns {Promise<Object>} Mensagem de sucesso
   */
  async requestReset(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { message: "Se esse email existir, enviaremos instruções." };
    }

    // Deleta tokens anteriores
    await PasswordRecoveryRepository.deleteByUser(user.id);

    // Gera novo token com validade de 15 minutos
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const resetToken = new PasswordResetToken({
      token,
      userId: user.id,
      expiresAt,
    });

    await PasswordRecoveryRepository.create(resetToken.toJson());

    // URL de reset
    const resetUrl = `${process.env.FRONTEND_URL}/resetSenha?token=${token}`;

    // Template de email moderno
    const html = buildEmailTemplate({
      title: "Recuperação de Senha",
      message: `
        <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #1e293b;">
          Olá, <span style="color: #3b82f6;">${user.name}</span>! 👋
        </p>
        <p style="margin: 0 0 20px 0; color: #475569; line-height: 1.8;">
          Recebemos uma solicitação para redefinir a senha da sua conta no <strong style="color: #1e293b;">IndusKeep</strong>.
        </p>
        <p style="margin: 0 0 20px 0; color: #475569; line-height: 1.8;">
          Clique no botão abaixo para criar uma nova senha. Este link é válido por <strong style="color: #3b82f6;">15 minutos</strong> e pode ser usado apenas uma vez.
        </p>
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.6;">
            <strong>⚠️ Importante:</strong> Se você não solicitou esta alteração, ignore este e-mail. Sua senha permanecerá a mesma.
          </p>
        </div>
      `,
      buttonText: "🔑 Redefinir Senha",
      buttonUrl: resetUrl,
      footerText: `
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #64748b;">
          <strong style="color: #1e293b;">Dúvidas?</strong> Entre em contato com o suporte do sistema.
        </p>
      `,
      icon: "fa-key"
    });

    await EmailAdapter.sendEmail({
      to: user.email,
      subject: "🔐 Recuperação de Senha - IndusKeep",
      html
    });

    return {
      message: "E-mail de recuperação enviado com sucesso.",
    };
  },

  /**
   * Redefine a senha usando o token
   * @param {string} token - Token de recuperação
   * @param {string} newPassword - Nova senha
   * @returns {Promise<Object>} Mensagem de sucesso
   */
  async resetPassword(token, newPassword) {
    const record = await PasswordRecoveryRepository.findByToken(token);
    if (!record) {
      throw new AppError("Token inválido.", 400);
    }

    if (record.expiresAt < new Date()) {
      throw new AppError("Token expirado. Solicite uma nova recuperação.", 400);
    }

    if (newPassword.length < 8) {
      throw new AppError("A senha deve ter pelo menos 8 caracteres.", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hashedPassword },
    });

    // Deleta o token após uso
    await PasswordRecoveryRepository.deleteByUser(record.userId);

    // Envia email de confirmação
    const user = await prisma.user.findUnique({ where: { id: record.userId } });
    
    if (user) {
      const confirmationHtml = buildEmailTemplate({
        title: "Senha Redefinida com Sucesso",
        message: `
          <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #1e293b;">
            Olá, <span style="color: #3b82f6;">${user.name}</span>! ✅
          </p>
          <p style="margin: 0 0 20px 0; color: #475569; line-height: 1.8;">
            Sua senha foi redefinida com sucesso. Agora você pode fazer login no sistema usando sua nova senha.
          </p>
          <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; font-size: 13px; color: #065f46; line-height: 1.6;">
              <strong>✅ Segurança:</strong> Se você não realizou esta alteração, entre em contato com o suporte imediatamente.
            </p>
          </div>
        `,
        buttonText: "🔐 Fazer Login",
        buttonUrl: `${process.env.FRONTEND_URL}/login`,
        footerText: `
          <p style="margin: 0; font-size: 13px; color: #64748b;">
            Para sua segurança, recomendamos que você use uma senha forte e única.
          </p>
        `,
        icon: "fa-circle-check"
      });

      await EmailAdapter.sendEmail({
        to: user.email,
        subject: "✅ Senha Redefinida - IndusKeep",
        html: confirmationHtml
      }).catch(err => {
        // Não falha se o email de confirmação não for enviado
        console.warn("Erro ao enviar email de confirmação:", err);
      });
    }

    return { message: "Senha redefinida com sucesso." };
  },
};
