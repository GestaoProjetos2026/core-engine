import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('HealthController', () => {
  let controller: HealthController;
  let healthServiceMock: Partial<HealthService>;

  beforeEach(async () => {
    healthServiceMock = {
      checkDatabase: vi.fn(),
      checkRedis: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: HealthService, useValue: healthServiceMock }],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should return ok when both DB and Redis are ok', async () => {
    healthServiceMock.checkDatabase = vi.fn().mockResolvedValue('ok');
    healthServiceMock.checkRedis = vi.fn().mockResolvedValue('ok');

    const result = await controller.getHealth();
    expect(result).toEqual({
      status: 'ok',
      services: {
        database: 'ok',
        redis: 'ok',
      },
    });
  });

  it('should return degraded when database is degraded', async () => {
    healthServiceMock.checkDatabase = vi.fn().mockResolvedValue('degraded');
    healthServiceMock.checkRedis = vi.fn().mockResolvedValue('ok');

    const result = await controller.getHealth();
    expect(result).toEqual({
      status: 'degraded',
      services: {
        database: 'degraded',
        redis: 'ok',
      },
    });
  });

  it('should return degraded when redis is degraded', async () => {
    healthServiceMock.checkDatabase = vi.fn().mockResolvedValue('ok');
    healthServiceMock.checkRedis = vi.fn().mockResolvedValue('degraded');

    const result = await controller.getHealth();
    expect(result).toEqual({
      status: 'degraded',
      services: {
        database: 'ok',
        redis: 'degraded',
      },
    });
  });
});
