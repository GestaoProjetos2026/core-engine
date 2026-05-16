import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/server/app.module';
import { ApiExceptionFilter } from '../src/server/common/api-exception.filter';
import { ResponseEnvelopeInterceptor } from '../src/server/common/response-envelope.interceptor';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';
import Redis from 'ioredis';

describe('Rate Limit (e2e)', () => {
  let app: NestFastifyApplication;
  let redis: Redis;

  beforeAll(async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication<NestFastifyApplication>(
        new FastifyAdapter(),
      );
      app.useGlobalPipes(new ValidationPipe({ transform: true }));
      app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());
      app.useGlobalFilters(new ApiExceptionFilter());
      await app.init();
      await app.getHttpAdapter().getInstance().ready();

      redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
      // Clear test keys
      const keys = await redis.keys('rl:*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (err) {
      console.error('Failed to initialize test app:', err);
      throw err;
    }
  });

  afterAll(async () => {
    if (redis) {
      const keys = await redis.keys('rl:*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      await redis.disconnect();
    }
    if (app) {
      await app.close();
    }
  });

  it('should allow up to 5 login attempts per minute', async () => {
    for (let i = 0; i < 5; i++) {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'test@example.com',
          password: 'Password123!',
        },
      });
      expect(response.statusCode).not.toBe(429);
    }

    const blockedResponse = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'test@example.com',
        password: 'Password123!',
      },
    });

    expect(blockedResponse.statusCode).toBe(429);
    const body = JSON.parse(blockedResponse.payload);
    expect(body.error.code).toBe('RATE_LIMIT_EXCEEDED');
  });

  it('should trigger lockout after 5 consecutive failures', async () => {
    // Clear keys for this test
    const keys = await redis.keys('rl:*');
    if (keys.length > 0) await redis.del(...keys);

    const email = `fail-${Date.now()}@example.com`;

    for (let i = 0; i < 5; i++) {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email,
          password: 'wrong-password',
        },
      });
      expect(response.statusCode).toBe(401);
    }

    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email,
        password: 'any',
      },
    });

    expect(response.statusCode).toBe(429);
    const body = JSON.parse(response.payload);
    expect(body.error.code).toBe('RATE_LIMIT_EXCEEDED');
    expect(body.error.message).toContain('account locked');
  });
});
