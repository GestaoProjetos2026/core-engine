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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../server/prisma/prisma.service");
const client_1 = require("@prisma/client");
let RolesService = class RolesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createRoleDto) {
        try {
            return await this.prisma.role.create({
                data: {
                    name: createRoleDto.name,
                },
                select: {
                    id: true,
                    name: true,
                },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new common_1.ConflictException({
                    code: 'RESOURCE_CONFLICT',
                    message: 'Role name already exists (RN06)',
                });
            }
            throw error;
        }
    }
    async findAll() {
        try {
            return await this.prisma.role.findMany({
                select: {
                    id: true,
                    name: true,
                    permissions: {
                        select: {
                            permission: {
                                select: {
                                    id: true,
                                    code: true,
                                    description: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            users: true,
                            permissions: true,
                        },
                    },
                },
                orderBy: { name: 'asc' },
            });
        }
        catch (error) {
            console.error('[RolesService.findAll] Database error:', error);
            throw error;
        }
    }
    async assignUsers(roleId, dto) {
        const role = await this.prisma.role.findUnique({ where: { id: roleId } });
        if (!role) {
            throw new common_1.NotFoundException({
                code: 'RESOURCE_NOT_FOUND',
                message: `Role with ID ${roleId} not found`,
            });
        }
        try {
            const data = dto.userIds.map((userId) => ({
                roleId,
                userId,
            }));
            return await this.prisma.userRole.createMany({
                data,
                skipDuplicates: true,
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
                throw new common_1.NotFoundException({
                    code: 'RESOURCE_NOT_FOUND',
                    message: 'One or more users do not exist (RN07)',
                });
            }
            throw error;
        }
    }
    async assignPermissions(roleId, dto) {
        const role = await this.prisma.role.findUnique({ where: { id: roleId } });
        if (!role) {
            throw new common_1.NotFoundException({
                code: 'RESOURCE_NOT_FOUND',
                message: `Role with ID ${roleId} not found`,
            });
        }
        try {
            const data = dto.permissionIds.map((permissionId) => ({
                roleId,
                permissionId,
            }));
            return await this.prisma.rolePermission.createMany({
                data,
                skipDuplicates: true,
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
                throw new common_1.NotFoundException({
                    code: 'RESOURCE_NOT_FOUND',
                    message: 'One or more permissions do not exist (RN07)',
                });
            }
            throw error;
        }
    }
    async removeUser(roleId, userId) {
        try {
            await this.prisma.userRole.delete({
                where: {
                    userId_roleId: {
                        userId,
                        roleId,
                    },
                },
            });
            return { success: true };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new common_1.NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'User-Role link not found' });
            }
            throw error;
        }
    }
    async removePermission(roleId, permissionId) {
        try {
            await this.prisma.rolePermission.delete({
                where: {
                    roleId_permissionId: {
                        roleId,
                        permissionId,
                    },
                },
            });
            return { success: true };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new common_1.NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Role-Permission link not found' });
            }
            throw error;
        }
    }
    async delete(id) {
        try {
            await this.prisma.role.delete({ where: { id } });
            return { success: true };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new common_1.NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Role not found' });
            }
            throw error;
        }
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolesService);
//# sourceMappingURL=roles.service.js.map