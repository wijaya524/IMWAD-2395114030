import { authRepository, AuthRepository } from '@/repositories/auth.repository';
import { hashPassword, verifyPassword, generateTokenPair, verifyToken } from '@/core/security';
import { AppError } from '@/core/error';
import { z } from 'zod';
import { SignupSchema, LoginSchema } from '@/models/auth.dto';

export class AuthService {
  constructor(private repo: AuthRepository) {}

  async signup(data: z.infer<typeof SignupSchema>) {
    const existing = await this.repo.findByEmail(data.email);
    if (existing) {
      throw new AppError(409, 'ERR_USER_EXISTS', 'Email sudah terdaftar');
    }

    const passwordHash = await hashPassword(data.password);
    return this.repo.createUser({
      email: data.email,
      name: data.name,
      passwordHash,
      role: data.role,
    });
  }

  async login(data: z.infer<typeof LoginSchema>) {
    const user = await this.repo.findByEmail(data.email);
    if (!user) {
      throw new AppError(401, 'ERR_INVALID_CREDENTIALS', 'Email atau kata sandi salah');
    }

    const isValid = await verifyPassword(data.password, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, 'ERR_INVALID_CREDENTIALS', 'Email atau kata sandi salah');
    }

    const tokens = generateTokenPair({ userId: user.id, email: user.email, role: user.role });
    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    const decoded = verifyToken(refreshToken);
    if (!decoded || !decoded.userId) {
      throw new AppError(401, 'ERR_INVALID_TOKEN', 'Refresh token kadaluarsa atau tidak valid');
    }

    const user = await this.repo.findById(decoded.userId);
    if (!user) {
      throw new AppError(404, 'ERR_USER_NOT_FOUND', 'Pengguna tidak ditemukan');
    }

    return generateTokenPair({ userId: user.id, email: user.email, role: user.role });
  }

  async getProfile(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new AppError(404, 'ERR_USER_NOT_FOUND', 'Pengguna tidak ditemukan');
    }
    return user;
  }
}

export const authService = new AuthService(authRepository);