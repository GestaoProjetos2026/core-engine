"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const health_service_1 = require("./health.service");
let HealthController = class HealthController {
    healthService;
    constructor(healthService) {
        this.healthService = healthService;
    }
    async getHealth() {
        const dbStatus = await this.healthService.checkDatabase();
        const redisStatus = await this.healthService.checkRedis();
        const isOk = dbStatus === 'ok' && redisStatus === 'ok';
        return {
            status: isOk ? 'ok' : 'degraded',
            services: {
                database: dbStatus,
                redis: redisStatus,
            },
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Health check',
        description: 'Returns service status and envelope metadata.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Service status (ok or degraded).',
        schema: {
            example: {
                success: true,
                data: {
                    status: 'ok',
                    services: {
                        database: 'ok',
                        redis: 'ok',
                    }
                },
                timestamp: '2026-03-26T15:03:48.186Z',
                path: '/v1/health',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Request validation error example.',
        schema: {
            example: {
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Payload validation failed',
                    details: ['Unexpected query parameter'],
                },
                timestamp: '2026-03-26T15:03:56.831Z',
                path: '/v1/health',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized error example for protected routes.',
        schema: {
            example: {
                success: false,
                error: {
                    code: 'AUTH_TOKEN_INVALID',
                    message: 'Invalid or missing bearer token',
                },
                timestamp: '2026-03-26T15:03:56.831Z',
                path: '/v1/health',
            },
        },
    }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getHealth", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.Controller)('health'),
    __param(0, (0, common_1.Inject)(health_service_1.HealthService)),
    __metadata("design:paramtypes", [health_service_1.HealthService])
], HealthController);
//# sourceMappingURL=health.controller.js.map