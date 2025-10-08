// src/infrastructure/security/jwt.js
import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const signToken = (payload, options = {}) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "2h",
    ...options,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
