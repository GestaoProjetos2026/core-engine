import { Logger } from 'nestjs-pino';
export type EntityType = 'USER' | 'APPLICATION';
export declare class AuditService {
    private readonly logger;
    constructor(logger: Logger);
    logLoginSuccess(userId: string, email: string): void;
    logLoginFailure(email: string, reason: string): void;
    logTokenRefresh(userId: string, oldTokenId?: string, newTokenId?: string): void;
    logSecretRegenerated(applicationId: string, adminUserId?: string): void;
    logStatusChange(entityType: EntityType, entityId: string, newStatus: string, adminUserId?: string): void;
}
//# sourceMappingURL=audit.service.d.ts.map