import { UserRepository } from "../infrastructure/UserRepository.js";
import { User } from "../domain/User.js";
import { hashPassword, comparePassword } from "../../../infrastructure/security/hash.js";
import { signToken } from "../../../infrastructure/security/jwt.js";
import { AppError } from "../../../shared/errors/AppError.js";

export const UserService = {
  // 📍 Lista todos os usuários
  async list() {
    try {
      return await UserRepository.findAll()
   
    } catch (error) {
      console.error("❌ Erro ao listar usuários:", error);
      throw new AppError("Erro interno ao listar usuários.", 500);
    }
  },

  async findById(id) {
    try {
      if(!id) throw new AppError("ID do usuário nao informado.", 400);

      const user=await UserRepository.findById(id)
      if(!user) throw new AppError("Usuário nao encontrado.", 404);
      return user
    } catch (error) {
      console.error("❌ Erro ao buscar usuário:", error);
      throw new AppError("Erro interno ao buscar usuário.", 500);
    }
  },

  // 📍 Registra um novo usuário
  async register({ name, email, password, role }) {
    if (!name || !email || !password || !role) {
      throw new AppError("Campos obrigatórios ausentes: name, email, password e role.", 400);
    }

    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw new AppError("E-mail já cadastrado.", 409);
    }

    try {
      const hashedPassword = await hashPassword(password);
      const user = new User({ name, email, password: hashedPassword, role });
      const created = await UserRepository.create(user);

      return {
        id: created.id,
        name: created.name,
        email: created.email,
        role: created.role,
      };
    } catch (error) {
      console.error("❌ Erro ao registrar usuário:", error);
      throw new AppError("Erro interno ao registrar usuário.", 500);
    }
  },

  // 📍 Autentica usuário
  async login({ email, password }) {
    if (!email || !password) {
      throw new AppError("Email e senha são obrigatórios.", 400);
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Credenciais inválidas.", 401);
    }

    if (user.isActive === false) {
      throw new AppError("Usuário inativo.", 403);
    }

    try {
      const valid = await comparePassword(password, user.password);
      if (!valid) {
        throw new AppError("Credenciais inválidas.", 401);
      }

      const token = signToken({ id: user.id, role: user.role, email: user.email });
      return {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("❌ Erro ao fazer login:", error);
      throw new AppError("Erro interno ao fazer login.", 500);
    }
  },

  // 📍 Busca perfil do usuário
  async profile(id) {
    if (!id) {
      throw new AppError("ID do usuário não informado.", 400);
    }

    const user = await UserRepository.findById(id);
    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },

  // 📍 Atualiza usuário
  async update(id, data) {
    if (!id) {
      throw new AppError("ID do usuário não informado.", 400);
    }
    if (!Object.keys(data).length) {
      throw new AppError("Nenhum dado informado para atualização.", 400);
    }

    const user = await UserRepository.findById(id);
    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    try {
      return await UserRepository.update(id, data);
    } catch (error) {
      console.error("❌ Erro ao atualizar usuário:", error);
      throw new AppError("Erro interno ao atualizar usuário.", 500);
    }
  },

}
