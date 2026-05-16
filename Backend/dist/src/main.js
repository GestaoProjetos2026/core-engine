"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const swagger_1 = require("@nestjs/swagger");
const nestjs_pino_1 = require("nestjs-pino");
const crypto_1 = require("crypto");
const helmet_1 = require("@fastify/helmet");
const app_module_1 = require("./server/app.module");
const api_exception_filter_1 = require("./server/common/api-exception.filter");
const response_envelope_interceptor_1 = require("./server/common/response-envelope.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter({
        requestIdHeader: 'x-request-id',
        genReqId: () => (0, crypto_1.randomUUID)(),
    }), { bufferLogs: true });
    app.enableCors();
    app.useLogger(app.get(nestjs_pino_1.Logger));
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
    await app.register(helmet_1.default, {
        contentSecurityPolicy: false,
        hsts: false,
    });
    app.setGlobalPrefix('v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalInterceptors(new response_envelope_interceptor_1.ResponseEnvelopeInterceptor());
    app.useGlobalFilters(new api_exception_filter_1.ApiExceptionFilter());
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Core Engine & Auth API')
        .setDescription([
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
    ].join('\n'))
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
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token. Obtain via `POST /v1/auth/login` (user_access) or `POST /v1/integration/token` (integration_access).',
    }, 'bearer')
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('v1/docs', app, swaggerDocument, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
            docExpansion: 'list',
            filter: true,
        },
        customSiteTitle: 'Core/Auth API Docs',
    });
    const port = Number(process.env.PORT ?? 3000);
    // Direct Fastify route for the root path (bypasses NestJS global prefix)
    const fastifyInstance = app.getHttpAdapter().getInstance();
    fastifyInstance.get('/', (_request, reply) => {
        reply.send({
            success: true,
            message: 'Core Engine & Auth API is running',
            data: {
                version: '1.0.0',
                docs: '/v1/docs',
                health: '/v1/health',
            },
            timestamp: new Date().toISOString(),
            path: '/',
        });
    });
    await app.listen(port, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map