// src/interface/middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const body = {
    error: err.message || "Erro interno do servidor",
  };

  if (process.env.NODE_ENV !== "production" && err.stack) {
    body.stack = err.stack;
  }

  console.error("❌ Erro:", err.message);
  res.status(status).json(body);
};
