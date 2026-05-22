import { OnModuleDestroy } from '@nestjs/common';
export declare class RateLimitService implements OnModuleDestroy {
    private readonly logger;
    private readonly redisClient;
    private limiterIp;
    private limiterEmail;
    private limiterConsecutiveFailures;
    constructor();
    checkLimits(ip: string, email: string): Promise<void>;
    reportSuccess(ip: string, email: string): Promise<void>;
    reportFailure(ip: string, email: string): Promise<void>;
    onModuleDestroy(): void;
}
//# sourceMappingURL=rate-limit.service.d.ts.map