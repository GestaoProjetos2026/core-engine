"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtValidationError = void 0;
exports.validateJwtToken = validateJwtToken;
exports.validateUserToken = validateUserToken;
exports.validateM2MToken = validateM2MToken;
exports.hasPermission = hasPermission;
exports.hasScope = hasScope;
const jsonwebtoken_1 = require("jsonwebtoken");
class JwtValidationError extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.code = code;
        this.name = 'JwtValidationError';
    }
}
exports.JwtValidationError = JwtValidationError;
function isJwtPayload(value) {
    return (typeof value === 'object' &&
        value !== null &&
        typeof value.sub === 'string' &&
        typeof value.type === 'string');
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
function validateJwtToken(token, secret, expectedType) {
    let decoded;
    try {
        decoded = (0, jsonwebtoken_1.verify)(token, secret, {
            algorithms: ['HS256'],
        });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            throw buildExpiredTokenError(error.message);
        }
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            throw buildInvalidTokenError(error.message);
        }
        throw buildInvalidTokenError('Token verification failed');
    }
    if (!isJwtPayload(decoded)) {
        throw buildInvalidTokenError('Token payload is not a valid JWT object');
    }
    if (expectedType && decoded.type !== expectedType) {
        throw buildInvalidTokenError(`Invalid token type: expected ${expectedType}, got ${decoded.type}`);
    }
    return {
        ...decoded,
        roles: Array.isArray(decoded.roles) ? decoded.roles.filter((item) => typeof item === 'string') : [],
        perms: Array.isArray(decoded.perms) ? decoded.perms.filter((item) => typeof item === 'string') : [],
        scopes: Array.isArray(decoded.scopes) ? decoded.scopes.filter((item) => typeof item === 'string') : [],
    };
}
function validateUserToken(token, secret) {
    return validateJwtToken(token, secret, 'user_access');
}
function validateM2MToken(token, secret) {
    return validateJwtToken(token, secret, 'integration_access');
}
function hasPermission(payload, requiredPermission) {
    return Array.isArray(payload.perms) && payload.perms.includes(requiredPermission);
}
function hasScope(payload, requiredScope) {
    return Array.isArray(payload.scopes) && payload.scopes.includes(requiredScope);
}
//# sourceMappingURL=token.js.map