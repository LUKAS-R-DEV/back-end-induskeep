import prisma from "../../../infrastructure/database/prismaClient.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const StockRepository = {
  async registerMovement(data) {
    const dto = typeof data?.toJSON === "function" ? data.toJSON() : { ...data };

    const piece = await prisma.piece.findUnique({ where: { id: dto.pieceId } });
    if (!piece) throw new AppError("Peça não encontrada.", 404);

    let newQuantity;
    if (dto.type === "ENTRY") {
      newQuantity = piece.quantity + dto.quantity;
    } else if (dto.type === "EXIT") {
      newQuantity = piece.quantity - dto.quantity;
    } else if (dto.type === "ADJUSTMENT") {
      // Ajuste define a quantidade diretamente
      newQuantity = dto.quantity;
    } else {
      throw new AppError("Tipo de movimentação inválido.", 400);
    }

    if (newQuantity < 0) throw new AppError("Quantidade insuficiente.", 400);

    // Atualiza a quantidade da peça
    await prisma.piece.update({
      where: { id: dto.pieceId },
      data: { quantity: newQuantity },
    });

    // Cria a movimentação e busca a peça atualizada
    const movement = await prisma.stockMovement.create({
      data: dto,
      include: {
        piece: true,
        user: { select: { id: true, name: true, email: true } },
      }
    });

    // Garante que a peça retornada tem a quantidade atualizada
    // Busca novamente para evitar problemas de cache
    const updatedPiece = await prisma.piece.findUnique({
      where: { id: dto.pieceId }
    });

    if (updatedPiece) {
      movement.piece = updatedPiece;
    }

    return movement;
  },

  async findAll(userId = null) {
    const where = userId ? { userId } : {};
    return await prisma.stockMovement.findMany({
      where,
      include: {
        piece: true,
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { movedAt: "desc" }
    });
  },

  async findByPiece(pieceId) {
    return await prisma.stockMovement.findMany({
      where: { pieceId },
      include: {
        piece: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { movedAt: "desc" },
    });
  },

  async findByPeriod(startDate, endDate, userId = null) {
    const where = {
      movedAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    };
    if (userId) {
      where.userId = userId;
    }
    return await prisma.stockMovement.findMany({
      where,
      include: {
        piece: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { movedAt: "desc" },
    });
  },

  async findById(id) {
    return await prisma.stockMovement.findUnique({
      where: { id },
      include: {
        piece: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async delete(id) {
    return await prisma.stockMovement.delete({
      where: { id },
    });
  }
};
