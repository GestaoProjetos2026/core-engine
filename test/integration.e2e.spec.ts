import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/server/app.module';
import { PrismaService } from '../src/server/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ApiExceptionFilter } from '../src/server/common/api-exception.filter';
import { ResponseEnvelopeInterceptor } from '../src/server/common/response-envelope.interceptor';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';

// Helper: parses the response body and extracts `data` from the envelope,
// falling back to the raw body for endpoints that return raw responses
// (e.g. OAuth token endpoints that follow RFC 6749 and skip the envelope).
// Since our global interceptor wraps ALL responses, tokens are at body.data.access_token.
const parseEnvelope = (payload: string) => JSON.parse(payload).data;

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
    app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());
    app.useGlobalFilters(new ApiExceptionFilter());
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
    const data = parseEnvelope(response.payload);
    expect(data.access_token).toBeDefined();
    expect(data.token_type).toBe('Bearer');
    expect(data.scope).toContain('test:scope');
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
    const data = parseEnvelope(response.payload);
    expect(data.access_token).toBeDefined();
    expect(data.scope).toContain('test:scope');
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
    const data = parseEnvelope(response.payload);
    expect(data.access_token).toBeDefined();
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

  describe('Scope Validation (RF18, CA07)', () => {
    let validToken: string;
    let restrictedToken: string;

    beforeAll(async () => {
      // 1. Obter token COM test:scope vinculado à aplicação principal
      const res1 = await app.inject({
        method: 'POST',
        url: '/oauth/token',
        payload: {
          grant_type: 'client_credentials',
          client_id: testApp.clientId,
          client_secret: testApp.clientSecret,
          scope: 'test:scope',
        },
      });
      validToken = parseEnvelope(res1.payload).access_token;

      // 2. Criar uma segunda aplicação SEM escopos para gerar token restrito
      const otherClientId = 'other-client-id';
      const otherSecret = 'other-secret';
      const hash = await bcrypt.hash(otherSecret, 12);
      await prisma.application.upsert({
        where: { clientId: otherClientId },
        update: { clientSecretHash: hash, status: 'ACTIVE' },
        create: { name: 'Other App', clientId: otherClientId, clientSecretHash: hash, status: 'ACTIVE' },
      });

      const res2 = await app.inject({
        method: 'POST',
        url: '/oauth/token',
        payload: {
          grant_type: 'client_credentials',
          client_id: otherClientId,
          client_secret: otherSecret,
          // sem scope → token emitido com scopes: []
        },
      });
      restrictedToken = parseEnvelope(res2.payload).access_token;
    });

    it('GET /integration/test-scope - 200 com escopo válido', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/integration/test-scope',
        headers: {
          authorization: `Bearer ${validToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const data = parseEnvelope(response.payload);
      expect(data.success).toBe(true);
    });

    it('GET /integration/test-scope - 403 com token sem o escopo', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/integration/test-scope',
        headers: {
          authorization: `Bearer ${restrictedToken}`,
        },
      });

      expect(response.statusCode).toBe(403);
      const body = JSON.parse(response.payload);
      expect(body.error.code).toBe('AUTHZ_FORBIDDEN');
    });

    it('GET /integration/test-scope - 401 sem token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/integration/test-scope',
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
