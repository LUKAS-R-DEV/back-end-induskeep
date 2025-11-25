import { StockRepository } from "../infrastructure/StockRepository.js";
import { StockMovement } from "../domain/StockMovement.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { SettingsService } from "../../settings/application/SettingsService.js";
import { NotificationService } from "../../notification/application/NotificationService.js";
import { UserRepository } from "../../user/infrastructure/UserRepository.js";


export const StockService = {
  // 📍 Lista todas as movimentações de estoque
  async list(user = null) {
    try {
      // Se for técnico, filtra apenas movimentações dele
      const userId = user && String(user.role || '').toUpperCase().trim() === "TECHNICIAN" ? user.id : null;
      return await StockRepository.findAll(userId);
    } catch (error) {
      console.error("❌ Erro ao listar movimentações de estoque:", error);
      throw new AppError("Erro interno ao listar movimentações de estoque.", 500);
    }
  },

  // 📍 Registra uma movimentação de estoque
  async move(data, user = null) {
    if (!data.pieceId || !data.quantity || !data.type) {
      throw new AppError("Campos obrigatórios ausentes: pieceId, quantity e type.", 400);
    }

    // Observação é obrigatória
    if (!data.notes || !data.notes.trim()) {
      throw new AppError("Observação é obrigatória. Informe o motivo da movimentação.", 400);
    }

    if (data.quantity <0||data.quantity===0) {
      throw new AppError("Quantidade deve ser maior que zero.", 400);
    }

    if (!['ENTRY', 'EXIT', 'ADJUSTMENT'].includes(data.type)) {
      throw new AppError("Tipo de movimentação inválido. Use: ENTRY, EXIT ou ADJUSTMENT.", 400);
    }

    // Se for técnico, permite apenas saída (EXIT)
    const userRole = user ? String(user.role || '').toUpperCase().trim() : '';
    if (userRole === "TECHNICIAN" && data.type !== "EXIT") {
      throw new AppError("Técnicos podem realizar apenas saídas de estoque (EXIT).", 403);
    }

    try {
      const movement = new StockMovement(data);
      const result = await StockRepository.registerMovement(movement);
      
      // Verifica se o estoque ficou abaixo do mínimo após a movimentação
      // Busca a peça novamente para garantir que temos a quantidade atualizada
      if (result.piece) {
        const settings = await SettingsService.get();
        const updatedPiece = result.piece;
        
        // A quantidade já está atualizada no result.piece porque o Prisma
        // retorna os dados atualizados após o update
        console.log("⚙️ Quantidade após movimentação:", updatedPiece.quantity);
        console.log("⚙️ Estoque mínimo:", settings.minStockThreshold);
        
        if (updatedPiece.quantity < settings.minStockThreshold) {
          console.log("⚠️ Estoque baixo detectado após movimentação — notificando admins e supervisores...");
          console.log(`📊 Comparação: ${updatedPiece.quantity} < ${settings.minStockThreshold} = ${updatedPiece.quantity < settings.minStockThreshold}`);
          
          // Notifica todos os administradores e supervisores ativos
          try {
            const allUsers = await UserRepository.findAll();
            console.log(`👥 Total de usuários encontrados: ${allUsers.length}`);
            
            const adminsAndSupervisors = allUsers.filter(u => 
              (u.role === "ADMIN" || u.role === "SUPERVISOR") && 
              u.isActive === true
            );
            
            console.log(`👥 Admins/Supervisores ativos encontrados: ${adminsAndSupervisors.length}`);
            if (adminsAndSupervisors.length === 0) {
              console.warn("⚠️ Nenhum admin ou supervisor ativo encontrado para notificar!");
            }

            const title = "Estoque baixo após movimentação";
            const message = `Peça "${updatedPiece.name}" (${updatedPiece.code}) abaixo do mínimo (${settings.minStockThreshold}) após movimentação de estoque.`;

            // Envia notificação para cada admin/supervisor
            let notificationsSent = 0;
            for (const user of adminsAndSupervisors) {
              try {
                const result = await NotificationService.createIfNotExists({
                  title,
                  message,
                  userId: user.id,
                  windowMinutes: 1440,
                });
                if (result?.id) {
                  notificationsSent++;
                  console.log(`✅ Notificação criada/enviada para ${user.role} ${user.name} (${user.id})`);
                } else {
                  console.log(`⏭️ Notificação duplicada ignorada para ${user.role} ${user.name}`);
                }
              } catch (notifError) {
                console.error(`❌ Erro ao enviar notificação para ${user.role} ${user.id}:`, notifError);
              }
            }
            console.log(`✅ Total de ${notificationsSent} notificação(ões) enviada(s) para ${adminsAndSupervisors.length} usuário(s) após movimentação!`);
          } catch (notifError) {
            // Não falha a movimentação se a notificação falhar
            console.error("❌ Erro ao buscar usuários para notificação:", notifError);
          }
        } else {
          console.log(`✅ Estoque OK após movimentação: ${updatedPiece.quantity} >= ${settings.minStockThreshold}`);
        }
      }
      
      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao registrar movimentação de estoque:", error);
      throw new AppError("Erro interno ao registrar movimentação de estoque.", 500);
    }
  },

  // 📍 Busca movimentações por peça
  async findByPiece(pieceId) {
    if (!pieceId) {
      throw new AppError("ID da peça não informado.", 400);
    }

    try {
      return await StockRepository.findByPiece(pieceId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao buscar movimentações por peça:", error);
      throw new AppError("Erro interno ao buscar movimentações por peça.", 500);
    }
  },

  // 📍 Busca movimentações por período
  async findByPeriod(startDate, endDate, user = null) {
    if (!startDate || !endDate) {
      throw new AppError("Data inicial e final são obrigatórias.", 400);
    }

    try {
      // Se for técnico, filtra apenas movimentações dele
      const userId = user && String(user.role || '').toUpperCase().trim() === "TECHNICIAN" ? user.id : null;
      return await StockRepository.findByPeriod(startDate, endDate, userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao buscar movimentações por período:", error);
      throw new AppError("Erro interno ao buscar movimentações por período.", 500);
    }
  },

  // 📍 Remove uma movimentação
  async remove(id) {
    if (!id) {
      throw new AppError("ID da movimentação não informado.", 400);
    }

    const found = await StockRepository.findById(id);
    if (!found) {
      throw new AppError("Movimentação não encontrada.", 404);
    }

    try {
      await StockRepository.delete(id);
      return { message: "Movimentação removida com sucesso." };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao remover movimentação:", error);
      throw new AppError("Erro interno ao remover movimentação.", 500);
    }
  },
};