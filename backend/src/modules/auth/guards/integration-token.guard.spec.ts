import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { IntegrationTokenGuard } from './integration-token.guard';

function mockContext(user: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as ExecutionContext;
}

describe('IntegrationTokenGuard', () => {
  const guard = new IntegrationTokenGuard();

  it('allows integration_access tokens', () => {
    expect(
      guard.canActivate(
        mockContext({ type: 'integration_access', scopes: ['identity:read'] }),
      ),
    ).toBe(true);
  });

  it('rejects human user_access tokens', () => {
    expect(() =>
      guard.canActivate(mockContext({ type: 'user_access', perms: ['users:read'] })),
    ).toThrow(ForbiddenException);
  });
});
