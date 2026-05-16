"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const require_scopes_decorator_1 = require("../decorators/require-scopes.decorator");
let ScopesGuard = class ScopesGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredScopes = this.reflector.getAllAndOverride(require_scopes_decorator_1.SCOPES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        // If no scopes are required by the decorator, allow access
        if (!requiredScopes || requiredScopes.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        // Ensure user context exists (populated by JwtAuthGuard)
        if (!user) {
            throw new common_1.ForbiddenException({
                message: 'Missing authentication context',
                errorCode: 'AUTHZ_FORBIDDEN',
            });
        }
        // If it's a human user token, we skip scope validation (handled by RBAC/PermissionsGuard)
        if (user.type === 'user_access') {
            return true;
        }
        // If it's an integration token, we MUST validate scopes
        if (user.type === 'integration_access') {
            const hasAllScopes = requiredScopes.every((scope) => user.scopes?.includes(scope));
            if (!hasAllScopes) {
                throw new common_1.ForbiddenException({
                    message: `Insufficient scopes. Required: ${requiredScopes.join(', ')}`,
                    errorCode: 'AUTHZ_FORBIDDEN',
                });
            }
            return true;
        }
        // Fail for any other unknown token type
        throw new common_1.ForbiddenException({
            message: 'Invalid token type for scope authorization',
            errorCode: 'AUTHZ_FORBIDDEN',
        });
    }
};
exports.ScopesGuard = ScopesGuard;
exports.ScopesGuard = ScopesGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(core_1.Reflector)),
    __metadata("design:paramtypes", [core_1.Reflector])
], ScopesGuard);
//# sourceMappingURL=scopes.guard.js.map