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

describe('ScopesModule (e2e)', () => {
  let app: NestFastifyApplication;

  const mockPrisma = {
    scope: {
      create: vi.fn(),
      findMany: vi.fn(),
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

  it('/v1/scopes (POST)', async () => {
    const mockScope = { id: 'mock-id', code: 'orders.read', description: 'Read orders' };
    mockPrisma.scope.create.mockResolvedValue(mockScope);

    const response = await app.inject({
      method: 'POST',
      url: '/v1/scopes',
      payload: { code: 'orders.read', description: 'Read orders' },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.code).toBe('orders.read');
  });

  it('/v1/scopes (GET)', async () => {
    const mockScope = { id: 'mock-id', code: 'orders.read', description: 'Read orders' };
    mockPrisma.scope.findMany.mockResolvedValue([mockScope]);

    const response = await app.inject({
      method: 'GET',
      url: '/v1/scopes',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data[0].code).toBe('orders.read');
  });
});
