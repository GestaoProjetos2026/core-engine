import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

@Injectable()
export class RateLimitService implements OnModuleDestroy {
  private readonly logger = new Logger(RateLimitService.name);
  private readonly redisClient: Redis;
  
  private limiterIp: RateLimiterRedis;
  private limiterEmail: RateLimiterRedis;
  private limiterConsecutiveFailures: RateLimiterRedis;

  constructor() {
    this.redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      enableOfflineQueue: false,
    });

    const commonOpts = {
      storeClient: this.redisClient,
    };

    this.limiterIp = new RateLimiterRedis({
      ...commonOpts,
      keyPrefix: 'rl:ip',
      points: Number(process.env.THROTTLE_LIMIT || 100),
      duration: Number(process.env.THROTTLE_TTL || 60),
    });

    this.limiterEmail = new RateLimiterRedis({
      ...commonOpts,
      keyPrefix: 'rl:email',
      points: Number(process.env.THROTTLE_LIMIT || 100),
      duration: Number(process.env.THROTTLE_TTL || 60),
    });

    this.limiterConsecutiveFailures = new RateLimiterRedis({
      ...commonOpts,
      keyPrefix: 'rl:lockout',
      points: Number(process.env.LOCKOUT_FAILURES || 20),
      duration: 365 * 24 * 60 * 60,
      blockDuration: Number(process.env.LOCKOUT_TTL || 600), // Reduzi para 10 min no dev
    });
  }

  async checkLimits(ip: string, email: string): Promise<void> {
    await this.limiterIp.consume(ip);
    await this.limiterEmail.consume(email);

    const resEmail = await this.limiterConsecutiveFailures.get(email);
    if (resEmail && resEmail.remainingPoints <= 0) {
      throw { msBeforeNext: resEmail.msBeforeNext || 600000, remainingPoints: 0 };
    }

    const resIp = await this.limiterConsecutiveFailures.get(ip);
    if (resIp && resIp.remainingPoints <= 0) {
      throw { msBeforeNext: resIp.msBeforeNext || 600000, remainingPoints: 0 };
    }
  }

  async reportSuccess(ip: string, email: string): Promise<void> {
    await Promise.all([
      this.limiterConsecutiveFailures.delete(ip),
      this.limiterConsecutiveFailures.delete(email),
    ]);
  }

  async reportFailure(ip: string, email: string): Promise<void> {
    try {
      await Promise.all([
        this.limiterConsecutiveFailures.consume(ip),
        this.limiterConsecutiveFailures.consume(email),
      ]);
    } catch (rlRes) {
      this.logger.warn(`Lockout triggered for IP: ${ip} or Email: ${email}`);
    }
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
  }
}
