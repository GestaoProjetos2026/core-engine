import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { PrismaService } from '../../server/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma, AppStatus } from '@prisma/client';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: PrismaService,
          useValue: {
            application: {
              create: vi.fn(),
              findMany: vi.fn(),
              count: vi.fn(),
              findUnique: vi.fn(),
              update: vi.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an application returning clear client_secret', async () => {
      const createDto = { name: 'Test App' };
      const prismaMock = {
        id: '1',
        clientId: 'test-client-id',
        name: 'Test App',
        status: AppStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.spyOn(prisma.application, 'create').mockResolvedValue(prismaMock as any);

      const result = await service.create(createDto);

      expect(prisma.application.create).toHaveBeenCalled();
      expect(result.id).toEqual(prismaMock.id);
      expect(result.clientSecret).toBeDefined();
      expect(typeof result.clientSecret).toBe('string');
    });

    it('should throw ConflictException if client ID duplicates', async () => {
      vi.spyOn(prisma.application, 'create').mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('', { code: 'P2002', clientVersion: '1' })
      );
      await expect(service.create({ name: 'Test' })).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated list', async () => {
      const mockItems = [{ id: '1', name: 'App' }];
      vi.spyOn(prisma.application, 'findMany').mockResolvedValue(mockItems as any);
      vi.spyOn(prisma.application, 'count').mockResolvedValue(1);

      const result = await service.findAll({});
      expect(result.items).toEqual(mockItems);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return application', async () => {
      vi.spyOn(prisma.application, 'findUnique').mockResolvedValue({ id: '1' } as any);
      const result = await service.findOne('1');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException', async () => {
      vi.spyOn(prisma.application, 'findUnique').mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('regenerateSecret', () => {
    it('should update and return a new client_secret', async () => {
      const prismaMock = {
        id: '1',
        clientId: 'test-client-id',
        name: 'Test App',
        status: AppStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.spyOn(prisma.application, 'update').mockResolvedValue(prismaMock as any);

      const result = await service.regenerateSecret('1');
      expect(prisma.application.update).toHaveBeenCalled();
      expect(result.clientSecret).toBeDefined();
    });

    it('should throw NotFoundException if app not found', async () => {
      vi.spyOn(prisma.application, 'update').mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('', { code: 'P2025', clientVersion: '1' })
      );
      await expect(service.regenerateSecret('999')).rejects.toThrow(NotFoundException);
    });
  });
});
