import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RateLimitService } from './rate-limit.service';

@Injectable()
export class LoginStatusInterceptor implements NestInterceptor {
  constructor(
    @Inject(RateLimitService) private readonly rateLimitService: RateLimitService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.raw?.ip || 'unknown';
    const email = request.body?.email || 'unknown';

    return next.handle().pipe(
      tap(() => {
        // Successful login
        this.rateLimitService.reportSuccess(ip, email);
      }),
      catchError((err) => {
        // Check if it was an authentication failure
        if (err instanceof UnauthorizedException) {
          const body = err.getResponse() as any;
          if (body?.errorCode === 'AUTH_INVALID_CREDENTIALS') {
            // Reported as failure for lockout purposes
            this.rateLimitService.reportFailure(ip, email);
          }
        }
        return throwError(() => err);
      }),
    );
  }
}
