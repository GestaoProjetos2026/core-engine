import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

type ErrorEnvelope = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
  path: string;
  meta?: {
    requestId: string;
  };
};


const STATUS_ERROR_CODE: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'VALIDATION_ERROR',
  // Default 401 fallback for routes protected by token.
  // Auth endpoints should override with AUTH_INVALID_CREDENTIALS when applicable.
  [HttpStatus.UNAUTHORIZED]: 'AUTH_TOKEN_INVALID',
  [HttpStatus.FORBIDDEN]: 'AUTHZ_FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'RESOURCE_NOT_FOUND',
  [HttpStatus.CONFLICT]: 'RESOURCE_CONFLICT',
  [HttpStatus.TOO_MANY_REQUESTS]: 'RATE_LIMIT_EXCEEDED',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_ERROR',
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<any>();
    const req = ctx.getRequest<any>();


    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const requestId = req.id || req.raw?.id;
    const responseBody = this.createErrorBody(exception, status, req.url);

    if (requestId) {
      responseBody.meta = { requestId };
    }

    res.status(status).send(responseBody);
  }


  private createErrorBody(
    exception: unknown,
    status: number,
    path: string,
  ): ErrorEnvelope {
    const defaultCode = STATUS_ERROR_CODE[status] ?? 'INTERNAL_ERROR';
    const isProd = process.env.NODE_ENV === 'production';

    if (!(exception instanceof HttpException)) {
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
    const payload =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as Record<string, unknown>);

    const details =
      status === HttpStatus.BAD_REQUEST && !isProd
        ? (payload.message ?? payload)
        : undefined;
    const customErrorCode =
      typeof payload.errorCode === 'string'
        ? payload.errorCode
        : typeof payload.code === 'string'
          ? payload.code
          : undefined;

    return {
      success: false,
      error: {
        code: customErrorCode ?? defaultCode,
        message:
          typeof payload.message === 'string'
            ? payload.message
            : exception.message,
        ...(details ? { details } : {}),
      },
      timestamp: new Date().toISOString(),
      path,
    };
  }
}

