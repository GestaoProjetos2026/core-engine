"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationModule = void 0;
const common_1 = require("@nestjs/common");
const integration_controller_1 = require("./integration.controller");
const integration_service_1 = require("./integration.service");
const applications_module_1 = require("../applications/applications.module");
const auth_module_1 = require("../auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const auth_time_util_1 = require("../auth/auth-time.util");
let IntegrationModule = class IntegrationModule {
};
exports.IntegrationModule = IntegrationModule;
exports.IntegrationModule = IntegrationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            applications_module_1.ApplicationsModule,
            auth_module_1.AuthModule,
            jwt_1.JwtModule.register({
                global: false,
                secret: process.env.JWT_SECRET ?? 'dev-insecure-change-me',
                signOptions: {
                    expiresIn: (0, auth_time_util_1.parseDurationToSeconds)(process.env.JWT_EXPIRES_IN ?? '15m', 900),
                    algorithm: 'HS256',
                },
            }),
        ],
        controllers: [integration_controller_1.IntegrationController],
        providers: [integration_service_1.IntegrationService],
        exports: [integration_service_1.IntegrationService],
    })
], IntegrationModule);
//# sourceMappingURL=integration.module.js.map