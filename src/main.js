// src/main.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import cron from "node-cron";

import env from "./infrastructure/config/env.js";
import router from "./interface/routes/index.js";
import { errorHandler } from "./interface/middlewares/errorHandler.js";
import { auditMiddleware } from "./interface/middlewares/auditMiddleware.js";
import {
  sendScheduleReminders,
  notifyOverdueOrders,
  sendDailyDigest,
} from "./jobs/notificationJobs.js";

// ================== CONFIGURAÇÃO BASE ==================
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Segurança & performance
app.set("trust proxy", 1);
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);
app.use(compression());

// ================== CORS SEGURO ==================
const allowedOrigins = [
  env.FRONTEND_URL,            // domínio configurado no .env
  "http://localhost:5173",     // ambiente dev
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // permite Postman, healthcheck etc.
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn(`🚫 CORS bloqueado para origem: ${origin}`);
      return callback(new Error("CORS bloqueado para essa origem"));
    },
    credentials: true, // permite cookies e headers de auth
  })
);

// ✅ Express 5 exige regex para o pré-flight
app.options(/.*/, cors());

// ================== MIDDLEWARES ==================
app.use(express.json());
app.use(morgan("dev"));
app.use(auditMiddleware);

// ================== HEALTHCHECK ==================
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", time: new Date().toISOString() });
});

// ================== API PRINCIPAL ==================
app.use("/api", router);

// ================== SERVIR FRONTEND (PRODUÇÃO) ==================
if (process.env.NODE_ENV === "production") {
  const distDir = path.join(__dirname, "../frontend/dist"); // ajuste se build gerar /build
  app.use(express.static(distDir));

  // ⚙️ Express 5 → use regex como fallback
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

// ================== ERROR HANDLER ==================
app.use(errorHandler);

// ================== INICIAR SERVIDOR ==================
const server = app.listen(env.PORT, () => {
  console.log(`✅ API rodando em http://localhost:${env.PORT}`);
  console.log(`🌐 Permitindo origem: ${env.FRONTEND_URL}`);
});

// ================== JOBS DIÁRIOS (08:00 America/Recife) ==================
let dailyTask;
try {
  dailyTask = cron.schedule(
    "0 8 * * *",
    async () => {
      try {
        console.log(
          `[${new Date().toLocaleString("pt-BR")}] ⏰ Executando jobs de notificação...`
        );
        const [reminders, overdue, digest] = await Promise.all([
          sendScheduleReminders(),
          notifyOverdueOrders(),
          sendDailyDigest(),
        ]);
        console.log("✅ Jobs executados:", { reminders, overdue, digest });
      } catch (e) {
        console.error("❌ Falha ao executar jobs de notificação:", e);
      }
    },
    {
      scheduled: true,
      timezone: "America/Recife",
    }
  );
  console.log("🗓️ Jobs diários agendados para 08:00 America/Recife");
} catch (e) {
  console.error("❌ Erro ao agendar jobs diários:", e);
}

// ================== ENCERRAMENTO GRACIOSO ==================
const shutdown = async (signal) => {
  console.log(`\n${signal} recebido. Encerrando...`);
  try {
    if (dailyTask) dailyTask.stop();
    server.close(() => {
      console.log("🔌 HTTP fechado.");
      process.exit(0);
    });
    // timeout de segurança
    setTimeout(() => process.exit(0), 5000).unref();
  } catch {
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
