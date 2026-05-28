"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_service_1 = require("./users.service");
const vitest_1 = require("vitest");
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const tenant_1 = require("../../shared/constants/tenant");
vitest_1.vi.mock('bcrypt', () => ({
    hash: vitest_1.vi.fn().mockResolvedValue('hashed_password'),
}));
const OTHER_TENANT_ID = '00000000-0000-4000-8000-000000000099';
(0, vitest_1.describe)('UsersService', () => {
    let service;
    const mockPrismaService = {
        user: {
            create: vitest_1.vi.fn(),
            findMany: vitest_1.vi.fn(),
            count: vitest_1.vi.fn(),
            findFirst: vitest_1.vi.fn(),
            findUnique: vitest_1.vi.fn(),
            update: vitest_1.vi.fn(),
        },
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        const auditMock = { logStatusChange: vitest_1.vi.fn() };
        service = new users_service_1.UsersService(mockPrismaService, auditMock);
    });
    (0, vitest_1.it)('should create a user in the given tenant', async () => {
        mockPrismaService.user.create.mockResolvedValue({
            id: '1',
            tenantId: tenant_1.DEFAULT_TENANT_ID,
            email: 'test@test.com',
            passwordHash: 'hashed_password',
            name: 'Test',
            status: 'ACTIVE',
        });
        const result = await service.create({ email: 'test@test.com', name: 'Test', password: 'Password123' }, tenant_1.DEFAULT_TENANT_ID);
        (0, vitest_1.expect)(result).toEqual({
            id: '1',
            tenantId: tenant_1.DEFAULT_TENANT_ID,
            email: 'test@test.com',
            name: 'Test',
            status: 'ACTIVE',
        });
        (0, vitest_1.expect)(mockPrismaService.user.create).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
            data: vitest_1.expect.objectContaining({ tenantId: tenant_1.DEFAULT_TENANT_ID }),
        }));
        (0, vitest_1.expect)(bcrypt.hash).toHaveBeenCalledWith('Password123', 12);
    });
    (0, vitest_1.it)('should list users scoped to tenant', async () => {
        mockPrismaService.user.findMany.mockResolvedValue([{ id: '1' }]);
        mockPrismaService.user.count.mockResolvedValue(1);
        await service.findAll({ page: 1, limit: 10 }, tenant_1.DEFAULT_TENANT_ID);
        (0, vitest_1.expect)(mockPrismaService.user.findMany).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
            where: vitest_1.expect.objectContaining({ tenantId: tenant_1.DEFAULT_TENANT_ID }),
        }));
    });
    (0, vitest_1.it)('findOne returns user only when id belongs to tenant', async () => {
        mockPrismaService.user.findFirst.mockResolvedValue({
            id: 'u1',
            tenantId: tenant_1.DEFAULT_TENANT_ID,
            email: 'a@b.com',
            name: 'A',
            status: 'ACTIVE',
        });
        const user = await service.findOne('u1', tenant_1.DEFAULT_TENANT_ID);
        (0, vitest_1.expect)(user.id).toBe('u1');
        (0, vitest_1.expect)(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
            where: { id: 'u1', tenantId: tenant_1.DEFAULT_TENANT_ID },
            select: vitest_1.expect.any(Object),
        });
    });
    (0, vitest_1.it)('findOne throws NotFound when user is in another tenant', async () => {
        mockPrismaService.user.findFirst.mockResolvedValue(null);
        await (0, vitest_1.expect)(service.findOne('u-other', tenant_1.DEFAULT_TENANT_ID)).rejects.toThrow(common_1.NotFoundException);
    });
    (0, vitest_1.it)('should throw ConflictException on duplicate email P2002', async () => {
        mockPrismaService.user.create.mockRejectedValue(new client_1.Prisma.PrismaClientKnownRequestError('Error', { code: 'P2002', clientVersion: 'test' }));
        await (0, vitest_1.expect)(service.create({ email: 'dup@test.com', name: 'Dup', password: 'Pass' }, tenant_1.DEFAULT_TENANT_ID)).rejects.toThrow(common_1.ConflictException);
    });
    (0, vitest_1.it)('update rejects cross-tenant user', async () => {
        mockPrismaService.user.findFirst.mockResolvedValue(null);
        await (0, vitest_1.expect)(service.update('u1', { name: 'X' }, OTHER_TENANT_ID)).rejects.toThrow(common_1.NotFoundException);
    });
});
//# sourceMappingURL=users.service.spec.js.map