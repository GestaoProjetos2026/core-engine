"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const health_controller_1 = require("./health.controller");
const health_service_1 = require("./health.service");
const vitest_1 = require("vitest");
(0, vitest_1.describe)('HealthController', () => {
    let controller;
    let healthServiceMock;
    (0, vitest_1.beforeEach)(async () => {
        healthServiceMock = {
            checkDatabase: vitest_1.vi.fn(),
            checkRedis: vitest_1.vi.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            controllers: [health_controller_1.HealthController],
            providers: [{ provide: health_service_1.HealthService, useValue: healthServiceMock }],
        }).compile();
        controller = module.get(health_controller_1.HealthController);
    });
    (0, vitest_1.it)('should return ok when both DB and Redis are ok', async () => {
        healthServiceMock.checkDatabase = vitest_1.vi.fn().mockResolvedValue('ok');
        healthServiceMock.checkRedis = vitest_1.vi.fn().mockResolvedValue('ok');
        const result = await controller.getHealth();
        (0, vitest_1.expect)(result).toEqual({
            status: 'ok',
            services: {
                database: 'ok',
                redis: 'ok',
            },
        });
    });
    (0, vitest_1.it)('should return degraded when database is degraded', async () => {
        healthServiceMock.checkDatabase = vitest_1.vi.fn().mockResolvedValue('degraded');
        healthServiceMock.checkRedis = vitest_1.vi.fn().mockResolvedValue('ok');
        const result = await controller.getHealth();
        (0, vitest_1.expect)(result).toEqual({
            status: 'degraded',
            services: {
                database: 'degraded',
                redis: 'ok',
            },
        });
    });
    (0, vitest_1.it)('should return degraded when redis is degraded', async () => {
        healthServiceMock.checkDatabase = vitest_1.vi.fn().mockResolvedValue('ok');
        healthServiceMock.checkRedis = vitest_1.vi.fn().mockResolvedValue('degraded');
        const result = await controller.getHealth();
        (0, vitest_1.expect)(result).toEqual({
            status: 'degraded',
            services: {
                database: 'ok',
                redis: 'degraded',
            },
        });
    });
});
//# sourceMappingURL=health.controller.spec.js.map