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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../server/prisma/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const audit_service_1 = require("../audit/audit.service");
let ApplicationsService = class ApplicationsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    generateClientCredentials() {
        const clientId = crypto.randomUUID().replace(/-/g, '');
        const clientSecret = crypto.randomBytes(32).toString('hex');
        return { clientId, clientSecret };
    }
    async create(createApplicationDto) {
        const { clientId, clientSecret } = this.generateClientCredentials();
        const clientSecretHash = await bcrypt.hash(clientSecret, 12);
        try {
            const application = await this.prisma.application.create({
                data: {
                    name: createApplicationDto.name,
                    clientId,
                    clientSecretHash,
                    status: 'ACTIVE',
                },
                select: {
                    id: true,
                    clientId: true,
                    name: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return { ...application, clientSecret };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new common_1.ConflictException({ code: 'RESOURCE_CONFLICT', message: 'Client ID duplicado' });
            }
            throw error;
        }
    }
    async findAll(query) {
        try {
            const page = Math.max(1, Number(query.page || 1));
            const limit = Math.max(1, Math.min(100, Number(query.limit || 10)));
            const skip = (page - 1) * limit;
            const { name, status } = query;
            const where = {};
            if (name && name.trim()) {
                where.name = { contains: name.trim(), mode: 'insensitive' };
            }
            if (status) {
                where.status = status;
            }
            const [items, total] = await Promise.all([
                this.prisma.application.findMany({
                    where,
                    skip,
                    take: limit,
                    select: {
                        id: true,
                        clientId: true,
                        name: true,
                        status: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                }),
                this.prisma.application.count({ where }),
            ]);
            return {
                items,
                total,
                page,
                limit,
            };
        }
        catch (error) {
            console.error('[ApplicationsService.findAll] Database error:', {
                message: error instanceof Error ? error.message : error,
                query,
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }
    async findOne(id) {
        try {
            const application = await this.prisma.application.findUnique({
                where: { id },
                select: {
                    id: true,
                    clientId: true,
                    name: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            if (!application) {
                throw new common_1.NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Aplicação não encontrada' });
            }
            return application;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            console.error('[ApplicationsService.findOne] Database error:', error);
            throw error;
        }
    }
    async update(id, updateApplicationDto) {
        try {
            const application = await this.prisma.application.update({
                where: { id },
                data: updateApplicationDto,
                select: {
                    id: true,
                    clientId: true,
                    name: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return application;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new common_1.NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Aplicação não encontrada' });
            }
            throw error;
        }
    }
    async changeStatus(id, changeStatusDto) {
        try {
            const application = await this.prisma.application.update({
                where: { id },
                data: { status: changeStatusDto.status },
                select: {
                    id: true,
                    clientId: true,
                    name: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            this.audit.logStatusChange('APPLICATION', id, changeStatusDto.status);
            return application;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new common_1.NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Aplicação não encontrada' });
            }
            throw error;
        }
    }
    async regenerateSecret(id) {
        const clientSecret = crypto.randomBytes(32).toString('hex');
        const clientSecretHash = await bcrypt.hash(clientSecret, 12);
        try {
            const application = await this.prisma.application.update({
                where: { id },
                data: { clientSecretHash },
                select: {
                    id: true,
                    clientId: true,
                    name: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            this.audit.logSecretRegenerated(id);
            return { ...application, clientSecret };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new common_1.NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Aplicação não encontrada' });
            }
            throw error;
        }
    }
    async getScopes(applicationId) {
        try {
            const application = await this.prisma.application.findUnique({
                where: { id: applicationId },
                include: {
                    scopes: {
                        include: {
                            scope: true,
                        },
                        orderBy: { scope: { code: 'asc' } }
                    },
                },
            });
            if (!application) {
                throw new common_1.NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Aplicação não encontrada' });
            }
            return application.scopes.map(as => as.scope);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            console.error('[ApplicationsService.getScopes] Database error:', error);
            throw error;
        }
    }
    async associateScopes(applicationId, associateScopesDto) {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
        });
        if (!application) {
            throw new common_1.NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Aplicação não encontrada' });
        }
        const scopes = await this.prisma.scope.findMany({
            where: { id: { in: associateScopesDto.scopeIds } },
        });
        if (scopes.length !== associateScopesDto.scopeIds.length) {
            throw new common_1.NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Um ou mais escopos fornecidos não existem' });
        }
        await this.prisma.$transaction([
            this.prisma.applicationScope.deleteMany({
                where: { applicationId },
            }),
            this.prisma.applicationScope.createMany({
                data: associateScopesDto.scopeIds.map(scopeId => ({
                    applicationId,
                    scopeId,
                })),
                skipDuplicates: true,
            }),
        ]);
        return this.getScopes(applicationId);
    }
    async validateCredentials(clientId, clientSecret) {
        const application = await this.prisma.application.findUnique({
            where: { clientId },
            include: {
                scopes: {
                    include: {
                        scope: true,
                    }
                }
            }
        });
        if (!application || application.status !== 'ACTIVE') {
            return null;
        }
        const isValid = await bcrypt.compare(clientSecret, application.clientSecretHash);
        if (!isValid) {
            return null;
        }
        return application;
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(audit_service_1.AuditService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map