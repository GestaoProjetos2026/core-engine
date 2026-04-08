"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const vitest_1 = require("vitest");
const auth_service_1 = require("./auth.service");
function makePrismaMock() {
    return {
        user: {
            create: vitest_1.vi.fn(),
            findUnique: vitest_1.vi.fn(),
        },
        refreshToken: {
            create: vitest_1.vi.fn(),
        },
    };
}
(0, vitest_1.describe)('AuthService', () => {
    (0, vitest_1.it)('register throws ConflictException on unique violation', async () => {
        const prisma = makePrismaMock();
        prisma.user.create.mockRejectedValue({ code: 'P2002' });
        const jwt = { signAsync: vitest_1.vi.fn() };
        const service = new auth_service_1.AuthService(prisma, jwt);
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
        const service = new auth_service_1.AuthService(prisma, jwt);
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
    (0, vitest_1.it)('login rejects inactive user like invalid credentials', async () => {
        const prisma = makePrismaMock();
        prisma.user.findUnique.mockResolvedValue({
            id: 'u1',
            email: 'a@b.com',
            passwordHash: 'hashed',
            name: 'A',
            status: client_1.UserStatus.INACTIVE,
            roles: [],
        });
        const jwt = { signAsync: vitest_1.vi.fn() };
        const service = new auth_service_1.AuthService(prisma, jwt);
        await (0, vitest_1.expect)(service.login({ email: 'a@b.com', password: 'ValidPass1!x' })).rejects.toBeInstanceOf(common_1.UnauthorizedException);
    });
});
//# sourceMappingURL=auth.service.spec.js.map