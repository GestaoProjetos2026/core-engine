import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SCOPES_KEY } from '../decorators/require-scopes.decorator';

@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(@Inject(Reflector) private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredScopes = this.reflector.getAllAndOverride<string[]>(SCOPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no scopes are required by the decorator, allow access
    if (!requiredScopes || requiredScopes.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Ensure user context exists (populated by JwtAuthGuard)
    if (!user) {
      throw new ForbiddenException({
        message: 'Missing authentication context',
        errorCode: 'AUTHZ_FORBIDDEN',
      });
    }

    // If it's a human user token, we skip scope validation (handled by RBAC/PermissionsGuard)
    if (user.type === 'user_access') {
      return true;
    }

    // If it's an integration token, we MUST validate scopes
    if (user.type === 'integration_access') {
      const hasAllScopes = requiredScopes.every((scope) =>
        user.scopes?.includes(scope),
      );

      if (!hasAllScopes) {
        throw new ForbiddenException({
          message: `Insufficient scopes. Required: ${requiredScopes.join(', ')}`,
          errorCode: 'AUTHZ_FORBIDDEN',
        });
      }

      return true;
    }

    // Fail for any other unknown token type
    throw new ForbiddenException({
      message: 'Invalid token type for scope authorization',
      errorCode: 'AUTHZ_FORBIDDEN',
    });
  }
}
