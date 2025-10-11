import { AppError } from "../../shared/errors/AppError.js";

export function errorHandler(err, req, res, next) {
  console.error("❌ Erro:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Prisma Validation / Unique constraint
  if (err.code === "P2002") {
    return res.status(409).json({
      status: "error",
      message: "Registro duplicado — esse valor já existe.",
    });
  }

  // Prisma Foreign key
  if (err.code === "P2003") {
    return res.status(400).json({
      status: "error",
      message: "Referência inválida — entidade relacionada não encontrada.",
    });
  }

  // Default fallback
  return res.status(500).json({
    status: "error",
    message: "Erro interno do servidor.",
    details: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
