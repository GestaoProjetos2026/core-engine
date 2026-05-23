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
exports.LoginStatusInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const rate_limit_service_1 = require("./rate-limit.service");
let LoginStatusInterceptor = class LoginStatusInterceptor {
    rateLimitService;
    constructor(rateLimitService) {
        this.rateLimitService = rateLimitService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const ip = request.ip || request.raw?.ip || 'unknown';
        const email = request.body?.email || 'unknown';
        return next.handle().pipe((0, operators_1.tap)(() => {
            // Successful login
            this.rateLimitService.reportSuccess(ip, email);
        }), (0, operators_1.catchError)((err) => {
            // Check if it was an authentication failure
            if (err instanceof common_1.UnauthorizedException) {
                const body = err.getResponse();
                if (body?.errorCode === 'AUTH_INVALID_CREDENTIALS') {
                    // Reported as failure for lockout purposes
                    this.rateLimitService.reportFailure(ip, email);
                }
            }
            return (0, rxjs_1.throwError)(() => err);
        }));
    }
};
exports.LoginStatusInterceptor = LoginStatusInterceptor;
exports.LoginStatusInterceptor = LoginStatusInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(rate_limit_service_1.RateLimitService)),
    __metadata("design:paramtypes", [rate_limit_service_1.RateLimitService])
], LoginStatusInterceptor);
//# sourceMappingURL=login-status.interceptor.js.map