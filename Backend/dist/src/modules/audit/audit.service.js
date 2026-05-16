"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
let AuditService = class AuditService {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    logLoginSuccess(userId, email) {
        this.logger.log({ userId, email, auditEvent: 'LOGIN_SUCCESS' }, `User login success: ${email}`);
    }
    logLoginFailure(email, reason) {
        this.logger.warn({ email, auditEvent: 'LOGIN_FAILURE', reason }, `User login failure: ${email} - ${reason}`);
    }
    logTokenRefresh(userId, oldTokenId, newTokenId) {
        this.logger.log({ userId, auditEvent: 'TOKEN_REFRESH', oldTokenId, newTokenId }, `Token refreshed for user ${userId}`);
    }
    logSecretRegenerated(applicationId, adminUserId) {
        this.logger.warn({ applicationId, auditEvent: 'SECRET_REGENERATED', adminUserId }, `Client secret regenerated for application ${applicationId}`);
    }
    logStatusChange(entityType, entityId, newStatus, adminUserId) {
        this.logger.log({ entityType, entityId, newStatus, auditEvent: 'STATUS_CHANGED', adminUserId }, `${entityType} status changed to ${newStatus} for ID ${entityId}`);
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(nestjs_pino_1.Logger)),
    __metadata("design:paramtypes", [nestjs_pino_1.Logger])
], AuditService);
//# sourceMappingURL=audit.service.js.map