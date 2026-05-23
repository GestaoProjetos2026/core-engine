"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permissions_guard_1 = require("./permissions.guard");
(0, vitest_1.describe)('PermissionsGuard', () => {
    let guard;
    let reflector;
    (0, vitest_1.beforeEach)(() => {
        reflector = new core_1.Reflector();
        guard = new permissions_guard_1.PermissionsGuard(reflector);
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
    (0, vitest_1.it)('should return true if no permissions are required', () => {
        vitest_1.vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
        const context = createMockContext();
        (0, vitest_1.expect)(guard.canActivate(context)).toBe(true);
    });
    (0, vitest_1.it)('should return true if required permissions array is empty', () => {
        vitest_1.vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);
        const context = createMockContext();
        (0, vitest_1.expect)(guard.canActivate(context)).toBe(true);
    });
    (0, vitest_1.it)('should throw ForbiddenException if user is not present', () => {
        vitest_1.vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user:write']);
        const context = createMockContext(undefined);
        (0, vitest_1.expect)(() => guard.canActivate(context)).toThrow(common_1.ForbiddenException);
        (0, vitest_1.expect)(() => guard.canActivate(context)).toThrowError('Insufficient permissions');
    });
    (0, vitest_1.it)('should throw ForbiddenException if user has no perms array', () => {
        vitest_1.vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user:write']);
        const context = createMockContext({ id: '123' });
        (0, vitest_1.expect)(() => guard.canActivate(context)).toThrow(common_1.ForbiddenException);
    });
    (0, vitest_1.it)('should throw ForbiddenException if user perms do not match requested permissions', () => {
        vitest_1.vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user:write']);
        const context = createMockContext({ perms: ['user:read'] });
        (0, vitest_1.expect)(() => guard.canActivate(context)).toThrow(common_1.ForbiddenException);
    });
    (0, vitest_1.it)('should return true if user has at least one of the required permissions', () => {
        vitest_1.vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user:write', 'admin:all']);
        const context = createMockContext({ perms: ['user:read', 'user:write'] });
        (0, vitest_1.expect)(guard.canActivate(context)).toBe(true);
    });
});
//# sourceMappingURL=permissions.guard.spec.js.map