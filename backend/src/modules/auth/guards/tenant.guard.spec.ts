import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { TenantGuard } from './tenant.guard';
import { DEFAULT_TENANT_ID } from '../../../shared/constants/tenant';

function makeContext(
  user: Record<string, unknown> | undefined,
  headers: Record<string, string> = {},
) {
  const request: { user?: Record<string, unknown>; headers: Record<string, string>; tenantId?: string } = {
    headers,
    ...(user !== undefined ? { user } : {}),
  };
  return {
    switchToHttp: () => ({ getRequest: () => request }),
    request,
  };
}

describe('TenantGuard', () => {
  const guard = new TenantGuard();

  it('uses JWT tenant_id when X-Tenant-Id is omitted (user_access)', () => {
    const context = makeContext({
      type: 'user_access',
      tenantId: DEFAULT_TENANT_ID,
    });
    expect(guard.canActivate(context as never)).toBe(true);
    expect(context.request.tenantId).toBe(DEFAULT_TENANT_ID);
  });

  it('accepts matching X-Tenant-Id and JWT tenant_id', () => {
    const context = makeContext(
      { type: 'user_access', tenantId: DEFAULT_TENANT_ID },
      { 'x-tenant-id': DEFAULT_TENANT_ID },
    );
    expect(guard.canActivate(context as never)).toBe(true);
    expect(context.request.tenantId).toBe(DEFAULT_TENANT_ID);
  });

  it('rejects mismatched X-Tenant-Id (403 TENANT_MISMATCH)', () => {
    const context = makeContext(
      { type: 'user_access', tenantId: DEFAULT_TENANT_ID },
      { 'x-tenant-id': '00000000-0000-4000-8000-000000000099' },
    );
    let caught: unknown;
    try {
      guard.canActivate(context as never);
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(ForbiddenException);
    const body = (caught as ForbiddenException).getResponse() as { errorCode: string };
    expect(body.errorCode).toBe('TENANT_MISMATCH');
  });

  it('rejects user_access token without tenant_id claim', () => {
    const context = makeContext({ type: 'user_access' });
    expect(() => guard.canActivate(context as never)).toThrow(ForbiddenException);
  });

  it('requires X-Tenant-Id for integration_access (400 TENANT_HEADER_REQUIRED)', () => {
    const context = makeContext({ type: 'integration_access' });
    let caught: unknown;
    try {
      guard.canActivate(context as never);
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(BadRequestException);
    const body = (caught as BadRequestException).getResponse() as { errorCode: string };
    expect(body.errorCode).toBe('TENANT_HEADER_REQUIRED');
  });

  it('accepts X-Tenant-Id for integration_access', () => {
    const context = makeContext(
      { type: 'integration_access' },
      { 'x-tenant-id': DEFAULT_TENANT_ID },
    );
    expect(guard.canActivate(context as never)).toBe(true);
    expect(context.request.tenantId).toBe(DEFAULT_TENANT_ID);
  });

  it('rejects invalid UUID in header', () => {
    const context = makeContext(
      { type: 'user_access', tenantId: DEFAULT_TENANT_ID },
      { 'x-tenant-id': 'not-a-uuid' },
    );
    expect(() => guard.canActivate(context as never)).toThrow(BadRequestException);
  });
});
