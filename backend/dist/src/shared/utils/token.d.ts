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
export declare class JwtValidationError extends Error {
    readonly code: JwtValidationErrorCode;
    constructor(code: JwtValidationErrorCode, message: string);
}
/**
 * Validates a JWT and returns the decoded payload.
 *
 * @param token JWT string
 * @param secret HS256 secret
 * @param expectedType Optional expected token type (`user_access` or `integration_access`)
 */
export declare function validateJwtToken(token: string, secret: string, expectedType?: JwtTokenType): JwtValidatorPayload;
export declare function validateUserToken(token: string, secret: string): JwtValidatorPayload;
export declare function validateM2MToken(token: string, secret: string): JwtValidatorPayload;
export declare function hasPermission(payload: JwtValidatorPayload, requiredPermission: string): boolean;
export declare function hasScope(payload: JwtValidatorPayload, requiredScope: string): boolean;
//# sourceMappingURL=token.d.ts.map