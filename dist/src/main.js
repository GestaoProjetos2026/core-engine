"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./server/app.module");
const api_exception_filter_1 = require("./server/common/api-exception.filter");
const response_envelope_interceptor_1 = require("./server/common/response-envelope.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter(), { logger: ['log', 'error', 'warn'] });
    app.setGlobalPrefix('v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalInterceptors(new response_envelope_interceptor_1.ResponseEnvelopeInterceptor());
    app.useGlobalFilters(new api_exception_filter_1.ApiExceptionFilter());
    if (process.env.NODE_ENV !== 'production') {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('Core Engine & Auth API')
            .setDescription('Core/Auth REST API for authentication, authorization (RBAC), and secure integrations.')
            .setVersion('1.0.0')
            .addTag('Health', 'Service health and readiness endpoints')
            .addTag('Auth', 'Authentication and token lifecycle endpoints')
            .addTag('Users', 'User management endpoints')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT access token for protected routes',
        }, 'bearer')
            .build();
        const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('v1/docs', app, swaggerDocument, {
            swaggerOptions: { persistAuthorization: true },
        });
    }
    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map