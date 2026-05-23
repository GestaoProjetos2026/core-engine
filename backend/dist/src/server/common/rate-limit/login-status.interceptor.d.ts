import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RateLimitService } from './rate-limit.service';
export declare class LoginStatusInterceptor implements NestInterceptor {
    private readonly rateLimitService;
    constructor(rateLimitService: RateLimitService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
//# sourceMappingURL=login-status.interceptor.d.ts.map