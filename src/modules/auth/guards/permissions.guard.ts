import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.perms) {
      throw new ForbiddenException({
        message: 'Insufficient permissions',
        errorCode: 'AUTHZ_FORBIDDEN',
      });
    }

    const hasPermission = requiredPermissions.some((permission) =>
      user.perms.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException({
        message: 'Insufficient permissions',
        errorCode: 'AUTHZ_FORBIDDEN',
      });
    }

    return true;
  }
}
