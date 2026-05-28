import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { X_TENANT_ID_HEADER } from '../../../shared/constants/tenant-headers';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type TenantAwareRequest = {
  user?: {
    type?: string;
    tenantId?: string;
  };
  headers: Record<string, string | string[] | undefined>;
  tenantId?: string;
};

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<TenantAwareRequest>();
    const headerValue = this.readHeader(request.headers[X_TENANT_ID_HEADER]);

    if (headerValue && !UUID_RE.test(headerValue)) {
      throw new BadRequestException({
        message: 'X-Tenant-Id must be a valid UUID',
        errorCode: 'TENANT_HEADER_INVALID',
      });
    }

    const user = request.user;

    if (user?.type === 'user_access') {
      const tokenTenantId = user.tenantId;
      if (!tokenTenantId) {
        throw new ForbiddenException({
          message: 'Access token is missing tenant_id claim',
          errorCode: 'TENANT_CONTEXT_REQUIRED',
        });
      }
      if (headerValue && headerValue !== tokenTenantId) {
        throw new ForbiddenException({
          message: 'X-Tenant-Id does not match tenant_id in access token',
          errorCode: 'TENANT_MISMATCH',
        });
      }
      request.tenantId = headerValue ?? tokenTenantId;
      return true;
    }

    if (user?.type === 'integration_access') {
      if (!headerValue) {
        throw new BadRequestException({
          message: 'X-Tenant-Id header is required for this endpoint',
          errorCode: 'TENANT_HEADER_REQUIRED',
        });
      }
      request.tenantId = headerValue;
      return true;
    }

    return true;
  }

  private readHeader(value: string | string[] | undefined): string | undefined {
    if (value === undefined) return undefined;
    const raw = Array.isArray(value) ? value[0] : value;
    const trimmed = raw?.trim();
    return trimmed || undefined;
  }
}
