import { TokenExpiredError, JsonWebTokenError, verify } from 'jsonwebtoken';

export type JwtValidatorPayload = {
  sub: string;
  email?: string;
  type: 'user_access' | 'integration_access';
  roles?: string[];
  perms?: string[];
  clientId?: string;
  scopes?: string[];
  iat?: number;
  exp?: number;
  [key: string]: unknown;
};

export type JwtTokenType = JwtValidatorPayload['type'];
export type JwtValidationErrorCode = 'AUTH_TOKEN_INVALID' | 'AUTH_TOKEN_EXPIRED';

export class JwtValidationError extends Error {
  constructor(public readonly code: JwtValidationErrorCode, message: string) {
    super(message);
    this.name = 'JwtValidationError';
  }
}

function isJwtPayload(value: unknown): value is JwtValidatorPayload {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>).sub === 'string' &&
    typeof (value as Record<string, unknown>).type === 'string'
  );
}

function buildInvalidTokenError(message = 'Invalid or malformed token') {
  return new JwtValidationError('AUTH_TOKEN_INVALID', message);
}

function buildExpiredTokenError(message = 'Token has expired') {
  return new JwtValidationError('AUTH_TOKEN_EXPIRED', message);
}

/**
 * Validates a JWT and returns the decoded payload.
 *
 * @param token JWT string
 * @param secret HS256 secret
 * @param expectedType Optional expected token type (`user_access` or `integration_access`)
 */
export function validateJwtToken(
  token: string,
  secret: string,
  expectedType?: JwtTokenType,
): JwtValidatorPayload {
  let decoded: unknown;

  try {
    decoded = verify(token, secret, {
      algorithms: ['HS256'],
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw buildExpiredTokenError(error.message);
    }

    if (error instanceof JsonWebTokenError) {
      throw buildInvalidTokenError(error.message);
    }

    throw buildInvalidTokenError('Token verification failed');
  }

  if (!isJwtPayload(decoded)) {
    throw buildInvalidTokenError('Token payload is not a valid JWT object');
  }

  if (expectedType && decoded.type !== expectedType) {
    throw buildInvalidTokenError(
      `Invalid token type: expected ${expectedType}, got ${decoded.type}`,
    );
  }

  return {
    ...decoded,
    roles: Array.isArray(decoded.roles) ? decoded.roles.filter((item) => typeof item === 'string') : [],
    perms: Array.isArray(decoded.perms) ? decoded.perms.filter((item) => typeof item === 'string') : [],
    scopes: Array.isArray(decoded.scopes) ? decoded.scopes.filter((item) => typeof item === 'string') : [],
  };
}

export function validateUserToken(token: string, secret: string): JwtValidatorPayload {
  return validateJwtToken(token, secret, 'user_access');
}

export function validateM2MToken(token: string, secret: string): JwtValidatorPayload {
  return validateJwtToken(token, secret, 'integration_access');
}

export function hasPermission(
  payload: JwtValidatorPayload,
  requiredPermission: string,
): boolean {
  return Array.isArray(payload.perms) && payload.perms.includes(requiredPermission);
}

export function hasScope(
  payload: JwtValidatorPayload,
  requiredScope: string,
): boolean {
  return Array.isArray(payload.scopes) && payload.scopes.includes(requiredScope);
}
