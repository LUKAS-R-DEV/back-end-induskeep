import axios from "axios";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = "no-reply@induskeep.com"; // pode personalizar

export const EmailAdapter = {
  async sendPasswordRecovery(to, token) {
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`; 
    // 🔹 depois troque pelo domínio real do frontend

    const emailData = {
      sender: { email: FROM_EMAIL, name: "IndusKeep System" },
      to: [{ email: to }],
      subject: "Redefinição de Senha - IndusKeep",
      htmlContent: `
        <h2>Redefinição de senha</h2>
        <p>Você solicitou a redefinição da sua senha.</p>
        <p>Clique no botão abaixo para criar uma nova senha:</p>
        <a href="${resetUrl}" style="background:#2563eb;color:white;padding:10px 15px;text-decoration:none;border-radius:8px;">
          Redefinir Senha
        </a>
        <p>Se você não fez essa solicitação, ignore este e-mail.</p>
        <p><small>O link expira em 15 minutos.</small></p>
      `,
    };

    await axios.post(BREVO_API_URL, emailData, {
      headers: {
        "api-key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    return { success: true, message: "E-mail enviado com sucesso." };
  },
};
