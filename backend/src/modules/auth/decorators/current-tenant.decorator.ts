import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { TenantAwareRequest } from '../guards/tenant.guard';

export const CurrentTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<TenantAwareRequest>();
    if (!request.tenantId) {
      throw new Error('TenantGuard must run before @CurrentTenant()');
    }
    return request.tenantId;
  },
);
