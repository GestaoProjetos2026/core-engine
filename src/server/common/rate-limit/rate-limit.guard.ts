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
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.raw?.ip || 'unknown';
    const email = request.body?.email || 'unknown';

    try {
      await this.rateLimitService.checkLimits(ip, email);
    } catch (err: any) {
      // Se for um erro do rate-limiter-flexible (objeto com msBeforeNext, etc)
      if (err.msBeforeNext || err.remainingPoints === 0) {
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

      // Se for erro de conexão (Redis fora, etc), logamos mas permitimos (ou falhamos 500)
      // Para o MVP, vamos logar o erro interno para facilitar o debug
      console.error('[RateLimitGuard] Internal Error:', err);
      
      // Opcional: Se o Redis cair, podemos escolher deixar passar ou travar tudo.
      // No MVP de desenvolvimento, vamos deixar passar para não bloquear o acesso.
      // throw new HttpException({ code: 'INTERNAL_SERVER_ERROR', message: 'Rate limit service unavailable' }, 500);
    }

    return true;
  }
}
