import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/server/app.module';
import { ApiExceptionFilter } from '../src/server/common/api-exception.filter';
import { ResponseEnvelopeInterceptor } from '../src/server/common/response-envelope.interceptor';
import { PrismaService } from '../src/server/prisma/prisma.service';
import { DEFAULT_TENANT_ID } from '../src/shared/constants/tenant';
import * as bcrypt from 'bcrypt';

const parseEnvelope = (payload: string) => JSON.parse(payload).data;

describe('Users tenant isolation (e2e)', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaService;
  let adminAccessToken: string;
  let tenantBId: string;
  let tenantBUserId: string;

  const tenantBUserEmail = 'tenant-b-isolation@example.com';
  const adminEmail = 'admin@hotmail.com';
  const adminPassword = 'Admin12345!';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());
    app.useGlobalFilters(new ApiExceptionFilter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    prisma = app.get(PrismaService);

    const tenantB = await prisma.tenant.create({
      data: {
        name: `Tenant B E2E ${Date.now()}`,
        slug: `tenant-b-e2e-${Date.now()}`,
      },
    });
    tenantBId = tenantB.id;

    const passwordHash = await bcrypt.hash('TenantB123!x', 12);
    const tenantBUser = await prisma.user.create({
      data: {
        tenantId: tenantBId,
        email: tenantBUserEmail,
        name: 'User Tenant B',
        passwordHash,
        status: 'ACTIVE',
      },
    });
    tenantBUserId = tenantBUser.id;

    const loginRes = await app.inject({
      method: 'POST',
      url: '/v1/auth/login',
      payload: { email: adminEmail, password: adminPassword },
    });
    expect(loginRes.statusCode).toBe(200);
    adminAccessToken = parseEnvelope(loginRes.payload).accessToken;
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.user.deleteMany({ where: { email: tenantBUserEmail } });
      if (tenantBId) {
        await prisma.tenant.delete({ where: { id: tenantBId } }).catch(() => undefined);
      }
    }
    await app.close();
  });

  it('GET /v1/users does not return users from another tenant', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/users?limit=100',
      headers: { authorization: `Bearer ${adminAccessToken}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    const emails = (body.data.items as { email: string }[]).map((u) => u.email);
    expect(emails).not.toContain(tenantBUserEmail);
  });

  it('GET /v1/users/:id returns 404 for user in another tenant', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/v1/users/${tenantBUserId}`,
      headers: { authorization: `Bearer ${adminAccessToken}` },
    });

    expect(response.statusCode).toBe(404);
    const body = JSON.parse(response.payload);
    expect(body.error.code).toBe('RESOURCE_NOT_FOUND');
  });

  it('returns 403 when X-Tenant-Id mismatches JWT tenant_id', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/users?limit=1',
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
        'x-tenant-id': tenantBId,
      },
    });

    expect(response.statusCode).toBe(403);
    const body = JSON.parse(response.payload);
    expect(body.error.code).toBe('TENANT_MISMATCH');
  });

  it('accepts matching X-Tenant-Id header', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/users?limit=1',
      headers: {
        authorization: `Bearer ${adminAccessToken}`,
        'x-tenant-id': DEFAULT_TENANT_ID,
      },
    });

    expect(response.statusCode).toBe(200);
  });
});
