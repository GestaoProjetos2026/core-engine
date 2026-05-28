"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantGuard = void 0;
const common_1 = require("@nestjs/common");
const tenant_headers_1 = require("../../../shared/constants/tenant-headers");
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
let TenantGuard = class TenantGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const headerValue = this.readHeader(request.headers[tenant_headers_1.X_TENANT_ID_HEADER]);
        if (headerValue && !UUID_RE.test(headerValue)) {
            throw new common_1.BadRequestException({
                message: 'X-Tenant-Id must be a valid UUID',
                errorCode: 'TENANT_HEADER_INVALID',
            });
        }
        const user = request.user;
        if (user?.type === 'user_access') {
            const tokenTenantId = user.tenantId;
            if (!tokenTenantId) {
                throw new common_1.ForbiddenException({
                    message: 'Access token is missing tenant_id claim',
                    errorCode: 'TENANT_CONTEXT_REQUIRED',
                });
            }
            if (headerValue && headerValue !== tokenTenantId) {
                throw new common_1.ForbiddenException({
                    message: 'X-Tenant-Id does not match tenant_id in access token',
                    errorCode: 'TENANT_MISMATCH',
                });
            }
            request.tenantId = headerValue ?? tokenTenantId;
            return true;
        }
        if (user?.type === 'integration_access') {
            if (!headerValue) {
                throw new common_1.BadRequestException({
                    message: 'X-Tenant-Id header is required for this endpoint',
                    errorCode: 'TENANT_HEADER_REQUIRED',
                });
            }
            request.tenantId = headerValue;
            return true;
        }
        return true;
    }
    readHeader(value) {
        if (value === undefined)
            return undefined;
        const raw = Array.isArray(value) ? value[0] : value;
        const trimmed = raw?.trim();
        return trimmed || undefined;
    }
};
exports.TenantGuard = TenantGuard;
exports.TenantGuard = TenantGuard = __decorate([
    (0, common_1.Injectable)()
], TenantGuard);
//# sourceMappingURL=tenant.guard.js.map