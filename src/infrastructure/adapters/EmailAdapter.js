import axios from "axios";
import { AppError } from "../../shared/errors/AppError.js";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const BREVO_API_KEY = process.env.BREVO_API_KEY;

export const EmailAdapter = {
  async send({ to, subject, content }) {
    try {
      const payload = {
        sender: { name: "IndusKeep", email: "no-reply@induskeep.com" },
        to: [{ email: to }],
        subject,
        htmlContent: content,
      };

      const res = await axios.post(BREVO_API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY,
        },
      });

      return res.data;
    } catch (err) {
      console.error("❌ Erro ao enviar e-mail:", err.response?.data || err.message);
      throw new AppError("Falha ao enviar e-mail", 500);
    }
  },
};
