import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
type SuccessEnvelope<T> = {
    success: true;
    data: T;
    timestamp: string;
    path: string;
    meta?: {
        requestId: string;
    };
};
export declare class ResponseEnvelopeInterceptor<T> implements NestInterceptor<T, SuccessEnvelope<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<SuccessEnvelope<T>>;
}
export {};
//# sourceMappingURL=response-envelope.interceptor.d.ts.map