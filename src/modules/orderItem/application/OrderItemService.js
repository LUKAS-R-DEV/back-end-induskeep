import { OrderItemRepository } from "../infrastructure/OrderItemRepository.js";
import { PieceRepository } from "../../piece/infrastructure/PieceRepository.js";
import { OrderItem } from "../domain/OrderItem.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const OrderItemService = {
  // 📍 Lista todos os itens de ordem
  async list() {
    try {
      return await OrderItemRepository.findAll();
    } catch (error) {
      console.error("❌ Erro ao listar itens de ordem:", error);
      throw new AppError("Erro interno ao listar itens de ordem.", 500);
    }
  },

  // 📍 Cria um novo item de ordem
  async create(data) {
    if (!data.pieceId || !data.quantity || !data.orderId) {
      throw new AppError("Campos obrigatórios ausentes: pieceId, quantity e orderId.", 400);
    }

    if (data.quantity <= 0) {
      throw new AppError("Quantidade deve ser maior que zero.", 400);
    }

    try {
      const piece = await PieceRepository.findById(data.pieceId);
      if (!piece) {
        throw new AppError("Peça não encontrada.", 404);
      }
      
      if (piece.quantity < data.quantity) {
        throw new AppError("Quantidade insuficiente em estoque.", 400);
      }
      
      const item = new OrderItem(data);
      await PieceRepository.update(piece.id, { quantity: piece.quantity - data.quantity });
      return await OrderItemRepository.create(item);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao criar item da ordem:", error);
      throw new AppError("Erro interno ao criar item da ordem.", 500);
    }
  },

  // 📍 Atualiza um item de ordem
  async update(id, data) {
    if (!id) {
      throw new AppError("ID do item não informado.", 400);
    }
    if (!Object.keys(data).length) {
      throw new AppError("Nenhum dado informado para atualização.", 400);
    }

    const found = await OrderItemRepository.findById(id);
    if (!found) {
      throw new AppError("Item não encontrado.", 404);
    }

    try {
      return await OrderItemRepository.update(id, data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao atualizar item da ordem:", error);
      throw new AppError("Erro interno ao atualizar item da ordem.", 500);
    }
  },

  // 📍 Remove um item de ordem
  async remove(id) {
    if (!id) {
      throw new AppError("ID do item não informado.", 400);
    }

    const found = await OrderItemRepository.findById(id);
    if (!found) {
      throw new AppError("Item não encontrado.", 404);
    }

    try {
      // Restaura a quantidade no estoque
      const piece = await PieceRepository.findById(found.pieceId);
      if (piece) {
        await PieceRepository.update(found.pieceId, { 
          quantity: piece.quantity + found.quantity 
        });
      }
      
      await OrderItemRepository.delete(id);
      return { message: "Item removido com sucesso." };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao remover item da ordem:", error);
      throw new AppError("Erro interno ao remover item da ordem.", 500);
    }
  },

  // 📍 Busca itens por ordem
  async findByOrder(orderId) {
    if (!orderId) {
      throw new AppError("ID da ordem não informado.", 400);
    }

    try {
      return await OrderItemRepository.findByOrder(orderId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao buscar itens por ordem:", error);
      throw new AppError("Erro interno ao buscar itens por ordem.", 500);
    }
  },

  // 📍 Busca um item por ID
  async findById(id) {
    if (!id) {
      throw new AppError("ID do item não informado.", 400);
    }

    try {
      const item = await OrderItemRepository.findById(id);
      if (!item) {
        throw new AppError("Item não encontrado.", 404);
      }
      return item;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao buscar item:", error);
      throw new AppError("Erro interno ao buscar item.", 500);
    }
  },
};