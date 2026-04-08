import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service';
import type { PrismaService } from '../../server/prisma/prisma.service';

function makePrismaMock() {
  return {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
    },
  };
}

describe('AuthService', () => {
  it('register throws ConflictException on unique violation', async () => {
    const prisma = makePrismaMock();
    prisma.user.create.mockRejectedValue({ code: 'P2002' });
    const jwt = { signAsync: vi.fn() };
    const service = new AuthService(prisma as unknown as PrismaService, jwt as unknown as JwtService);

    await expect(
      service.register({
        email: 'a@b.com',
        name: 'A',
        password: 'ValidPass1!x',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('login rejects unknown user with AUTH_INVALID_CREDENTIALS', async () => {
    const prisma = makePrismaMock();
    prisma.user.findUnique.mockResolvedValue(null);
    const jwt = { signAsync: vi.fn() };
    const service = new AuthService(prisma as unknown as PrismaService, jwt as unknown as JwtService);

    await expect(service.login({ email: 'nope@b.com', password: 'x' })).rejects.toSatisfy((e: unknown) => {
      if (!(e instanceof UnauthorizedException)) return false;
      const body = e.getResponse();
      return (
        typeof body === 'object' &&
        body !== null &&
        'errorCode' in body &&
        (body as { errorCode: string }).errorCode === 'AUTH_INVALID_CREDENTIALS'
      );
    });
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it('login rejects inactive user like invalid credentials', async () => {
    const prisma = makePrismaMock();
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      passwordHash: 'hashed',
      name: 'A',
      status: UserStatus.INACTIVE,
      roles: [],
    });
    const jwt = { signAsync: vi.fn() };
    const service = new AuthService(prisma as unknown as PrismaService, jwt as unknown as JwtService);

    await expect(service.login({ email: 'a@b.com', password: 'ValidPass1!x' })).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
