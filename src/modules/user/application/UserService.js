import { UserRepository } from "../infrastructure/UserRepository.js";
import { User } from "../domain/User.js";
import { hashPassword, comparePassword } from "../../../infrastructure/security/hash.js";
import { signToken } from "../../../infrastructure/security/jwt.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const UserService = {
  async register({ name, email, password, role }) {
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw new AppError("E-mail já cadastrado.", 409); // ⚠️ 409 Conflict é o código correto
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({ name, email, password: hashedPassword, role });
    const created = await UserRepository.create(user);

    return {
      id: created.id,
      name: created.name,
      email: created.email,
      role: created.role,
    };
  },

  async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new AppError("Credenciais inválidas.", 401); // ⚠️ 401 Unauthorized

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new AppError("Credenciais inválidas.", 401);

    const token = signToken({ id: user.id, role: user.role, email: user.email });
    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  },

  async profile(id) {
    const user = await UserRepository.findById(id);
    if (!user) throw new AppError("Usuário não encontrado.", 404); // ⚠️ 404 Not Found

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },
};
