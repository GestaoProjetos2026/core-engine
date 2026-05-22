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
var RateLimitService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitService = void 0;
const common_1 = require("@nestjs/common");
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const ioredis_1 = require("ioredis");
let RateLimitService = RateLimitService_1 = class RateLimitService {
    logger = new common_1.Logger(RateLimitService_1.name);
    redisClient;
    limiterIp;
    limiterEmail;
    limiterConsecutiveFailures;
    constructor() {
        this.redisClient = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379', {
            enableOfflineQueue: false,
        });
        const commonOpts = {
            storeClient: this.redisClient,
        };
        this.limiterIp = new rate_limiter_flexible_1.RateLimiterRedis({
            ...commonOpts,
            keyPrefix: 'rl:ip',
            points: Number(process.env.THROTTLE_LIMIT || 100),
            duration: Number(process.env.THROTTLE_TTL || 60),
        });
        this.limiterEmail = new rate_limiter_flexible_1.RateLimiterRedis({
            ...commonOpts,
            keyPrefix: 'rl:email',
            points: Number(process.env.THROTTLE_LIMIT || 100),
            duration: Number(process.env.THROTTLE_TTL || 60),
        });
        this.limiterConsecutiveFailures = new rate_limiter_flexible_1.RateLimiterRedis({
            ...commonOpts,
            keyPrefix: 'rl:lockout',
            points: Number(process.env.LOCKOUT_FAILURES || 20),
            duration: 365 * 24 * 60 * 60,
            blockDuration: Number(process.env.LOCKOUT_TTL || 600), // Reduzi para 10 min no dev
        });
    }
    async checkLimits(ip, email) {
        await this.limiterIp.consume(ip);
        await this.limiterEmail.consume(email);
        const resEmail = await this.limiterConsecutiveFailures.get(email);
        if (resEmail && resEmail.remainingPoints <= 0) {
            throw { msBeforeNext: resEmail.msBeforeNext || 600000, remainingPoints: 0 };
        }
        const resIp = await this.limiterConsecutiveFailures.get(ip);
        if (resIp && resIp.remainingPoints <= 0) {
            throw { msBeforeNext: resIp.msBeforeNext || 600000, remainingPoints: 0 };
        }
    }
    async reportSuccess(ip, email) {
        await Promise.all([
            this.limiterConsecutiveFailures.delete(ip),
            this.limiterConsecutiveFailures.delete(email),
        ]);
    }
    async reportFailure(ip, email) {
        try {
            await Promise.all([
                this.limiterConsecutiveFailures.consume(ip),
                this.limiterConsecutiveFailures.consume(email),
            ]);
        }
        catch (rlRes) {
            this.logger.warn(`Lockout triggered for IP: ${ip} or Email: ${email}`);
        }
    }
    onModuleDestroy() {
        this.redisClient.disconnect();
    }
};
exports.RateLimitService = RateLimitService;
exports.RateLimitService = RateLimitService = RateLimitService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RateLimitService);
//# sourceMappingURL=rate-limit.service.js.map