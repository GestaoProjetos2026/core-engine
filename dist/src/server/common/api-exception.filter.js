"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const STATUS_ERROR_CODE = {
    [common_1.HttpStatus.BAD_REQUEST]: 'VALIDATION_ERROR',
    // Default 401 fallback for routes protected by token.
    // Auth endpoints should override with AUTH_INVALID_CREDENTIALS when applicable.
    [common_1.HttpStatus.UNAUTHORIZED]: 'AUTH_TOKEN_INVALID',
    [common_1.HttpStatus.FORBIDDEN]: 'AUTHZ_FORBIDDEN',
    [common_1.HttpStatus.NOT_FOUND]: 'RESOURCE_NOT_FOUND',
    [common_1.HttpStatus.CONFLICT]: 'RESOURCE_CONFLICT',
    [common_1.HttpStatus.TOO_MANY_REQUESTS]: 'RATE_LIMIT_EXCEEDED',
    [common_1.HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_ERROR',
};
let ApiExceptionFilter = class ApiExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        if (!(exception instanceof common_1.HttpException) &&
            process.env.NODE_ENV !== 'production') {
            // Helps diagnose 500s during local HTTP tests (Postman/curl).
            console.error('[ApiExceptionFilter] unhandled:', exception);
        }
        const responseBody = this.createErrorBody(exception, status, req.url);
        res.status(status).send(responseBody);
    }
    createErrorBody(exception, status, path) {
        const defaultCode = STATUS_ERROR_CODE[status] ?? 'INTERNAL_ERROR';
        const isProd = process.env.NODE_ENV === 'production';
        if (!(exception instanceof common_1.HttpException)) {
            return {
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: isProd ? 'Unexpected internal error' : 'Unhandled exception',
                },
                timestamp: new Date().toISOString(),
                path,
            };
        }
        const exceptionResponse = exception.getResponse();
        const payload = typeof exceptionResponse === 'string'
            ? { message: exceptionResponse }
            : exceptionResponse;
        const details = status === common_1.HttpStatus.BAD_REQUEST && !isProd
            ? (payload.message ?? payload)
            : undefined;
        const customErrorCode = typeof payload.errorCode === 'string'
            ? payload.errorCode
            : typeof payload.code === 'string'
                ? payload.code
                : undefined;
        return {
            success: false,
            error: {
                code: customErrorCode ?? defaultCode,
                message: typeof payload.message === 'string'
                    ? payload.message
                    : exception.message,
                ...(details ? { details } : {}),
            },
            timestamp: new Date().toISOString(),
            path,
        };
    }
};
exports.ApiExceptionFilter = ApiExceptionFilter;
exports.ApiExceptionFilter = ApiExceptionFilter = __decorate([
    (0, common_1.Catch)()
], ApiExceptionFilter);
//# sourceMappingURL=api-exception.filter.js.map