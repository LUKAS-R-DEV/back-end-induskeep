// src/main.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import env from "./infrastructure/config/env.js";
import router from "./interface/routes/index.js";
import { errorHandler } from "./interface/middlewares/errorHandler.js";
import { auditMiddleware } from "./interface/middlewares/auditMiddleware.js";
import { sendScheduleReminders, notifyOverdueOrders, sendDailyDigest } from "./jobs/notificationJobs.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(auditMiddleware);
app.use("/api", router);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`✅ API rodando em http://localhost:${env.PORT}`);
  // Agenda jobs diários às 08:00 (horário do servidor)
  try {
    const scheduleDailyAt = (hour = 8, minute = 0) => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(hour, minute, 0, 0);
      if (next <= now) {
        next.setDate(next.getDate() + 1);
      }
      const msUntilNext = next.getTime() - now.getTime();
      setTimeout(async () => {
        // Executa uma vez
        try {
          console.log("⏰ Executando jobs de notificação diários...");
          const [reminders, overdue, digest] = await Promise.all([
            sendScheduleReminders(),
            notifyOverdueOrders(),
            sendDailyDigest(),
          ]);
          console.log("✅ Jobs executados:", { reminders, overdue, digest });
        } catch (e) {
          console.error("❌ Falha ao executar jobs de notificação:", e);
        }
        // Agenda próximos a cada 24h
        setInterval(async () => {
          try {
            console.log("⏰ Executando jobs de notificação diários...");
            const [reminders, overdue, digest] = await Promise.all([
              sendScheduleReminders(),
              notifyOverdueOrders(),
              sendDailyDigest(),
            ]);
            console.log("✅ Jobs executados:", { reminders, overdue, digest });
          } catch (e) {
            console.error("❌ Falha ao executar jobs de notificação:", e);
          }
        }, 24 * 60 * 60 * 1000);
      }, msUntilNext);
    };
    scheduleDailyAt(8, 0);
  } catch (e) {
    console.error("❌ Erro ao agendar jobs diários:", e);
  }
});
