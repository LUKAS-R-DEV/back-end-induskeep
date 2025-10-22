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

    await prisma.piece.update({
      where: { id: dto.pieceId },
      data: { quantity: newQuantity },
    });

    return await prisma.stockMovement.create({
      data: dto,
      include: {
        piece: true,
        user: { select: { id: true, name: true, email: true } },
      }
    });
  },

  async findAll() {
    return await prisma.stockMovement.findMany({
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

  async findByPeriod(startDate, endDate) {
    return await prisma.stockMovement.findMany({
      where: {
        movedAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        piece: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { movedAt: "desc" },
    });
  }
};
