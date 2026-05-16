"use strict";
// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { map, Observable } from 'rxjs';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseEnvelopeInterceptor = void 0;
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
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let ResponseEnvelopeInterceptor = class ResponseEnvelopeInterceptor {
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const requestId = req.id || req.raw?.id;
        return next.handle().pipe((0, rxjs_1.map)((data) => ({
            success: true,
            data,
            timestamp: new Date().toISOString(),
            path: req.url,
            ...(requestId ? { meta: { requestId: String(requestId) } } : {}),
        })));
    }
};
exports.ResponseEnvelopeInterceptor = ResponseEnvelopeInterceptor;
exports.ResponseEnvelopeInterceptor = ResponseEnvelopeInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseEnvelopeInterceptor);
//# sourceMappingURL=response-envelope.interceptor.js.map