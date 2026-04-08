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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../server/prisma/prisma.service");
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
let AuthService = class AuthService {
    prisma;
    jwt;
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
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
            throw new common_1.UnauthorizedException({
                message: 'Invalid email or password',
                errorCode: 'AUTH_INVALID_CREDENTIALS',
            });
        }
        const accessToken = await this.signAccessToken(user);
        const refreshToken = await this.createRefreshToken(user.id);
        return {
            accessToken,
            refreshToken,
            tokenType: 'Bearer',
            expiresIn: this.accessExpiresSeconds(),
        };
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
        const raw = (0, crypto_1.randomBytes)(48).toString('base64url');
        const tokenHash = (0, crypto_1.createHash)('sha256').update(raw).digest('hex');
        const expiresAt = (0, auth_time_util_1.parseDurationToDate)(process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d');
        await this.prisma.refreshToken.create({
            data: {
                tokenHash,
                userId,
                expiresAt,
            },
        });
        return raw;
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
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map