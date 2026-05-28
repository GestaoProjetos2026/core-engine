import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

/**
 * Restricts routes to JWT `integration_access` only (rejects human user tokens).
 */
@Injectable()
export class IntegrationTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToHttp().getRequest().user;

    if (!user || user.type !== 'integration_access') {
      throw new ForbiddenException({
        message: 'Integration access token required',
        errorCode: 'AUTHZ_FORBIDDEN',
      });
    }

    return true;
  }
}
