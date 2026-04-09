import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from './permissions.guard';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new PermissionsGuard(reflector);
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

  it('should return true if no permissions are required', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = createMockContext();
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should return true if required permissions array is empty', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);
    const context = createMockContext();
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException if user is not present', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user:write']);
    const context = createMockContext(undefined);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(context)).toThrowError('Insufficient permissions');
  });

  it('should throw ForbiddenException if user has no perms array', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user:write']);
    const context = createMockContext({ id: '123' });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if user perms do not match requested permissions', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user:write']);
    const context = createMockContext({ perms: ['user:read'] });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should return true if user has at least one of the required permissions', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user:write', 'admin:all']);
    const context = createMockContext({ perms: ['user:read', 'user:write'] });
    expect(guard.canActivate(context)).toBe(true);
  });
});
