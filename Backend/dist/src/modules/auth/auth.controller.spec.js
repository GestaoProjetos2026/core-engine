"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const vitest_1 = require("vitest");
const auth_controller_1 = require("./auth.controller");
(0, vitest_1.describe)('AuthController', () => {
    const authServiceMock = {
        register: vitest_1.vi.fn(),
        login: vitest_1.vi.fn(),
        refresh: vitest_1.vi.fn(),
    };
    const controller = new auth_controller_1.AuthController(authServiceMock);
    (0, vitest_1.describe)('getMe', () => {
        (0, vitest_1.it)('returns user profile for valid user_access token', () => {
            const req = {
                user: {
                    userId: 'u1',
                    email: 'test@b.com',
                    roles: ['admin'],
                    perms: ['user:read'],
                    type: 'user_access',
                },
            };
            const result = controller.getMe(req);
            (0, vitest_1.expect)(result).toEqual({
                userId: 'u1',
                email: 'test@b.com',
                roles: ['admin'],
                perms: ['user:read'],
                type: 'user_access',
            });
        });
        (0, vitest_1.it)('throws UnauthorizedException for non user_access token', () => {
            const req = {
                user: {
                    clientId: 'app1',
                    scopes: ['orders.read'],
                    type: 'integration_access',
                },
            };
            (0, vitest_1.expect)(() => controller.getMe(req)).toThrowError(common_1.UnauthorizedException);
            (0, vitest_1.expect)(() => controller.getMe(req)).toThrowError('Endpoint restricted to user access tokens');
        });
        (0, vitest_1.it)('throws UnauthorizedException if no user in req', () => {
            const req = {};
            (0, vitest_1.expect)(() => controller.getMe(req)).toThrowError(common_1.UnauthorizedException);
        });
    });
});
//# sourceMappingURL=auth.controller.spec.js.map