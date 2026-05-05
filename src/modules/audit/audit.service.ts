import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

export type EntityType = 'USER' | 'APPLICATION';

@Injectable()
export class AuditService {
  constructor(private readonly logger: Logger) {}

  logLoginSuccess(userId: string, email: string): void {
    this.logger.log(
      { userId, email, auditEvent: 'LOGIN_SUCCESS' },
      `User login success: ${email}`,
    );
  }

  logLoginFailure(email: string, reason: string): void {
    this.logger.warn(
      { email, auditEvent: 'LOGIN_FAILURE', reason },
      `User login failure: ${email} - ${reason}`,
    );
  }

  logTokenRefresh(userId: string, oldTokenId?: string, newTokenId?: string): void {
    this.logger.log(
      { userId, auditEvent: 'TOKEN_REFRESH', oldTokenId, newTokenId },
      `Token refreshed for user ${userId}`,
    );
  }

  logSecretRegenerated(applicationId: string, adminUserId?: string): void {
    this.logger.warn(
      { applicationId, auditEvent: 'SECRET_REGENERATED', adminUserId },
      `Client secret regenerated for application ${applicationId}`,
    );
  }

  logStatusChange(
    entityType: EntityType,
    entityId: string,
    newStatus: string,
    adminUserId?: string,
  ): void {
    this.logger.log(
      { entityType, entityId, newStatus, auditEvent: 'STATUS_CHANGED', adminUserId },
      `${entityType} status changed to ${newStatus} for ID ${entityId}`,
    );
  }
}
