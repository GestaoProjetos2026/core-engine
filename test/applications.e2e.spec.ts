import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/server/app.module';
import { ApiExceptionFilter } from '../src/server/common/api-exception.filter';
import { ResponseEnvelopeInterceptor } from '../src/server/common/response-envelope.interceptor';
import { PrismaService } from '../src/server/prisma/prisma.service';
import { JwtAuthGuard } from '../src/modules/auth/jwt-auth.guard';
import { PermissionsGuard } from '../src/modules/auth/guards/permissions.guard';
import { AppStatus } from '@prisma/client';

describe('ApplicationsModule (e2e)', () => {
  let app: NestFastifyApplication;

  const createdAppId = 'test-mock-id';
  const targetAppName = 'E2E Target App';

  const mockPrisma = {
    application: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard).useValue({ canActivate: () => true })
      .overrideProvider(PrismaService).useValue(mockPrisma)
      .compile();

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('/v1/applications (POST)', async () => {
    const mockApp = { id: createdAppId, name: targetAppName, clientId: 'c_id', status: AppStatus.ACTIVE, createdAt: new Date(), updatedAt: new Date() };
    mockPrisma.application.create.mockResolvedValue(mockApp);

    const response = await app.inject({
      method: 'POST',
      url: '/v1/applications',
      payload: { name: targetAppName },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.name).toBe(targetAppName);
    expect(body.data.clientSecret).toBeDefined();
  });

  it('/v1/applications (GET)', async () => {
    const mockApp = { id: createdAppId, name: targetAppName, clientId: 'c_id', status: AppStatus.ACTIVE, createdAt: new Date(), updatedAt: new Date() };
    mockPrisma.application.findMany.mockResolvedValue([mockApp]);
    mockPrisma.application.count.mockResolvedValue(1);

    const response = await app.inject({
      method: 'GET',
      url: '/v1/applications',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    
    const item = body.data.items[0];
    expect(item.id).toBe(createdAppId);
    expect(item.clientSecret).toBeUndefined();
    expect(item.clientSecretHash).toBeUndefined();
  });

  it('/v1/applications/:id (GET)', async () => {
    const mockApp = { id: createdAppId, name: targetAppName, clientId: 'c_id', status: AppStatus.ACTIVE, createdAt: new Date(), updatedAt: new Date() };
    mockPrisma.application.findUnique.mockResolvedValue(mockApp);

    const response = await app.inject({
      method: 'GET',
      url: `/v1/applications/${createdAppId}`,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.clientSecret).toBeUndefined();
  });

  it('/v1/applications/:id/regenerate-secret (POST)', async () => {
    const mockApp = { id: createdAppId, name: targetAppName, clientId: 'c_id', status: AppStatus.ACTIVE, createdAt: new Date(), updatedAt: new Date() };
    mockPrisma.application.update.mockResolvedValue(mockApp);

    const response = await app.inject({
      method: 'POST',
      url: `/v1/applications/${createdAppId}/regenerate-secret`,
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.clientSecret).toBeDefined();
  });
});
