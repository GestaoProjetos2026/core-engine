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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../server/prisma/prisma.service");
const health_service_1 = require("../../server/health/health.service");
let DashboardService = class DashboardService {
    prisma;
    health;
    constructor(prisma, health) {
        this.prisma = prisma;
        this.health = health;
    }
    async getStats() {
        try {
            // Individual fetches to isolate potential errors
            const totalUsers = await this.prisma.user.count().catch(() => 0);
            const totalRoles = await this.prisma.role.count().catch(() => 0);
            const totalApplications = await this.prisma.application.count().catch(() => 0);
            const dbHealth = await this.health.checkDatabase().catch(() => 'degraded');
            const redisHealth = await this.health.checkRedis().catch(() => 'degraded');
            return {
                totalUsers: Number(totalUsers),
                totalRoles: Number(totalRoles),
                totalApplications: Number(totalApplications),
                systemHealth: dbHealth === 'ok' && redisHealth === 'ok' ? 'Optimal' : 'Degraded',
                status: {
                    database: dbHealth,
                    redis: redisHealth,
                    auth: 'ok',
                }
            };
        }
        catch (error) {
            console.error('[DashboardService] FATAL ERROR:', error);
            throw error;
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(health_service_1.HealthService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        health_service_1.HealthService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map