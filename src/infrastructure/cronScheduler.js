import cron from "node-cron";
import { PasswordRecoveryRepository } from "../modules/auth/infrastructure/PasswordRecoveryRepository.js";
import { AuditLogRepository } from "../modules/audit/infrastructure/AuditLogRepository.js";
import {
  sendScheduleReminders,
  sendScheduleReminders3Days,
  notifyOverdueOrders,
  sendDailyDigest,
} from "../jobs/notificationJobs.js";


export function registerCronJobs(){
    console.log("Iniciando cron jobs globais...");

    cron.schedule("0 3 * * *",async()=>{
        try{
            const result=await PasswordRecoveryRepository.deleteExpired();
            console.log("✅ Expirados:",result);
        }catch(err){
            console.error("❌ Erro ao deletar tokens expirados:",err.message);
        }
    })
    cron.schedule("0 4 * * *",async()=>{
        try{
        const cutoff=new Date();
        cutoff.setMonth(cutoff.getMonth()-3);
        const result=await AuditLogRepository.purgeOlderThan(cutoff.toISOString());
        console.log("✅ LOGS antigos Limpo:",result);
    }catch(err){
        console.error("❌ Erro ao limpar audit logs:",err.message);
    }
    })
cron.schedule(
    "0 8 * * *",
    async () => {
      try {
        console.log(
          `[${new Date().toLocaleString("pt-BR")}] ⏰ Executando jobs de notificação...`
        );
        const [reminders3Days, reminders, overdue, digest] = await Promise.all([
          sendScheduleReminders3Days(),
          sendScheduleReminders(),
          notifyOverdueOrders(),
          sendDailyDigest(),
        ]);
        console.log("✅ Jobs executados:", { reminders3Days, reminders, overdue, digest });
      } catch (e) {
        console.error("❌ Falha ao executar jobs de notificação:", e);
      }
    },
    { timezone: "America/Recife" }
  );

  console.log("✅ Todos os cron jobs foram agendados com sucesso.");




}