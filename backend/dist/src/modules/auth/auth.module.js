"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const rate_limit_module_1 = require("../../server/common/rate-limit/rate-limit.module");
const auth_time_util_1 = require("./auth-time.util");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_strategy_1 = require("./jwt.strategy");
const permissions_guard_1 = require("./guards/permissions.guard");
const scopes_guard_1 = require("./guards/scopes.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                global: false,
                secret: process.env.JWT_SECRET ?? 'dev-insecure-change-me',
                signOptions: {
                    expiresIn: (0, auth_time_util_1.parseDurationToSeconds)(process.env.JWT_EXPIRES_IN ?? '15m', 900),
                    algorithm: 'HS256',
                },
            }),
            rate_limit_module_1.RateLimitModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, permissions_guard_1.PermissionsGuard, scopes_guard_1.ScopesGuard],
        exports: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, permissions_guard_1.PermissionsGuard, scopes_guard_1.ScopesGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map