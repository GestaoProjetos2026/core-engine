import { UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  const authServiceMock = {
    register: vi.fn(),
    login: vi.fn(),
    refresh: vi.fn(),
  } as unknown as AuthService;

  const controller = new AuthController(authServiceMock);

  describe('getMe', () => {
    it('returns user profile for valid user_access token', () => {
      const req = {
        user: {
          userId: 'u1',
          email: 'test@b.com',
          roles: ['admin'],
          perms: ['user:read'],
          type: 'user_access',
        },
      };

      const result = controller.getMe(req);

      expect(result).toEqual({
        userId: 'u1',
        email: 'test@b.com',
        roles: ['admin'],
        perms: ['user:read'],
        type: 'user_access',
      });
    });

    it('throws UnauthorizedException for non user_access token', () => {
      const req = {
        user: {
          clientId: 'app1',
          scopes: ['orders.read'],
          type: 'integration_access',
        },
      };

      expect(() => controller.getMe(req)).toThrowError(UnauthorizedException);
      expect(() => controller.getMe(req)).toThrowError('Endpoint restricted to user access tokens');
    });

    it('throws UnauthorizedException if no user in req', () => {
      const req = {};

      expect(() => controller.getMe(req)).toThrowError(UnauthorizedException);
    });
  });
});
