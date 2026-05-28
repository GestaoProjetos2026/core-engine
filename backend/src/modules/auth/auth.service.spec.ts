import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';
import { compare } from 'bcrypt';
import { describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service';
import type { PrismaService } from '../../server/prisma/prisma.service';

vi.mock('bcrypt', () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

function makePrismaMock() {
  const prisma = {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
  };
  prisma.$transaction.mockImplementation(
    async (fn: (tx: typeof prisma) => Promise<unknown>) => fn(prisma),
  );
  return prisma;
}

describe('AuthService', () => {
  it('register throws ConflictException on unique violation', async () => {
    const prisma = makePrismaMock();
    prisma.user.create.mockRejectedValue({ code: 'P2002' });
    const jwt = { signAsync: vi.fn() };
    const auditMock = { logLoginSuccess: vi.fn(), logLoginFailure: vi.fn(), logTokenRefresh: vi.fn() };
    const service = new AuthService(prisma as unknown as PrismaService, jwt as unknown as JwtService, auditMock as any);

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
    const auditMock = { logLoginSuccess: vi.fn(), logLoginFailure: vi.fn(), logTokenRefresh: vi.fn() };
    const service = new AuthService(prisma as unknown as PrismaService, jwt as unknown as JwtService, auditMock as any);

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

  it('refresh returns AUTH_REFRESH_INVALID when token row missing', async () => {
    const prisma = makePrismaMock();
    prisma.refreshToken.findUnique.mockResolvedValue(null);
    const jwt = { signAsync: vi.fn() };
    const auditMock = { logLoginSuccess: vi.fn(), logLoginFailure: vi.fn(), logTokenRefresh: vi.fn() };
    const service = new AuthService(prisma as unknown as PrismaService, jwt as unknown as JwtService, auditMock as any);

    await expect(service.refresh({ refreshToken: 'any-opaque' })).rejects.toSatisfy((e: unknown) => {
      if (!(e instanceof UnauthorizedException)) return false;
      const body = e.getResponse();
      return (
        typeof body === 'object' &&
        body !== null &&
        'errorCode' in body &&
        (body as { errorCode: string }).errorCode === 'AUTH_REFRESH_INVALID'
      );
    });
    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it('refresh returns AUTH_REFRESH_REUSED when token already revoked', async () => {
    const prisma = makePrismaMock();
    prisma.refreshToken.findUnique.mockResolvedValue({
      id: 'rt1',
      tokenHash: 'h',
      userId: 'u1',
      expiresAt: new Date(Date.now() + 86_400_000),
      revokedAt: new Date(),
      replacedById: null,
      createdAt: new Date(),
      user: {
        id: 'u1',
        email: 'a@b.com',
        passwordHash: 'p',
        name: 'N',
        status: UserStatus.ACTIVE,
        roles: [],
      },
    });
    const jwt = { signAsync: vi.fn() };
    const auditMock = { logLoginSuccess: vi.fn(), logLoginFailure: vi.fn(), logTokenRefresh: vi.fn() };
    const service = new AuthService(prisma as unknown as PrismaService, jwt as unknown as JwtService, auditMock as any);

    await expect(service.refresh({ refreshToken: 'x' })).rejects.toSatisfy((e: unknown) => {
      if (!(e instanceof UnauthorizedException)) return false;
      const body = e.getResponse();
      return (
        typeof body === 'object' &&
        body !== null &&
        'errorCode' in body &&
        (body as { errorCode: string }).errorCode === 'AUTH_REFRESH_REUSED'
      );
    });
  });

  it('refresh issues new tokens when rotation succeeds', async () => {
    const prisma = makePrismaMock();
    prisma.refreshToken.findUnique.mockResolvedValue({
      id: 'rt-old',
      tokenHash: 'h',
      userId: 'u1',
      expiresAt: new Date(Date.now() + 86_400_000),
      revokedAt: null,
      replacedById: null,
      createdAt: new Date(),
      user: {
        id: 'u1',
        email: 'a@b.com',
        passwordHash: 'p',
        name: 'N',
        status: UserStatus.ACTIVE,
        roles: [],
      },
    });
    prisma.refreshToken.create.mockResolvedValue({
      id: 'rt-new',
      tokenHash: 'nh',
      userId: 'u1',
      expiresAt: new Date(Date.now() + 86_400_000),
      revokedAt: null,
      replacedById: null,
      createdAt: new Date(),
    });
    prisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
    const jwt = { signAsync: vi.fn().mockResolvedValue('access.jwt') };
    const auditMock = { logLoginSuccess: vi.fn(), logLoginFailure: vi.fn(), logTokenRefresh: vi.fn() };
    const service = new AuthService(prisma as unknown as PrismaService, jwt as unknown as JwtService, auditMock as any);

    const out = await service.refresh({ refreshToken: 'opaque-value' });

    expect(out.accessToken).toBe('access.jwt');
    expect(out.tokenType).toBe('Bearer');
    expect(out.refreshToken.length).toBeGreaterThan(20);
    expect(jwt.signAsync).toHaveBeenCalledOnce();
    expect(prisma.refreshToken.updateMany).toHaveBeenCalled();
  });

  it('login JWT for suporte role excludes finance permissions', async () => {
    const prisma = makePrismaMock();
    prisma.user.findUnique.mockResolvedValue({
      id: 'u-sup',
      email: 'suporte@example.com',
      passwordHash: 'hash',
      name: 'Agente Suporte Demo',
      status: UserStatus.ACTIVE,
      roles: [
        {
          role: {
            name: 'suporte',
            permissions: [
              { permission: { code: 'customers:read' } },
              { permission: { code: 'tickets:read' } },
              { permission: { code: 'tickets:write' } },
              { permission: { code: 'dashboard:read' } },
            ],
          },
        },
      ],
    });
    prisma.refreshToken.create.mockResolvedValue({
      id: 'rt1',
      tokenHash: 'h',
      userId: 'u-sup',
      expiresAt: new Date(Date.now() + 86_400_000),
      revokedAt: null,
      replacedById: null,
      createdAt: new Date(),
    });
    vi.mocked(compare).mockImplementation(async () => true);
    const jwt = { signAsync: vi.fn().mockResolvedValue('access.jwt') };
    const auditMock = { logLoginSuccess: vi.fn(), logLoginFailure: vi.fn(), logTokenRefresh: vi.fn() };
    const service = new AuthService(prisma as unknown as PrismaService, jwt as unknown as JwtService, auditMock as any);

    await service.login({ email: 'suporte@example.com', password: 'Suporte123!' });

    expect(jwt.signAsync).toHaveBeenCalled();
    const payload = jwt.signAsync.mock.calls[0]![0] as {
      roles: string[];
      perms: string[];
      type: string;
    };
    expect(payload.type).toBe('user_access');
    expect(payload.roles).toEqual(['suporte']);
    expect(payload.perms).toContain('customers:read');
    expect(payload.perms).toContain('tickets:read');
    expect(payload.perms.some((p) => p.startsWith('finance:'))).toBe(false);
    expect(payload.perms.some((p) => p.startsWith('orders:'))).toBe(false);
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
    const auditMock = { logLoginSuccess: vi.fn(), logLoginFailure: vi.fn(), logTokenRefresh: vi.fn() };
    const service = new AuthService(prisma as unknown as PrismaService, jwt as unknown as JwtService, auditMock as any);

    await expect(service.login({ email: 'a@b.com', password: 'ValidPass1!x' })).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
