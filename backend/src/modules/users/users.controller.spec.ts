import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserStatus } from '@prisma/client';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DEFAULT_TENANT_ID } from '../../shared/constants/tenant';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    changeStatus: vi.fn(),
  };

  beforeEach(() => {
    service = mockUsersService as unknown as UsersService;
    controller = new UsersController(service);
  });

  it('should create a user', async () => {
    mockUsersService.create.mockResolvedValue({ id: '1', email: 'test@test.com' });
    const result = await controller.create(
      { email: 'test@test.com', name: 'Test', password: 'Password123' },
      DEFAULT_TENANT_ID,
    );
    expect(result).toEqual({ id: '1', email: 'test@test.com' });
    expect(service.create).toHaveBeenCalledWith(
      { email: 'test@test.com', name: 'Test', password: 'Password123' },
      DEFAULT_TENANT_ID,
    );
  });

  it('should find all users', async () => {
    mockUsersService.findAll.mockResolvedValue({ items: [], total: 0, page: 1, limit: 10 });
    const result = await controller.findAll({ page: 1, limit: 10 }, DEFAULT_TENANT_ID);
    expect(result).toEqual({ items: [], total: 0, page: 1, limit: 10 });
    expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 }, DEFAULT_TENANT_ID);
  });

  it('should find one user', async () => {
    mockUsersService.findOne.mockResolvedValue({ id: '1', email: 'test@test.com' });
    const result = await controller.findOne('1', DEFAULT_TENANT_ID);
    expect(result).toEqual({ id: '1', email: 'test@test.com' });
  });

  it('should change user status', async () => {
    mockUsersService.changeStatus.mockResolvedValue({ id: '1', status: 'INACTIVE' });
    const result = await controller.changeStatus(
      '1',
      { status: UserStatus.INACTIVE },
      DEFAULT_TENANT_ID,
    );
    expect(result).toEqual({ id: '1', status: 'INACTIVE' });
  });
});
