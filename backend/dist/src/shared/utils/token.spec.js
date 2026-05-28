"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const jsonwebtoken_1 = require("jsonwebtoken");
const token_1 = require("./token");
const secret = 'test-secret';
(0, vitest_1.describe)('token utils', () => {
    (0, vitest_1.it)('validates a user_access token successfully', () => {
        const token = (0, jsonwebtoken_1.sign)({
            sub: 'user-123',
            type: 'user_access',
            email: 'user@example.com',
            roles: ['admin'],
            perms: ['orders:read', 'orders:write'],
        }, secret, { algorithm: 'HS256', expiresIn: '1h' });
        const payload = (0, token_1.validateUserToken)(token, secret);
        (0, vitest_1.expect)(payload.sub).toBe('user-123');
        (0, vitest_1.expect)(payload.type).toBe('user_access');
        (0, vitest_1.expect)(payload.email).toBe('user@example.com');
        (0, vitest_1.expect)(payload.perms).toContain('orders:read');
    });
    (0, vitest_1.it)('validates an integration_access token successfully', () => {
        const token = (0, jsonwebtoken_1.sign)({
            sub: 'app-123',
            type: 'integration_access',
            clientId: 'app_orders_service',
            scopes: ['orders.read', 'orders.write'],
        }, secret, { algorithm: 'HS256', expiresIn: '1h' });
        const payload = (0, token_1.validateM2MToken)(token, secret);
        (0, vitest_1.expect)(payload.sub).toBe('app-123');
        (0, vitest_1.expect)(payload.type).toBe('integration_access');
        (0, vitest_1.expect)(payload.clientId).toBe('app_orders_service');
        (0, vitest_1.expect)(payload.scopes).toContain('orders.read');
    });
    (0, vitest_1.it)('throws AUTH_TOKEN_INVALID for a token with the wrong expected type', () => {
        const token = (0, jsonwebtoken_1.sign)({
            sub: 'app-123',
            type: 'integration_access',
            clientId: 'app_orders_service',
            scopes: ['orders.read'],
        }, secret, { algorithm: 'HS256', expiresIn: '1h' });
        (0, vitest_1.expect)(() => (0, token_1.validateUserToken)(token, secret)).toThrow(token_1.JwtValidationError);
        (0, vitest_1.expect)(() => (0, token_1.validateUserToken)(token, secret)).toThrow(/Invalid token type/);
    });
    (0, vitest_1.it)('throws AUTH_TOKEN_EXPIRED for an expired token', () => {
        const token = (0, jsonwebtoken_1.sign)({
            sub: 'user-123',
            type: 'user_access',
            perms: ['orders:read'],
        }, secret, { algorithm: 'HS256', expiresIn: '-1s' });
        (0, vitest_1.expect)(() => (0, token_1.validateUserToken)(token, secret)).toThrow(token_1.JwtValidationError);
        (0, vitest_1.expect)(() => (0, token_1.validateUserToken)(token, secret)).toThrow(/expired/);
    });
    (0, vitest_1.it)('throws AUTH_TOKEN_INVALID for a token signed with a wrong secret', () => {
        const token = (0, jsonwebtoken_1.sign)({
            sub: 'user-123',
            type: 'user_access',
            perms: ['orders:read'],
        }, 'wrong-secret', { algorithm: 'HS256', expiresIn: '1h' });
        (0, vitest_1.expect)(() => (0, token_1.validateUserToken)(token, secret)).toThrow(token_1.JwtValidationError);
        (0, vitest_1.expect)(() => (0, token_1.validateUserToken)(token, secret)).toThrow(/invalid/i);
    });
    (0, vitest_1.it)('checks permission presence correctly', () => {
        const payload = {
            sub: 'user-123',
            type: 'user_access',
            perms: ['orders:read', 'orders:write'],
        };
        (0, vitest_1.expect)((0, token_1.hasPermission)(payload, 'orders:read')).toBe(true);
        (0, vitest_1.expect)((0, token_1.hasPermission)(payload, 'users:read')).toBe(false);
    });
    (0, vitest_1.it)('checks scope presence correctly', () => {
        const payload = {
            sub: 'app-123',
            type: 'integration_access',
            scopes: ['orders.read', 'orders.write'],
        };
        (0, vitest_1.expect)((0, token_1.hasScope)(payload, 'orders.read')).toBe(true);
        (0, vitest_1.expect)((0, token_1.hasScope)(payload, 'inventory.write')).toBe(false);
    });
});
//# sourceMappingURL=token.spec.js.map