import { CanActivate, ExecutionContext } from '@nestjs/common';
export type TenantAwareRequest = {
    user?: {
        type?: string;
        tenantId?: string;
    };
    headers: Record<string, string | string[] | undefined>;
    tenantId?: string;
};
export declare class TenantGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
    private readHeader;
}
//# sourceMappingURL=tenant.guard.d.ts.map