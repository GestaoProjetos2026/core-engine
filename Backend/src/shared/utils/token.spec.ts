import { describe, expect, it } from 'vitest';
import { sign } from 'jsonwebtoken';
import {
  validateJwtToken,
  validateUserToken,
  validateM2MToken,
  hasPermission,
  hasScope,
  JwtValidationError,
  type JwtValidatorPayload,
} from './token';

const secret = 'test-secret';

describe('token utils', () => {
  it('validates a user_access token successfully', () => {
    const token = sign(
      {
        sub: 'user-123',
        type: 'user_access',
        email: 'user@example.com',
        roles: ['admin'],
        perms: ['orders:read', 'orders:write'],
      },
      secret,
      { algorithm: 'HS256', expiresIn: '1h' },
    );

    const payload = validateUserToken(token, secret);

    expect(payload.sub).toBe('user-123');
    expect(payload.type).toBe('user_access');
    expect(payload.email).toBe('user@example.com');
    expect(payload.perms).toContain('orders:read');
  });

  it('validates an integration_access token successfully', () => {
    const token = sign(
      {
        sub: 'app-123',
        type: 'integration_access',
        clientId: 'app_orders_service',
        scopes: ['orders.read', 'orders.write'],
      },
      secret,
      { algorithm: 'HS256', expiresIn: '1h' },
    );

    const payload = validateM2MToken(token, secret);

    expect(payload.sub).toBe('app-123');
    expect(payload.type).toBe('integration_access');
    expect(payload.clientId).toBe('app_orders_service');
    expect(payload.scopes).toContain('orders.read');
  });

  it('throws AUTH_TOKEN_INVALID for a token with the wrong expected type', () => {
    const token = sign(
      {
        sub: 'app-123',
        type: 'integration_access',
        clientId: 'app_orders_service',
        scopes: ['orders.read'],
      },
      secret,
      { algorithm: 'HS256', expiresIn: '1h' },
    );

    expect(() => validateUserToken(token, secret)).toThrow(JwtValidationError);
    expect(() => validateUserToken(token, secret)).toThrow(/Invalid token type/);
  });

  it('throws AUTH_TOKEN_EXPIRED for an expired token', () => {
    const token = sign(
      {
        sub: 'user-123',
        type: 'user_access',
        perms: ['orders:read'],
      },
      secret,
      { algorithm: 'HS256', expiresIn: '-1s' },
    );

    expect(() => validateUserToken(token, secret)).toThrow(JwtValidationError);
    expect(() => validateUserToken(token, secret)).toThrow(/expired/);
  });

  it('throws AUTH_TOKEN_INVALID for a token signed with a wrong secret', () => {
    const token = sign(
      {
        sub: 'user-123',
        type: 'user_access',
        perms: ['orders:read'],
      },
      'wrong-secret',
      { algorithm: 'HS256', expiresIn: '1h' },
    );

    expect(() => validateUserToken(token, secret)).toThrow(JwtValidationError);
    expect(() => validateUserToken(token, secret)).toThrow(/invalid/i);
  });

  it('checks permission presence correctly', () => {
    const payload: JwtValidatorPayload = {
      sub: 'user-123',
      type: 'user_access',
      perms: ['orders:read', 'orders:write'],
    };

    expect(hasPermission(payload, 'orders:read')).toBe(true);
    expect(hasPermission(payload, 'users:read')).toBe(false);
  });

  it('checks scope presence correctly', () => {
    const payload: JwtValidatorPayload = {
      sub: 'app-123',
      type: 'integration_access',
      scopes: ['orders.read', 'orders.write'],
    };

    expect(hasScope(payload, 'orders.read')).toBe(true);
    expect(hasScope(payload, 'inventory.write')).toBe(false);
  });
});
