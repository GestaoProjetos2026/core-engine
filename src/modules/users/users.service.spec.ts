import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../server/prisma/prisma.service';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

vi.mock('bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('hashed_password'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  };

  beforeEach(() => {
    prisma = mockPrismaService as unknown as PrismaService;
    service = new UsersService(prisma);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    mockPrismaService.user.create.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      passwordHash: 'hashed_password',
      name: 'Test',
      status: 'ACTIVE',
    });

    const result = await service.create({ email: 'test@test.com', name: 'Test', password: 'Password123' });
    expect(result).toEqual({ id: '1', email: 'test@test.com', name: 'Test', status: 'ACTIVE' });
    expect(bcrypt.hash).toHaveBeenCalledWith('Password123', 12);
  });

  it('should list users with pagination', async () => {
    mockPrismaService.user.findMany.mockResolvedValue([{ id: '1' }]);
    mockPrismaService.user.count.mockResolvedValue(1);

    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.items).toEqual([{ id: '1' }]);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
  });

  it('should throw ConflictException on duplicate email P2002', async () => {
    mockPrismaService.user.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error', { code: 'P2002', clientVersion: 'test' })
    );

    await expect(service.create({ email: 'dup@test.com', name: 'Dup', password: 'Pass' })).rejects.toThrow(ConflictException);
  });
});
