import 'reflect-metadata';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import fastifyHelmet from '@fastify/helmet';
import { AppModule } from './server/app.module';
import { ApiExceptionFilter } from './server/common/api-exception.filter';
import { ResponseEnvelopeInterceptor } from './server/common/response-envelope.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      requestIdHeader: 'x-request-id',
      genReqId: () => randomUUID(),
    }),
    { bufferLogs: true },
  );

  app.enableCors();
  app.useLogger(app.get(Logger));

  // await app.register(fastifyHelmet, {
  //   contentSecurityPolicy:
  //     process.env.NODE_ENV === 'production'
  //       ? true
  //       : {
  //         directives: {
  //           defaultSrc: ["'self'"],
  //           styleSrc: ["'self'", "'unsafe-inline'"],
  //           imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
  //           scriptSrc: ["'self'", "https: 'unsafe-inline'"],
  //         },
  //       },
  // });

  //TROCAR DEPOIS
  // await app.register(fastifyHelmet, {
  //   hsts: false,
  //   contentSecurityPolicy: {
  //     directives: {
  //       defaultSrc: ["'self'"],
  //       styleSrc: ["'self'", "'unsafe-inline'"],
  //       imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
  //       scriptSrc: ["'self'", "https: 'unsafe-inline'"],
  //     },
  //   },
  // } as any);

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: false,
    hsts: false,
  } as any);

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
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Core Engine & Auth API')
    .setDescription(
      [
        'Central IAM (Identity, Access & Integration) REST API for the ERP Modular Cloud-Native.',
        '',
        '## Authentication',
        'Most endpoints require a Bearer JWT. Use `POST /v1/auth/login` to obtain tokens.',
        'Two token types are issued:',
        '- **`user_access`** — for human users; carries `roles` and `perms` claims.',
        '- **`integration_access`** — for M2M applications (client credentials); carries `scopes` claim.',
        '',
        '## Response envelope',
        'All responses follow a standard envelope:',
        '```json',
        '{ "success": true, "data": {}, "timestamp": "...", "path": "..." }',
        '```',
        'Errors use `error.code` for stable programmatic handling (see `docs/INTEGRATION_API_CONTRACT.md`).',
        '',
        '## Documentation',
        '- JWT guide for module consumers: `docs/JWT_GUIDE.md`',
        '- Error codes and envelope contract: `docs/INTEGRATION_API_CONTRACT.md`',
        '- Product requirements: `PRD.md`',
      ].join('\n'),
    )
    .setVersion('1.0.0')
    .setContact('Squad 1 — Core/Auth', '', 'vinicius5.lopes@hotmail.com')
    .setLicense('Internal — ERP Modular Cloud-Native', '')
    .addServer(process.env.DEV_SERVER_URL ?? 'http://20.246.82.149:8080', 'Development server')
    .addServer('http://localhost:3000', 'Local development')
    .addTag('Health', 'Service health and readiness probes (RF19)')
    .addTag('Auth', 'Authentication and token lifecycle: register, login, refresh, /me (RF01–RF08)')
    .addTag('Users', 'User management CRUD and status control (RF09)')
    .addTag('Roles', 'Role management and user–role bindings (RF10, RF12)')
    .addTag('Permissions', 'Permission management and role–permission bindings (RF11, RF13)')
    .addTag('Applications', 'Application credentials and scope management (RF14–RF16)')
    .addTag('Integration', 'Machine-to-machine token endpoint (RF17, RF21, RF22)')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'JWT access token. Obtain via `POST /v1/auth/login` (user_access) or `POST /v1/integration/token` (integration_access).',
      },
      'bearer',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('v1/docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'list',
      filter: true,
    },
    customSiteTitle: 'Core/Auth API Docs',
  });




  // Ignora o process.env.PORT para não conflitar com o Nginx, forçando a porta interna 3001
  const port = 3001;

  // Direct Fastify route for the root path (bypasses NestJS global prefix)
  const fastifyInstance = app.getHttpAdapter().getInstance();
  fastifyInstance.get('/', (_request, reply) => {
    // Return a plain object; the ResponseEnvelopeInterceptor will wrap it
    return {
      message: 'Core Engine & Auth API is running',
      version: '1.0.0',
      docs: '/v1/docs',
      health: '/v1/health',
    };
  });

  // await app.listen(port, '0.0.0.0');
  // await app.listen(process.env.PORT || 3000);
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

bootstrap();
