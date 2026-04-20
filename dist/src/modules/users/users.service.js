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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../server/prisma/prisma.service");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const passwordHash = await bcrypt.hash(createUserDto.password, 12);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: createUserDto.email,
                    name: createUserDto.name,
                    passwordHash,
                    status: 'ACTIVE',
                },
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { passwordHash: _, ...result } = user;
            return result;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new common_1.ConflictException({ code: 'RESOURCE_CONFLICT', message: 'E-mail duplicado' });
            }
            throw error;
        }
    }
    async findAll(query) {
        const { page = 1, limit = 10, email, status } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (email)
            where.email = { contains: email, mode: 'insensitive' };
        if (status)
            where.status = status;
        const [items, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            items,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Usuário não encontrado' });
        }
        return user;
    }
    async update(id, updateUserDto) {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: updateUserDto,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return user;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Usuário não encontrado' });
                }
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException({ code: 'RESOURCE_CONFLICT', message: 'E-mail duplicado' });
                }
            }
            throw error;
        }
    }
    async changeStatus(id, changeStatusDto) {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: { status: changeStatusDto.status },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return user;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new common_1.NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Usuário não encontrado' });
            }
            throw error;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map