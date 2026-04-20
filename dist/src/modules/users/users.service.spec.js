"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_service_1 = require("./users.service");
const vitest_1 = require("vitest");
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
vitest_1.vi.mock('bcrypt', () => ({
    hash: vitest_1.vi.fn().mockResolvedValue('hashed_password'),
}));
(0, vitest_1.describe)('UsersService', () => {
    let service;
    let prisma;
    const mockPrismaService = {
        user: {
            create: vitest_1.vi.fn(),
            findMany: vitest_1.vi.fn(),
            count: vitest_1.vi.fn(),
            findUnique: vitest_1.vi.fn(),
            update: vitest_1.vi.fn(),
        },
    };
    (0, vitest_1.beforeEach)(() => {
        prisma = mockPrismaService;
        service = new users_service_1.UsersService(prisma);
    });
    (0, vitest_1.it)('should be defined', () => {
        (0, vitest_1.expect)(service).toBeDefined();
    });
    (0, vitest_1.it)('should create a user', async () => {
        mockPrismaService.user.create.mockResolvedValue({
            id: '1',
            email: 'test@test.com',
            passwordHash: 'hashed_password',
            name: 'Test',
            status: 'ACTIVE',
        });
        const result = await service.create({ email: 'test@test.com', name: 'Test', password: 'Password123' });
        (0, vitest_1.expect)(result).toEqual({ id: '1', email: 'test@test.com', name: 'Test', status: 'ACTIVE' });
        (0, vitest_1.expect)(bcrypt.hash).toHaveBeenCalledWith('Password123', 12);
    });
    (0, vitest_1.it)('should list users with pagination', async () => {
        mockPrismaService.user.findMany.mockResolvedValue([{ id: '1' }]);
        mockPrismaService.user.count.mockResolvedValue(1);
        const result = await service.findAll({ page: 1, limit: 10 });
        (0, vitest_1.expect)(result.items).toEqual([{ id: '1' }]);
        (0, vitest_1.expect)(result.total).toBe(1);
        (0, vitest_1.expect)(result.page).toBe(1);
    });
    (0, vitest_1.it)('should throw ConflictException on duplicate email P2002', async () => {
        mockPrismaService.user.create.mockRejectedValue(new client_1.Prisma.PrismaClientKnownRequestError('Error', { code: 'P2002', clientVersion: 'test' }));
        await (0, vitest_1.expect)(service.create({ email: 'dup@test.com', name: 'Dup', password: 'Pass' })).rejects.toThrow(common_1.ConflictException);
    });
});
//# sourceMappingURL=users.service.spec.js.map