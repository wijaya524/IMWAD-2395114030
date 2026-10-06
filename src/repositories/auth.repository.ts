import { prisma } from '@/core/db';
import { Prisma } from '@prisma/client';

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }
}

export const authRepository = new AuthRepository();