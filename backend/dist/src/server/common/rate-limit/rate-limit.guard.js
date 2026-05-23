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
exports.RateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const rate_limit_service_1 = require("./rate-limit.service");
let RateLimitGuard = class RateLimitGuard {
    rateLimitService;
    constructor(rateLimitService) {
        this.rateLimitService = rateLimitService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const ip = request.ip || request.raw?.ip || 'unknown';
        const email = request.body?.email || 'unknown';
        try {
            await this.rateLimitService.checkLimits(ip, email);
        }
        catch (err) {
            // Se for um erro do rate-limiter-flexible (objeto com msBeforeNext, etc)
            if (err.msBeforeNext || err.remainingPoints === 0) {
                throw new common_1.HttpException({
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: 'Too many attempts or account locked. Please try again later.',
                    details: {
                        retryAfter: err.msBeforeNext ? Math.ceil(err.msBeforeNext / 1000) : undefined,
                    },
                }, common_1.HttpStatus.TOO_MANY_REQUESTS);
            }
            // Se for erro de conexão (Redis fora, etc), logamos mas permitimos (ou falhamos 500)
            // Para o MVP, vamos logar o erro interno para facilitar o debug
            console.error('[RateLimitGuard] Internal Error:', err);
            // Opcional: Se o Redis cair, podemos escolher deixar passar ou travar tudo.
            // No MVP de desenvolvimento, vamos deixar passar para não bloquear o acesso.
            // throw new HttpException({ code: 'INTERNAL_SERVER_ERROR', message: 'Rate limit service unavailable' }, 500);
        }
        return true;
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(rate_limit_service_1.RateLimitService)),
    __metadata("design:paramtypes", [rate_limit_service_1.RateLimitService])
], RateLimitGuard);
//# sourceMappingURL=rate-limit.guard.js.map