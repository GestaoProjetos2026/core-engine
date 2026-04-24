import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ScopesGuard } from './scopes.guard';
import { SCOPES_KEY } from '../decorators/require-scopes.decorator';

describe('ScopesGuard', () => {
  let guard: ScopesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new ScopesGuard(reflector);
  });

  const createMockContext = (user?: any) => {
    return {
      getHandler: vi.fn(),
      getClass: vi.fn(),
      switchToHttp: vi.fn().mockReturnValue({
        getRequest: vi.fn().mockReturnValue({
          user,
        }),
      }),
    } as unknown as ExecutionContext;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if no scopes are required', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = createMockContext();
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException if user context is missing and scopes are required', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['orders:read']);
    const context = createMockContext(undefined);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(context)).toThrowError('Missing authentication context');
  });

  it('should return true for human users (user_access)', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['orders:read']);
    const context = createMockContext({ type: 'user_access' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException for integration tokens with missing scopes', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['orders:read', 'orders:write']);
    const context = createMockContext({
      type: 'integration_access',
      scopes: ['orders:read'],
    });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(context)).toThrowError(/Insufficient scopes/);
  });

  it('should return true for integration tokens with all required scopes', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['orders:read', 'orders:write']);
    const context = createMockContext({
      type: 'integration_access',
      scopes: ['orders:read', 'orders:write', 'other:scope'],
    });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException for unknown token types', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['orders:read']);
    const context = createMockContext({ type: 'unknown_type' });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(context)).toThrowError('Invalid token type for scope authorization');
  });
});
