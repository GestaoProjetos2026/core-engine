import { CanActivate, ExecutionContext } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
export declare class RateLimitGuard implements CanActivate {
    private readonly rateLimitService;
    constructor(rateLimitService: RateLimitService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
//# sourceMappingURL=rate-limit.guard.d.ts.map