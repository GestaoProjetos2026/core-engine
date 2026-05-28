import { UsersService } from './users.service';
import { PrismaService } from '../../server/prisma/prisma.service';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as bcrypt from 'bcrypt';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DEFAULT_TENANT_ID } from '../../shared/constants/tenant';

vi.mock('bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('hashed_password'),
}));

const OTHER_TENANT_ID = '00000000-0000-4000-8000-000000000099';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    user: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    const auditMock = { logStatusChange: vi.fn() };
    service = new UsersService(mockPrismaService as unknown as PrismaService, auditMock as any);
  });

  it('should create a user in the given tenant', async () => {
    mockPrismaService.user.create.mockResolvedValue({
      id: '1',
      tenantId: DEFAULT_TENANT_ID,
      email: 'test@test.com',
      passwordHash: 'hashed_password',
      name: 'Test',
      status: 'ACTIVE',
    });

    const result = await service.create(
      { email: 'test@test.com', name: 'Test', password: 'Password123' },
      DEFAULT_TENANT_ID,
    );
    expect(result).toEqual({
      id: '1',
      tenantId: DEFAULT_TENANT_ID,
      email: 'test@test.com',
      name: 'Test',
      status: 'ACTIVE',
    });
    expect(mockPrismaService.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tenantId: DEFAULT_TENANT_ID }),
      }),
    );
    expect(bcrypt.hash).toHaveBeenCalledWith('Password123', 12);
  });

  it('should list users scoped to tenant', async () => {
    mockPrismaService.user.findMany.mockResolvedValue([{ id: '1' }]);
    mockPrismaService.user.count.mockResolvedValue(1);

    await service.findAll({ page: 1, limit: 10 }, DEFAULT_TENANT_ID);

    expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: DEFAULT_TENANT_ID }),
      }),
    );
  });

  it('findOne returns user only when id belongs to tenant', async () => {
    mockPrismaService.user.findFirst.mockResolvedValue({
      id: 'u1',
      tenantId: DEFAULT_TENANT_ID,
      email: 'a@b.com',
      name: 'A',
      status: 'ACTIVE',
    });

    const user = await service.findOne('u1', DEFAULT_TENANT_ID);
    expect(user.id).toBe('u1');
    expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
      where: { id: 'u1', tenantId: DEFAULT_TENANT_ID },
      select: expect.any(Object),
    });
  });

  it('findOne throws NotFound when user is in another tenant', async () => {
    mockPrismaService.user.findFirst.mockResolvedValue(null);

    await expect(service.findOne('u-other', DEFAULT_TENANT_ID)).rejects.toThrow(NotFoundException);
  });

  it('should throw ConflictException on duplicate email P2002', async () => {
    mockPrismaService.user.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error', { code: 'P2002', clientVersion: 'test' }),
    );

    await expect(
      service.create({ email: 'dup@test.com', name: 'Dup', password: 'Pass' }, DEFAULT_TENANT_ID),
    ).rejects.toThrow(ConflictException);
  });

  it('update rejects cross-tenant user', async () => {
    mockPrismaService.user.findFirst.mockResolvedValue(null);

    await expect(
      service.update('u1', { name: 'X' }, OTHER_TENANT_ID),
    ).rejects.toThrow(NotFoundException);
  });
});
