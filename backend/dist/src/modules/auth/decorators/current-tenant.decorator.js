"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentTenant = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentTenant = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.tenantId) {
        throw new Error('TenantGuard must run before @CurrentTenant()');
    }
    return request.tenantId;
});
//# sourceMappingURL=current-tenant.decorator.js.map