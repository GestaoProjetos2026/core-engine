import { Strategy } from 'passport-jwt';
export type JwtPayload = {
    sub: string;
    email?: string;
    type: 'user_access' | 'integration_access';
    roles?: string[];
    perms?: string[];
    clientId?: string;
    scopes?: string[];
};
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: JwtPayload): Promise<{
        userId: string;
        email: string | undefined;
        roles: string[];
        perms: string[];
        type: "user_access" | "integration_access";
        clientId: string | undefined;
        scopes: string[];
    }>;
}
export {};
//# sourceMappingURL=jwt.strategy.d.ts.map