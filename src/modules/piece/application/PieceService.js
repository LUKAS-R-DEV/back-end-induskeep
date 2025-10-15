import { PieceRepository } from "../infrastructure/PieceRepository.js";
import { Piece } from "../domain/Piece.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { SettingsService } from "../../settings/application/SettingsService.js";
import { NotificationService } from "../../notification/application/NotificationService.js";


export const PieceService = {
  // 📍 Lista todas as peças
  async list() {
    try {
      return await PieceRepository.findAll();
    } catch (error) {
      console.error("❌ Erro ao listar peças:", error);
      throw new AppError("Erro interno ao listar peças.", 500);
    }
  },

  // 📍 Cria uma nova peça
  async create(data) {
    if (!data.code || !data.name || !data.quantity) {
      throw new AppError("Campos obrigatórios ausentes: code, name e quantity.", 400);
    }

    const existing = await PieceRepository.findByCode(data.code);
    if (existing) {
      throw new AppError("Peça já cadastrada com este código.", 409);
    }

    try {
  const settings = await SettingsService.get();
  const piece = new Piece(data);

  console.log("⚙️ Quantidade:", piece.quantity);
  console.log("⚙️ Estoque mínimo:", settings.minStockThreshold);

  if (piece.quantity < settings.minStockThreshold) {
    console.log("⚠️ Estoque baixo detectado — criando notificação...");
    await NotificationService.create({
      title: "Estoque baixo detectado",
      message: `Peça "${piece.name}" (${piece.code}) abaixo do mínimo (${settings.minStockThreshold}).`,
      userId: null,
    });
    console.log("✅ Notificação criada com sucesso!");
  }

  return await PieceRepository.create(piece);
} catch (error) {
  if (error instanceof AppError) throw error;
  console.error("❌ Erro ao criar peça:", error);
  throw new AppError("Erro interno ao criar peça.", 500);
}
  },

  // 📍 Atualiza uma peça
  // 📍 Atualiza uma peça
async update(id, data) {
  if (!id) throw new AppError("ID da peça não informado.", 400);
  if (!Object.keys(data).length) throw new AppError("Nenhum dado informado para atualização.", 400);

  const found = await PieceRepository.findById(id);
  if (!found) throw new AppError("Peça não encontrada.", 404);

  try {
    const updated = await PieceRepository.update(id, data);
    const settings = await SettingsService.get();

    console.log("⚙️ Quantidade atualizada:", updated.quantity);
    console.log("⚙️ Estoque mínimo:", settings.minStockThreshold);

    if (updated.quantity < settings.minStockThreshold) {
      console.log("⚠️ Estoque baixo detectado após atualização — criando notificação...");
      await NotificationService.create({
        title: "Estoque baixo após atualização",
        message: `Peça "${updated.name}" (${updated.code}) abaixo do mínimo (${settings.minStockThreshold}).`,
        userId: null,
      });
      console.log("✅ Notificação criada com sucesso após update!");
    }

    return updated;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("❌ Erro ao atualizar peça:", error);
    throw new AppError("Erro interno ao atualizar peça.", 500);
  }
},

  // 📍 Remove uma peça
  async remove(id) {
    if (!id) {
      throw new AppError("ID da peça não informado.", 400);
    }

    const found = await PieceRepository.findById(id);
    if (!found) {
      throw new AppError("Peça não encontrada.", 404);
    }

    try {
      await PieceRepository.delete(id);
      return { message: "Peça removida com sucesso." };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao remover peça:", error);
      throw new AppError("Erro interno ao remover peça.", 500);
    }
  },

  // 📍 Busca uma peça por ID
  async findById(id) {
    if (!id) {
      throw new AppError("ID da peça não informado.", 400);
    }

    try {
      const piece = await PieceRepository.findById(id);
      if (!piece) {
        throw new AppError("Peça não encontrada.", 404);
      }
      return piece;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao buscar peça:", error);
      throw new AppError("Erro interno ao buscar peça.", 500);
    }
  },

  // 📍 Busca uma peça por código
  async findByCode(code) {
    if (!code) {
      throw new AppError("Código da peça não informado.", 400);
    }

    try {
      const piece = await PieceRepository.findByCode(code);
      if (!piece) {
        throw new AppError("Peça não encontrada.", 404);
      }
      return piece;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao buscar peça por código:", error);
      throw new AppError("Erro interno ao buscar peça por código.", 500);
    }
  },
};