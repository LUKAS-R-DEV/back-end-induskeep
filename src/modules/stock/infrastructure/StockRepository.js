import prisma from "../../../infrastructure/database/prismaClient.js";

export const StockRepository = {
  async registerMovement(data) {
    const piece = await prisma.piece.findUnique({
      where: { id: data.pieceId }
    });
    if (!piece) throw new Error("Peça não encontrada");

    const newQuantity =
      data.type === "ENTRADA"
        ? piece.quantity + data.quantity
        : piece.quantity - data.quantity;

    if (newQuantity < 0) throw new Error("Quantidade insuficiente");

    // Atualiza o estoque da peça
    await prisma.piece.update({
      where: { id: data.pieceId },
      data: { quantity: newQuantity }
    });

    // Registra o movimento
    return await prisma.stockMovement.create({
      data,
      include: {
        piece: true,
        user: { select: { id: true, name: true, email: true } }
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
  }
};
