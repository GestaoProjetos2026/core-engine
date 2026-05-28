import { CanActivate, ExecutionContext } from '@nestjs/common';
/**
 * Restricts routes to JWT `integration_access` only (rejects human user tokens).
 */
export declare class IntegrationTokenGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
//# sourceMappingURL=integration-token.guard.d.ts.map