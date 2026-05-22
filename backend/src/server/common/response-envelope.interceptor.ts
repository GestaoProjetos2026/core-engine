// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { map, Observable } from 'rxjs';

// type SuccessEnvelope<T> = {
//   success: true;
//   data: T;
//   timestamp: string;
//   path: string;
//   meta?: {
//     requestId: string;
//   };
// };


// @Injectable()
// export class ResponseEnvelopeInterceptor<T>
//   implements NestInterceptor<T, SuccessEnvelope<T>>
// {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler<T>,
//   ): Observable<SuccessEnvelope<T>> {
//     const req = context.switchToHttp().getRequest<any>();
//     const requestId = req.id || req.raw?.id;

//     return next.handle().pipe(
//       map((data) => ({
//         success: true,
//         data,
//         timestamp: new Date().toISOString(),
//         path: req.url,
//         meta: requestId ? { requestId } : undefined,
//       })),
//     );

//   }
// }

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
  implements NestInterceptor<T, SuccessEnvelope<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SuccessEnvelope<T>> {
    const req = context.switchToHttp().getRequest<any>();
    const requestId = req.id || req.raw?.id;

    return next.handle().pipe(
      map((data) => ({
        success: true as const,
        data,
        timestamp: new Date().toISOString(),
        path: req.url,
        ...(requestId ? { meta: { requestId: String(requestId) } } : {}),
      })),
    );
  }
}