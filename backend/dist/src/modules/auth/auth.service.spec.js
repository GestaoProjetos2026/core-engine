"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const vitest_1 = require("vitest");
const auth_service_1 = require("./auth.service");
const tenant_1 = require("../../shared/constants/tenant");
vitest_1.vi.mock('bcrypt', () => ({
    hash: vitest_1.vi.fn(),
    compare: vitest_1.vi.fn(),
}));
function makePrismaMock() {
    const prisma = {
        tenant: {
            findUnique: vitest_1.vi.fn().mockResolvedValue({ id: tenant_1.DEFAULT_TENANT_ID }),
        },
        user: {
            create: vitest_1.vi.fn(),
            findUnique: vitest_1.vi.fn(),
        },
        refreshToken: {
            create: vitest_1.vi.fn(),
            findUnique: vitest_1.vi.fn(),
            updateMany: vitest_1.vi.fn(),
            delete: vitest_1.vi.fn(),
        },
        $transaction: vitest_1.vi.fn(),
    };
    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
    return prisma;
}
(0, vitest_1.describe)('AuthService', () => {
    (0, vitest_1.it)('register throws ConflictException on unique violation', async () => {
        const prisma = makePrismaMock();
        prisma.user.create.mockRejectedValue({ code: 'P2002' });
        const jwt = { signAsync: vitest_1.vi.fn() };
        const auditMock = { logLoginSuccess: vitest_1.vi.fn(), logLoginFailure: vitest_1.vi.fn(), logTokenRefresh: vitest_1.vi.fn() };
        const service = new auth_service_1.AuthService(prisma, jwt, auditMock);
        await (0, vitest_1.expect)(service.register({
            email: 'a@b.com',
            name: 'A',
            password: 'ValidPass1!x',
        })).rejects.toBeInstanceOf(common_1.ConflictException);
    });
    (0, vitest_1.it)('login rejects unknown user with AUTH_INVALID_CREDENTIALS', async () => {
        const prisma = makePrismaMock();
        prisma.user.findUnique.mockResolvedValue(null);
        const jwt = { signAsync: vitest_1.vi.fn() };
        const auditMock = { logLoginSuccess: vitest_1.vi.fn(), logLoginFailure: vitest_1.vi.fn(), logTokenRefresh: vitest_1.vi.fn() };
        const service = new auth_service_1.AuthService(prisma, jwt, auditMock);
        await (0, vitest_1.expect)(service.login({ email: 'nope@b.com', password: 'x' })).rejects.toSatisfy((e) => {
            if (!(e instanceof common_1.UnauthorizedException))
                return false;
            const body = e.getResponse();
            return (typeof body === 'object' &&
                body !== null &&
                'errorCode' in body &&
                body.errorCode === 'AUTH_INVALID_CREDENTIALS');
        });
        (0, vitest_1.expect)(jwt.signAsync).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('refresh returns AUTH_REFRESH_INVALID when token row missing', async () => {
        const prisma = makePrismaMock();
        prisma.refreshToken.findUnique.mockResolvedValue(null);
        const jwt = { signAsync: vitest_1.vi.fn() };
        const auditMock = { logLoginSuccess: vitest_1.vi.fn(), logLoginFailure: vitest_1.vi.fn(), logTokenRefresh: vitest_1.vi.fn() };
        const service = new auth_service_1.AuthService(prisma, jwt, auditMock);
        await (0, vitest_1.expect)(service.refresh({ refreshToken: 'any-opaque' })).rejects.toSatisfy((e) => {
            if (!(e instanceof common_1.UnauthorizedException))
                return false;
            const body = e.getResponse();
            return (typeof body === 'object' &&
                body !== null &&
                'errorCode' in body &&
                body.errorCode === 'AUTH_REFRESH_INVALID');
        });
        (0, vitest_1.expect)(jwt.signAsync).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('refresh returns AUTH_REFRESH_REUSED when token already revoked', async () => {
        const prisma = makePrismaMock();
        prisma.refreshToken.findUnique.mockResolvedValue({
            id: 'rt1',
            tokenHash: 'h',
            userId: 'u1',
            expiresAt: new Date(Date.now() + 86_400_000),
            revokedAt: new Date(),
            replacedById: null,
            createdAt: new Date(),
            user: {
                id: 'u1',
                tenantId: tenant_1.DEFAULT_TENANT_ID,
                email: 'a@b.com',
                passwordHash: 'p',
                name: 'N',
                status: client_1.UserStatus.ACTIVE,
                roles: [],
            },
        });
        const jwt = { signAsync: vitest_1.vi.fn() };
        const auditMock = { logLoginSuccess: vitest_1.vi.fn(), logLoginFailure: vitest_1.vi.fn(), logTokenRefresh: vitest_1.vi.fn() };
        const service = new auth_service_1.AuthService(prisma, jwt, auditMock);
        await (0, vitest_1.expect)(service.refresh({ refreshToken: 'x' })).rejects.toSatisfy((e) => {
            if (!(e instanceof common_1.UnauthorizedException))
                return false;
            const body = e.getResponse();
            return (typeof body === 'object' &&
                body !== null &&
                'errorCode' in body &&
                body.errorCode === 'AUTH_REFRESH_REUSED');
        });
    });
    (0, vitest_1.it)('refresh issues new tokens when rotation succeeds', async () => {
        const prisma = makePrismaMock();
        prisma.refreshToken.findUnique.mockResolvedValue({
            id: 'rt-old',
            tokenHash: 'h',
            userId: 'u1',
            expiresAt: new Date(Date.now() + 86_400_000),
            revokedAt: null,
            replacedById: null,
            createdAt: new Date(),
            user: {
                id: 'u1',
                tenantId: tenant_1.DEFAULT_TENANT_ID,
                email: 'a@b.com',
                passwordHash: 'p',
                name: 'N',
                status: client_1.UserStatus.ACTIVE,
                roles: [],
            },
        });
        prisma.refreshToken.create.mockResolvedValue({
            id: 'rt-new',
            tokenHash: 'nh',
            userId: 'u1',
            expiresAt: new Date(Date.now() + 86_400_000),
            revokedAt: null,
            replacedById: null,
            createdAt: new Date(),
        });
        prisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
        const jwt = { signAsync: vitest_1.vi.fn().mockResolvedValue('access.jwt') };
        const auditMock = { logLoginSuccess: vitest_1.vi.fn(), logLoginFailure: vitest_1.vi.fn(), logTokenRefresh: vitest_1.vi.fn() };
        const service = new auth_service_1.AuthService(prisma, jwt, auditMock);
        const out = await service.refresh({ refreshToken: 'opaque-value' });
        (0, vitest_1.expect)(out.accessToken).toBe('access.jwt');
        (0, vitest_1.expect)(out.tokenType).toBe('Bearer');
        (0, vitest_1.expect)(out.refreshToken.length).toBeGreaterThan(20);
        (0, vitest_1.expect)(jwt.signAsync).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(prisma.refreshToken.updateMany).toHaveBeenCalled();
    });
    (0, vitest_1.it)('login JWT for suporte role excludes finance permissions', async () => {
        const prisma = makePrismaMock();
        prisma.user.findUnique.mockResolvedValue({
            id: 'u-sup',
            tenantId: tenant_1.DEFAULT_TENANT_ID,
            email: 'suporte@example.com',
            passwordHash: 'hash',
            name: 'Agente Suporte Demo',
            status: client_1.UserStatus.ACTIVE,
            roles: [
                {
                    role: {
                        name: 'suporte',
                        permissions: [
                            { permission: { code: 'customers:read' } },
                            { permission: { code: 'tickets:read' } },
                            { permission: { code: 'tickets:write' } },
                            { permission: { code: 'dashboard:read' } },
                        ],
                    },
                },
            ],
        });
        prisma.refreshToken.create.mockResolvedValue({
            id: 'rt1',
            tokenHash: 'h',
            userId: 'u-sup',
            expiresAt: new Date(Date.now() + 86_400_000),
            revokedAt: null,
            replacedById: null,
            createdAt: new Date(),
        });
        vitest_1.vi.mocked(bcrypt_1.compare).mockImplementation(async () => true);
        const jwt = { signAsync: vitest_1.vi.fn().mockResolvedValue('access.jwt') };
        const auditMock = { logLoginSuccess: vitest_1.vi.fn(), logLoginFailure: vitest_1.vi.fn(), logTokenRefresh: vitest_1.vi.fn() };
        const service = new auth_service_1.AuthService(prisma, jwt, auditMock);
        await service.login({ email: 'suporte@example.com', password: 'Suporte123!' });
        (0, vitest_1.expect)(jwt.signAsync).toHaveBeenCalled();
        const payload = jwt.signAsync.mock.calls[0][0];
        (0, vitest_1.expect)(payload.type).toBe('user_access');
        (0, vitest_1.expect)(payload.sub).toBe('u-sup');
        (0, vitest_1.expect)(payload.tenant_id).toBe(tenant_1.DEFAULT_TENANT_ID);
        (0, vitest_1.expect)(payload.roles).toEqual(['suporte']);
        (0, vitest_1.expect)(payload.perms).toContain('customers:read');
        (0, vitest_1.expect)(payload.perms).toContain('tickets:read');
        (0, vitest_1.expect)(payload.perms.some((p) => p.startsWith('finance:'))).toBe(false);
        (0, vitest_1.expect)(payload.perms.some((p) => p.startsWith('orders:'))).toBe(false);
    });
    (0, vitest_1.it)('login rejects inactive user like invalid credentials', async () => {
        const prisma = makePrismaMock();
        prisma.user.findUnique.mockResolvedValue({
            id: 'u1',
            tenantId: tenant_1.DEFAULT_TENANT_ID,
            email: 'a@b.com',
            passwordHash: 'hashed',
            name: 'A',
            status: client_1.UserStatus.INACTIVE,
            roles: [],
        });
        const jwt = { signAsync: vitest_1.vi.fn() };
        const auditMock = { logLoginSuccess: vitest_1.vi.fn(), logLoginFailure: vitest_1.vi.fn(), logTokenRefresh: vitest_1.vi.fn() };
        const service = new auth_service_1.AuthService(prisma, jwt, auditMock);
        await (0, vitest_1.expect)(service.login({ email: 'a@b.com', password: 'ValidPass1!x' })).rejects.toBeInstanceOf(common_1.UnauthorizedException);
    });
});
//# sourceMappingURL=auth.service.spec.js.map