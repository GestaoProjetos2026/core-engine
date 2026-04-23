import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcrypt';
import * as dotenv from 'dotenv';
import { ApiExceptionFilter } from '../src/server/common/api-exception.filter';
import { ResponseEnvelopeInterceptor } from '../src/server/common/response-envelope.interceptor';
import { PrismaService } from '../src/server/prisma/prisma.service';

dotenv.config();

describe('RBAC Authorization (e2e)', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaService;
  let viewerAccessToken: string;

  const viewerEmail = 'e2e.viewer@example.com';
  const viewerPassword = 'Password!123';
  const viewerRoleName = 'e2e_viewer_no_write';
  const readPermissionCode = 'users:read';
  const writePermissionCode = 'users:write';

  beforeAll(async () => {
    const { AppModule } = await import('../src/server/app.module');
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
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

    await prisma.user.deleteMany({ where: { email: viewerEmail } });
    await prisma.role.deleteMany({ where: { name: viewerRoleName } });

    const readPermission = await prisma.permission.upsert({
      where: { code: readPermissionCode },
      update: {},
      create: { code: readPermissionCode, description: 'Read users' },
    });

    await prisma.permission.upsert({
      where: { code: writePermissionCode },
      update: {},
      create: { code: writePermissionCode, description: 'Create and update users' },
    });

    const viewerRole = await prisma.role.upsert({
      where: { name: viewerRoleName },
      update: {},
      create: { name: viewerRoleName },
    });

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: viewerRole.id,
          permissionId: readPermission.id,
        },
      },
      update: {},
      create: {
        roleId: viewerRole.id,
        permissionId: readPermission.id,
      },
    });

    const viewerPasswordHash = await hash(viewerPassword, 12);
    const viewerUser = await prisma.user.upsert({
      where: { email: viewerEmail },
      update: {
        name: 'E2E Viewer',
        status: 'ACTIVE',
        passwordHash: viewerPasswordHash,
      },
      create: {
        email: viewerEmail,
        name: 'E2E Viewer',
        status: 'ACTIVE',
        passwordHash: viewerPasswordHash,
      },
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: viewerUser.id,
          roleId: viewerRole.id,
        },
      },
      update: {},
      create: {
        userId: viewerUser.id,
        roleId: viewerRole.id,
      },
    });

    const loginResponse = await app.inject({
      method: 'POST',
      url: '/v1/auth/login',
      payload: {
        email: viewerEmail,
        password: viewerPassword,
      },
    });

    expect(loginResponse.statusCode).toBe(200);
    const loginBody = JSON.parse(loginResponse.body);
    viewerAccessToken = loginBody.data.accessToken;
  }, 30_000);

  afterAll(async () => {
    if (prisma) {
      try {
        await prisma.user.deleteMany({
          where: {
            OR: [
              { email: viewerEmail },
              { email: { startsWith: 'e2e.denied-write.' } },
            ],
          },
        });
        await prisma.role.deleteMany({ where: { name: viewerRoleName } });
      } catch {
        // Cleanup should not hide the primary failure reason.
      }
    }

    if (app) {
      await app.close();
    }
  }, 30_000);

  it('deve retornar 403 ao tentar criar usuário sem permission users:write', async () => {
    const deniedEmail = `e2e.denied-write.${Date.now()}@example.com`;

    const response = await app.inject({
      method: 'POST',
      url: '/v1/users',
      headers: {
        authorization: `Bearer ${viewerAccessToken}`,
      },
      payload: {
        email: deniedEmail,
        name: 'Should Not Be Created',
        password: 'Password!123',
      },
    });

    expect(response.statusCode).toBe(403);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('AUTHZ_FORBIDDEN');
  });
});
