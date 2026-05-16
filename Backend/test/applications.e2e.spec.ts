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
    scope: {
      findMany: vi.fn(),
    },
    applicationScope: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    $transaction: vi.fn((operations) => Promise.all(operations)),
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

  it('/v1/applications/:id/scopes (POST)', async () => {
    const mockApp = { id: createdAppId };
    mockPrisma.application.findUnique.mockResolvedValue(mockApp);
    mockPrisma.scope.findMany.mockResolvedValue([{ id: 'scope-1' }]);
    mockPrisma.applicationScope.deleteMany.mockResolvedValue({ count: 0 });
    mockPrisma.applicationScope.createMany.mockResolvedValue({ count: 1 });

    const response = await app.inject({
      method: 'POST',
      url: `/v1/applications/${createdAppId}/scopes`,
      payload: { scopeIds: ['scope-1'] },
    });

    // The associateScopes method calls getScopes which calls findUnique again but with `include`,
    // the mock Prisma resolve will need to accommodate the `include` shape if we expect it to return correctly,
    // but we can just expect 201/200 for now. Actually, if findUnique returns { id: createdAppId }, 
    // `application.scopes.map` will throw an error since scopes is undefined. Let's mock it properly.
    mockPrisma.application.findUnique.mockResolvedValue({
      id: createdAppId,
      scopes: [{ scope: { id: 'scope-1', code: 'orders.read' } }]
    });

    const response2 = await app.inject({
      method: 'POST',
      url: `/v1/applications/${createdAppId}/scopes`,
      payload: { scopeIds: ['scope-1'] },
    });

    expect(response2.statusCode).toBe(201);
    const body = JSON.parse(response2.body);
    expect(body.success).toBe(true);
    expect(body.data[0].code).toBe('orders.read');
  });

  it('/v1/applications/:id/scopes (GET)', async () => {
    mockPrisma.application.findUnique.mockResolvedValue({
      id: createdAppId,
      scopes: [{ scope: { id: 'scope-1', code: 'orders.read' } }]
    });

    const response = await app.inject({
      method: 'GET',
      url: `/v1/applications/${createdAppId}/scopes`,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data[0].code).toBe('orders.read');
  });
});
