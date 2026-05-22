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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../server/prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const auth_time_util_1 = require("./auth-time.util");
const password_policy_1 = require("./password-policy");
const userAuthInclude = {
    roles: {
        include: {
            role: {
                include: {
                    permissions: { include: { permission: true } },
                },
            },
        },
    },
};
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwt;
    audit;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwt, audit) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.audit = audit;
    }
    async register(dto) {
        try {
            (0, password_policy_1.assertStrongPassword)(dto.password);
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Invalid password';
            throw new common_1.BadRequestException({ message: msg });
        }
        const rounds = this.bcryptRounds();
        const passwordHash = await (0, bcrypt_1.hash)(dto.password, rounds);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    name: dto.name,
                    passwordHash,
                    status: client_1.UserStatus.ACTIVE,
                },
            });
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                status: user.status,
            };
        }
        catch (e) {
            if (this.isUniqueViolation(e)) {
                throw new common_1.ConflictException({
                    message: 'Email already registered',
                });
            }
            throw e;
        }
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: userAuthInclude,
        });
        const valid = user &&
            user.status === client_1.UserStatus.ACTIVE &&
            (await (0, bcrypt_1.compare)(dto.password, user.passwordHash));
        if (!valid) {
            if (user) {
                this.audit.logLoginFailure(dto.email, 'Invalid password');
            }
            else {
                this.audit.logLoginFailure(dto.email, 'User not found');
            }
            throw new common_1.UnauthorizedException({
                message: 'Invalid email or password',
                errorCode: 'AUTH_INVALID_CREDENTIALS',
            });
        }
        const accessToken = await this.signAccessToken(user);
        const refreshToken = await this.createRefreshToken(user.id);
        this.audit.logLoginSuccess(user.id, user.email);
        return {
            accessToken,
            refreshToken,
            tokenType: 'Bearer',
            expiresIn: this.accessExpiresSeconds(),
        };
    }
    /**
     * RF04 / RN03 — rotate refresh: old token invalidated; reuse → AUTH_REFRESH_REUSED.
     */
    async refresh(dto) {
        const tokenHash = (0, crypto_1.createHash)('sha256').update(dto.refreshToken).digest('hex');
        const result = await this.prisma.$transaction(async (tx) => {
            const existing = await tx.refreshToken.findUnique({
                where: { tokenHash },
                include: {
                    user: { include: userAuthInclude },
                },
            });
            if (!existing) {
                this.throwRefreshInvalid();
            }
            if (existing.revokedAt !== null) {
                this.logger.warn(`AUTH_REFRESH_REUSED: reuse attempt refreshTokenId=${existing.id}`);
                this.throwRefreshReused();
            }
            if (existing.expiresAt <= new Date()) {
                this.throwRefreshInvalid();
            }
            if (existing.user.status !== client_1.UserStatus.ACTIVE) {
                this.throwRefreshInvalid();
            }
            const { raw: newRefreshRaw, id: newId } = await this.insertRefreshTokenRow(existing.userId, tx);
            const rotated = await tx.refreshToken.updateMany({
                where: { id: existing.id, revokedAt: null },
                data: {
                    revokedAt: new Date(),
                    replacedById: newId,
                },
            });
            if (rotated.count === 0) {
                await tx.refreshToken.delete({ where: { id: newId } });
                this.logger.warn(`AUTH_REFRESH_REUSED: concurrent rotation lost for refreshTokenId=${existing.id}`);
                this.throwRefreshReused();
            }
            return { user: existing.user, refreshToken: newRefreshRaw };
        });
        const accessToken = await this.signAccessToken(result.user);
        this.audit.logTokenRefresh(result.user.id);
        return {
            accessToken,
            refreshToken: result.refreshToken,
            tokenType: 'Bearer',
            expiresIn: this.accessExpiresSeconds(),
        };
    }
    throwRefreshInvalid() {
        throw new common_1.UnauthorizedException({
            message: 'Invalid or expired refresh token',
            errorCode: 'AUTH_REFRESH_INVALID',
        });
    }
    throwRefreshReused() {
        throw new common_1.UnauthorizedException({
            message: 'Refresh token was already used or revoked',
            errorCode: 'AUTH_REFRESH_REUSED',
        });
    }
    async signAccessToken(user) {
        const payload = this.buildAccessPayload(user);
        return this.jwt.signAsync(payload);
    }
    buildAccessPayload(user) {
        const roles = user.roles.map((ur) => ur.role.name);
        const perms = new Set();
        for (const ur of user.roles) {
            for (const rp of ur.role.permissions) {
                perms.add(rp.permission.code);
            }
        }
        return {
            sub: user.id,
            email: user.email,
            type: 'user_access',
            roles,
            perms: [...perms],
        };
    }
    async createRefreshToken(userId) {
        const { raw } = await this.insertRefreshTokenRow(userId, this.prisma);
        return raw;
    }
    async insertRefreshTokenRow(userId, db) {
        const raw = (0, crypto_1.randomBytes)(48).toString('base64url');
        const tokenHash = (0, crypto_1.createHash)('sha256').update(raw).digest('hex');
        const expiresAt = (0, auth_time_util_1.parseDurationToDate)(process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d');
        const row = await db.refreshToken.create({
            data: {
                tokenHash,
                userId,
                expiresAt,
            },
        });
        return { raw, id: row.id };
    }
    accessExpiresSeconds() {
        return (0, auth_time_util_1.parseDurationToSeconds)(process.env.JWT_EXPIRES_IN ?? '15m', 900);
    }
    bcryptRounds() {
        const n = Number(process.env.BCRYPT_ROUNDS);
        return Number.isFinite(n) && n >= 12 ? n : 12;
    }
    isUniqueViolation(e) {
        return (typeof e === 'object' &&
            e !== null &&
            'code' in e &&
            e.code === 'P2002');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(jwt_1.JwtService)),
    __param(2, (0, common_1.Inject)(audit_service_1.AuditService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        audit_service_1.AuditService])
], AuthService);
//# sourceMappingURL=auth.service.js.map