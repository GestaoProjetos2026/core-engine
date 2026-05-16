import { Injectable, Logger, OnModuleDestroy, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';

@Injectable()
export class HealthService implements OnModuleDestroy {
  private readonly logger = new Logger(HealthService.name);
  private redisClient: Redis;

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    this.redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
    });
  }

  async checkDatabase(): Promise<'ok' | 'degraded'> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'ok';
    } catch (error) {
      this.logger.error('Database health check failed', error instanceof Error ? error.stack : error);
      return 'degraded';
    }
  }

  async checkRedis(): Promise<'ok' | 'degraded'> {
    try {
      if (this.redisClient.status !== 'ready' && this.redisClient.status !== 'connecting') {
         return 'degraded';
      }
      const response = await this.redisClient.ping();
      if (response !== 'PONG') {
        return 'degraded';
      }
      return 'ok';
    } catch (error) {
      this.logger.error('Redis health check failed', error instanceof Error ? error.stack : error);
      return 'degraded';
    }
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
  }
}
