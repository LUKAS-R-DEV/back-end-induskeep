import axios from "axios";
import { AppError } from "../../shared/errors/AppError.js";
import dotenv from "dotenv";

dotenv.config();


export const EmailAdapter = {
  /**
  
   * @param {Object} params
   * @param {string} params.to - E-mail de destino
   * @param {string} params.subject - Assunto do e-mail
   * @param {string} params.html - Corpo do e-mail em HTML
   * @param {string} [params.text] - Corpo de texto opcional (fallback)
   */
  async sendEmail({ to, subject, html, text }) {
    if (!to || !subject || !html) {
      throw new AppError("Campos obrigatórios ausentes: to, subject, html.", 400);
    }

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      throw new AppError("Chave BREVO_API_KEY não configurada no .env", 500);
    }

    try {
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "IndusKeep System",
            email: process.env.MAIL_SENDER || "induskeep@gmail.com",
          },
          to: [{ email: to }],
          subject,
          htmlContent: html,
          textContent: text || "Mensagem automática do sistema IndusKeep.",
        },
        {
          headers: {
            "api-key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📨 E-mail enviado com sucesso:", response.data.messageId || "OK");
      return { success: true, messageId: response.data.messageId || "sent" };
    } catch (error) {
      console.error("❌ Erro ao enviar e-mail:", error.response?.data || error.message);
      throw new AppError("Erro ao enviar e-mail. Verifique as configurações.", 500);
    }
  },
};
