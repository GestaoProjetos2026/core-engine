import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

type SuccessEnvelope<T> = {
  success: true;
  data: T;
  timestamp: string;
  path: string;
  meta?: {
    requestId: string;
  };
};


@Injectable()
export class ResponseEnvelopeInterceptor<T>
  implements NestInterceptor<T, SuccessEnvelope<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessEnvelope<T>> {
    const req = context.switchToHttp().getRequest<any>();
    const requestId = req.id || req.raw?.id;

    return next.handle().pipe(
      map((data) => {
        const envelope: SuccessEnvelope<T> = {
          success: true,
          data,
          timestamp: new Date().toISOString(),
          path: req.url,
        };

        if (requestId) {
          envelope.meta = { requestId: String(requestId) };
        }

        return envelope;
      }),
    );
  }
}

