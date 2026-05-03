import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    @Inject(RateLimitService) private readonly rateLimitService: RateLimitService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.raw?.ip || 'unknown';
    const email = request.body?.email || 'unknown';

    try {
      await this.rateLimitService.checkLimits(ip, email);
    } catch (err) {
      throw new HttpException(
        {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many attempts or account locked. Please try again later.',
          details: {
            retryAfter: err.msBeforeNext ? Math.ceil(err.msBeforeNext / 1000) : undefined,
          },
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );

    }

    return true;
  }
}
