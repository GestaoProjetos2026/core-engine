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
var HealthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ioredis_1 = require("ioredis");
let HealthService = HealthService_1 = class HealthService {
    prisma;
    logger = new common_1.Logger(HealthService_1.name);
    redisClient;
    constructor(prisma) {
        this.prisma = prisma;
        this.redisClient = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379', {
            enableOfflineQueue: false,
            maxRetriesPerRequest: 1,
            connectTimeout: 2000,
        });
    }
    async checkDatabase() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return 'ok';
        }
        catch (error) {
            this.logger.error('Database health check failed', error instanceof Error ? error.stack : error);
            return 'degraded';
        }
    }
    async checkRedis() {
        try {
            if (this.redisClient.status !== 'ready' && this.redisClient.status !== 'connecting') {
                return 'degraded';
            }
            const response = await this.redisClient.ping();
            if (response !== 'PONG') {
                return 'degraded';
            }
            return 'ok';
        }
        catch (error) {
            this.logger.error('Redis health check failed', error instanceof Error ? error.stack : error);
            return 'degraded';
        }
    }
    onModuleDestroy() {
        this.redisClient.disconnect();
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = HealthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HealthService);
//# sourceMappingURL=health.service.js.map