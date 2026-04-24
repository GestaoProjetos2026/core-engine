import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/server/app.module';
import { PrismaService } from '../src/server/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';

describe('Integration (e2e)', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaService;

  const testApp = {
    name: 'Test App',
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    prisma = app.get<PrismaService>(PrismaService);

    // Seed test data
    const clientSecretHash = await bcrypt.hash(testApp.clientSecret, 12);
    await prisma.application.upsert({
      where: { clientId: testApp.clientId },
      update: { clientSecretHash, status: 'ACTIVE' },
      create: {
        name: testApp.name,
        clientId: testApp.clientId,
        clientSecretHash,
        status: 'ACTIVE',
      },
    });

    const scope = await prisma.scope.upsert({
      where: { code: 'test:scope' },
      update: {},
      create: { code: 'test:scope', description: 'Test Scope' },
    });

    const dbApp = await prisma.application.findUnique({ where: { clientId: testApp.clientId } });
    await prisma.applicationScope.upsert({
      where: { applicationId_scopeId: { applicationId: dbApp!.id, scopeId: scope.id } },
      update: {},
      create: { applicationId: dbApp!.id, scopeId: scope.id },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /oauth/token (client_credentials) - JSON', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/oauth/token',
      payload: {
        grant_type: 'client_credentials',
        client_id: testApp.clientId,
        client_secret: testApp.clientSecret,
        scope: 'test:scope',
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.access_token).toBeDefined();
    expect(body.token_type).toBe('Bearer');
    expect(body.scope).toContain('test:scope');
  });

  it('POST /oauth/token (client_credentials) - x-www-form-urlencoded', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/oauth/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${testApp.clientId}&client_secret=${testApp.clientSecret}&scope=test:scope`,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.access_token).toBeDefined();
    expect(body.scope).toContain('test:scope');
  });

  it('POST /integration/token (alias)', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/integration/token',
      payload: {
        client_id: testApp.clientId,
        client_secret: testApp.clientSecret,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.access_token).toBeDefined();
  });

  it('POST /oauth/token - Invalid Credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/oauth/token',
      payload: {
        grant_type: 'client_credentials',
        client_id: testApp.clientId,
        client_secret: 'wrong-secret',
      },
    });

    expect(response.statusCode).toBe(401);
  });
});
