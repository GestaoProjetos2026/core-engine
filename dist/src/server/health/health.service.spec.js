"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const health_service_1 = require("./health.service");
vitest_1.vi.mock('ioredis', () => {
    const RedisMock = vitest_1.vi.fn();
    RedisMock.prototype.ping = vitest_1.vi.fn().mockResolvedValue('PONG');
    RedisMock.prototype.disconnect = vitest_1.vi.fn();
    Object.defineProperty(RedisMock.prototype, 'status', {
        get: () => 'ready',
        configurable: true,
    });
    return { default: RedisMock };
});
(0, vitest_1.describe)('HealthService', () => {
    let healthService;
    let prismaServiceMock;
    (0, vitest_1.beforeEach)(() => {
        prismaServiceMock = {
            $queryRaw: vitest_1.vi.fn().mockResolvedValue([{ '?column?': 1 }]),
        };
        healthService = new health_service_1.HealthService(prismaServiceMock);
    });
    (0, vitest_1.it)('should return ok for database when query runs successfully', async () => {
        const result = await healthService.checkDatabase();
        (0, vitest_1.expect)(result).toBe('ok');
        (0, vitest_1.expect)(prismaServiceMock.$queryRaw).toHaveBeenCalled();
    });
    (0, vitest_1.it)('should return degraded for database when query fails', async () => {
        prismaServiceMock.$queryRaw = vitest_1.vi.fn().mockRejectedValue(new Error('DB connection failed'));
        const result = await healthService.checkDatabase();
        (0, vitest_1.expect)(result).toBe('degraded');
    });
    (0, vitest_1.it)('should return ok for redis when ping succeeds', async () => {
        const result = await healthService.checkRedis();
        (0, vitest_1.expect)(result).toBe('ok');
    });
    (0, vitest_1.it)('should return degraded for redis when ping fails', async () => {
        const redisInstance = healthService.redisClient;
        redisInstance.ping.mockRejectedValueOnce(new Error('Redis ping failed'));
        const result = await healthService.checkRedis();
        (0, vitest_1.expect)(result).toBe('degraded');
    });
    (0, vitest_1.it)('should return degraded for redis when status is not ready or connecting', async () => {
        const redisInstance = healthService.redisClient;
        Object.defineProperty(redisInstance, 'status', { get: () => 'end' });
        const result = await healthService.checkRedis();
        (0, vitest_1.expect)(result).toBe('degraded');
    });
});
//# sourceMappingURL=health.service.spec.js.map