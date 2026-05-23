import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/server/app.module';
import { ApiExceptionFilter } from '../src/server/common/api-exception.filter';
import { ResponseEnvelopeInterceptor } from '../src/server/common/response-envelope.interceptor';
import { PrismaService } from '../src/server/prisma/prisma.service';

describe('AuthModule (e2e)', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaService;

  const testEmail = 'e2e_test@example.com';
  const testPassword = 'Password!123';
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );

    app.setGlobalPrefix('v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());
    app.useGlobalFilters(new ApiExceptionFilter());

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    prisma = app.get(PrismaService);
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.user.deleteMany({ where: { email: testEmail } });
    }
    await app.close();
  });

  it('/v1/auth/register (POST)', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/auth/register',
      payload: {
        email: testEmail,
        name: 'E2E User',
        password: testPassword,
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.email).toBe(testEmail);
  });

  it('/v1/auth/login (POST)', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/auth/login',
      payload: {
        email: testEmail,
        password: testPassword,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    
    expect(body.data.accessToken).toBeDefined();
    expect(body.data.refreshToken).toBeDefined();

    accessToken = body.data.accessToken;
    refreshToken = body.data.refreshToken;
  });

  it('/v1/auth/me (GET) - Valid token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/auth/me',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.email).toBe(testEmail);
  });

  it('/v1/auth/me (GET) - No token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/auth/me',
    });

    expect(response.statusCode).toBe(401);
  });

  it('/v1/auth/refresh (POST) - Valid reuse', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/auth/refresh',
      payload: {
        refreshToken: refreshToken,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.accessToken).toBeDefined();
    expect(body.data.refreshToken).toBeDefined();
    expect(body.data.refreshToken).not.toBe(refreshToken); // Must be a new one
  });

  it('/v1/auth/refresh (POST) - Re-using the same refresh should fail', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/auth/refresh',
      payload: {
        refreshToken: refreshToken, // The old one
      },
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body.error.code).toBe('AUTH_REFRESH_REUSED');
  });
});
