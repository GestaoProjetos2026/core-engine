"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const vitest_1 = require("vitest");
const tenant_guard_1 = require("./tenant.guard");
const tenant_1 = require("../../../shared/constants/tenant");
function makeContext(user, headers = {}) {
    const request = {
        headers,
        ...(user !== undefined ? { user } : {}),
    };
    return {
        switchToHttp: () => ({ getRequest: () => request }),
        request,
    };
}
(0, vitest_1.describe)('TenantGuard', () => {
    const guard = new tenant_guard_1.TenantGuard();
    (0, vitest_1.it)('uses JWT tenant_id when X-Tenant-Id is omitted (user_access)', () => {
        const context = makeContext({
            type: 'user_access',
            tenantId: tenant_1.DEFAULT_TENANT_ID,
        });
        (0, vitest_1.expect)(guard.canActivate(context)).toBe(true);
        (0, vitest_1.expect)(context.request.tenantId).toBe(tenant_1.DEFAULT_TENANT_ID);
    });
    (0, vitest_1.it)('accepts matching X-Tenant-Id and JWT tenant_id', () => {
        const context = makeContext({ type: 'user_access', tenantId: tenant_1.DEFAULT_TENANT_ID }, { 'x-tenant-id': tenant_1.DEFAULT_TENANT_ID });
        (0, vitest_1.expect)(guard.canActivate(context)).toBe(true);
        (0, vitest_1.expect)(context.request.tenantId).toBe(tenant_1.DEFAULT_TENANT_ID);
    });
    (0, vitest_1.it)('rejects mismatched X-Tenant-Id (403 TENANT_MISMATCH)', () => {
        const context = makeContext({ type: 'user_access', tenantId: tenant_1.DEFAULT_TENANT_ID }, { 'x-tenant-id': '00000000-0000-4000-8000-000000000099' });
        let caught;
        try {
            guard.canActivate(context);
        }
        catch (e) {
            caught = e;
        }
        (0, vitest_1.expect)(caught).toBeInstanceOf(common_1.ForbiddenException);
        const body = caught.getResponse();
        (0, vitest_1.expect)(body.errorCode).toBe('TENANT_MISMATCH');
    });
    (0, vitest_1.it)('rejects user_access token without tenant_id claim', () => {
        const context = makeContext({ type: 'user_access' });
        (0, vitest_1.expect)(() => guard.canActivate(context)).toThrow(common_1.ForbiddenException);
    });
    (0, vitest_1.it)('requires X-Tenant-Id for integration_access (400 TENANT_HEADER_REQUIRED)', () => {
        const context = makeContext({ type: 'integration_access' });
        let caught;
        try {
            guard.canActivate(context);
        }
        catch (e) {
            caught = e;
        }
        (0, vitest_1.expect)(caught).toBeInstanceOf(common_1.BadRequestException);
        const body = caught.getResponse();
        (0, vitest_1.expect)(body.errorCode).toBe('TENANT_HEADER_REQUIRED');
    });
    (0, vitest_1.it)('accepts X-Tenant-Id for integration_access', () => {
        const context = makeContext({ type: 'integration_access' }, { 'x-tenant-id': tenant_1.DEFAULT_TENANT_ID });
        (0, vitest_1.expect)(guard.canActivate(context)).toBe(true);
        (0, vitest_1.expect)(context.request.tenantId).toBe(tenant_1.DEFAULT_TENANT_ID);
    });
    (0, vitest_1.it)('rejects invalid UUID in header', () => {
        const context = makeContext({ type: 'user_access', tenantId: tenant_1.DEFAULT_TENANT_ID }, { 'x-tenant-id': 'not-a-uuid' });
        (0, vitest_1.expect)(() => guard.canActivate(context)).toThrow(common_1.BadRequestException);
    });
});
//# sourceMappingURL=tenant.guard.spec.js.map