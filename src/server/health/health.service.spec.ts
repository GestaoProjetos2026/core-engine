import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';

vi.mock('ioredis', () => {
  const RedisMock = vi.fn();
  RedisMock.prototype.ping = vi.fn().mockResolvedValue('PONG');
  RedisMock.prototype.disconnect = vi.fn();
  Object.defineProperty(RedisMock.prototype, 'status', {
    get: () => 'ready',
    configurable: true,
  });
  return { default: RedisMock };
});

describe('HealthService', () => {
  let healthService: HealthService;
  let prismaServiceMock: Partial<PrismaService>;

  beforeEach(() => {
    prismaServiceMock = {
      $queryRaw: vi.fn().mockResolvedValue([{ '?column?': 1 }]),
    };
    healthService = new HealthService(prismaServiceMock as PrismaService);
  });

  it('should return ok for database when query runs successfully', async () => {
    const result = await healthService.checkDatabase();
    expect(result).toBe('ok');
    expect(prismaServiceMock.$queryRaw).toHaveBeenCalled();
  });

  it('should return degraded for database when query fails', async () => {
    prismaServiceMock.$queryRaw = vi.fn().mockRejectedValue(new Error('DB connection failed'));
    const result = await healthService.checkDatabase();
    expect(result).toBe('degraded');
  });

  it('should return ok for redis when ping succeeds', async () => {
    const result = await healthService.checkRedis();
    expect(result).toBe('ok');
  });

  it('should return degraded for redis when ping fails', async () => {
    const redisInstance = (healthService as any).redisClient;
    redisInstance.ping.mockRejectedValueOnce(new Error('Redis ping failed'));
    const result = await healthService.checkRedis();
    expect(result).toBe('degraded');
  });

  it('should return degraded for redis when status is not ready or connecting', async () => {
    const redisInstance = (healthService as any).redisClient;
    Object.defineProperty(redisInstance, 'status', { get: () => 'end' });
    const result = await healthService.checkRedis();
    expect(result).toBe('degraded');
  });
});
