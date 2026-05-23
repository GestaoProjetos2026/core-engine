"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const scopes_guard_1 = require("./scopes.guard");
(0, vitest_1.describe)('ScopesGuard', () => {
    let guard;
    let reflector;
    (0, vitest_1.beforeEach)(() => {
        reflector = new core_1.Reflector();
        guard = new scopes_guard_1.ScopesGuard(reflector);
    });
    const createMockContext = (user) => {
        return {
            getHandler: vitest_1.vi.fn(),
            getClass: vitest_1.vi.fn(),
            switchToHttp: vitest_1.vi.fn().mockReturnValue({
                getRequest: vitest_1.vi.fn().mockReturnValue({
                    user,
                }),
            }),
        };
    };
    (0, vitest_1.it)('should be defined', () => {
        (0, vitest_1.expect)(guard).toBeDefined();
    });
    (0, vitest_1.it)('should return true if no scopes are required', () => {
        vitest_1.vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
        const context = createMockContext();
        (0, vitest_1.expect)(guard.canActivate(context)).toBe(true);
    });
    (0, vitest_1.it)('should throw ForbiddenException if user context is missing and scopes are required', () => {
        vitest_1.vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['orders:read']);
        const context = createMockContext(undefined);
        (0, vitest_1.expect)(() => guard.canActivate(context)).toThrow(common_1.ForbiddenException);
        (0, vitest_1.expect)(() => guard.canActivate(context)).toThrowError('Missing authentication context');
    });
    (0, vitest_1.it)('should return true for human users (user_access)', () => {
        vitest_1.vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['orders:read']);
        const context = createMockContext({ type: 'user_access' });
        (0, vitest_1.expect)(guard.canActivate(context)).toBe(true);
    });
    (0, vitest_1.it)('should throw ForbiddenException for integration tokens with missing scopes', () => {
        vitest_1.vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['orders:read', 'orders:write']);
        const context = createMockContext({
            type: 'integration_access',
            scopes: ['orders:read'],
        });
        (0, vitest_1.expect)(() => guard.canActivate(context)).toThrow(common_1.ForbiddenException);
        (0, vitest_1.expect)(() => guard.canActivate(context)).toThrowError(/Insufficient scopes/);
    });
    (0, vitest_1.it)('should return true for integration tokens with all required scopes', () => {
        vitest_1.vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['orders:read', 'orders:write']);
        const context = createMockContext({
            type: 'integration_access',
            scopes: ['orders:read', 'orders:write', 'other:scope'],
        });
        (0, vitest_1.expect)(guard.canActivate(context)).toBe(true);
    });
    (0, vitest_1.it)('should throw ForbiddenException for unknown token types', () => {
        vitest_1.vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['orders:read']);
        const context = createMockContext({ type: 'unknown_type' });
        (0, vitest_1.expect)(() => guard.canActivate(context)).toThrow(common_1.ForbiddenException);
        (0, vitest_1.expect)(() => guard.canActivate(context)).toThrowError('Invalid token type for scope authorization');
    });
});
//# sourceMappingURL=scopes.guard.spec.js.map