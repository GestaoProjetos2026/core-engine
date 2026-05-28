"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const vitest_1 = require("vitest");
const integration_token_guard_1 = require("./integration-token.guard");
function mockContext(user) {
    return {
        switchToHttp: () => ({
            getRequest: () => ({ user }),
        }),
    };
}
(0, vitest_1.describe)('IntegrationTokenGuard', () => {
    const guard = new integration_token_guard_1.IntegrationTokenGuard();
    (0, vitest_1.it)('allows integration_access tokens', () => {
        (0, vitest_1.expect)(guard.canActivate(mockContext({ type: 'integration_access', scopes: ['identity:read'] }))).toBe(true);
    });
    (0, vitest_1.it)('rejects human user_access tokens', () => {
        (0, vitest_1.expect)(() => guard.canActivate(mockContext({ type: 'user_access', perms: ['users:read'] }))).toThrow(common_1.ForbiddenException);
    });
});
//# sourceMappingURL=integration-token.guard.spec.js.map