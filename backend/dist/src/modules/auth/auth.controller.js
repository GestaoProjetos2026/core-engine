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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_response_dto_1 = require("./dto/auth-response.dto");
const login_dto_1 = require("./dto/login.dto");
const refresh_dto_1 = require("./dto/refresh.dto");
const register_dto_1 = require("./dto/register.dto");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const rate_limit_guard_1 = require("../../server/common/rate-limit/rate-limit.guard");
const login_status_interceptor_1 = require("../../server/common/rate-limit/login-status.interceptor");
let AuthController = class AuthController {
    auth;
    constructor(auth) {
        this.auth = auth;
    }
    async register(dto) {
        return this.auth.register(dto);
    }
    async login(dto) {
        return this.auth.login(dto);
    }
    async refresh(dto) {
        return this.auth.refresh(dto);
    }
    getMe(req) {
        const user = req.user;
        if (user?.type !== 'user_access') {
            throw new common_1.UnauthorizedException({
                message: 'Endpoint restricted to user access tokens',
                errorCode: 'AUTH_TOKEN_INVALID',
            });
        }
        return {
            userId: user.userId,
            tenantId: user.tenantId,
            email: user.email,
            roles: user.roles,
            perms: user.perms,
            type: user.type,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({
        summary: 'Register a user',
        description: 'Creates an account with e-mail, name and password (RF01, RNF08).',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User created',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Password policy or validation failed (RNF08)',
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'Duplicate e-mail (RN06)',
        schema: {
            example: {
                success: false,
                error: {
                    code: 'RESOURCE_CONFLICT',
                    message: 'Email already registered',
                },
                timestamp: '2026-04-08T12:00:00.000Z',
                path: '/v1/auth/register',
            },
        },
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'ana@empresa.com' },
                name: { type: 'string', example: 'Ana Silva' },
                password: { type: 'string', example: 'strongPassword123!' },
            },
            required: ['email', 'name', 'password'],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(rate_limit_guard_1.RateLimitGuard),
    (0, common_1.UseInterceptors)(login_status_interceptor_1.LoginStatusInterceptor),
    (0, swagger_1.ApiOperation)({
        summary: 'Login with e-mail and password',
        description: 'Returns access and refresh tokens (RF02, RF03). Subject to rate limiting and lockout (RNF07).',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tokens issued',
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Rate limit exceeded or account locked (RNF07)',
        schema: {
            example: {
                success: false,
                error: {
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: 'Too many attempts or account locked. Please try again later.',
                    details: {
                        retryAfter: 60,
                    },
                },
                timestamp: '2026-04-08T12:00:00.000Z',
                path: '/v1/auth/login',
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Invalid credentials or inactive user (RN01)',
        schema: {
            example: {
                success: false,
                error: {
                    code: 'AUTH_INVALID_CREDENTIALS',
                    message: 'Invalid email or password',
                },
                timestamp: '2026-04-08T12:00:00.000Z',
                path: '/v1/auth/login',
            },
        },
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'admin@example.com' },
                password: { type: 'string', example: 'AdminCore2026!' },
            },
            required: ['email', 'password'],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh access token',
        description: 'RF04 / RN03: issues a new access + refresh pair and invalidates the submitted refresh token. Reuse of an old refresh returns 401 AUTH_REFRESH_REUSED.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'New tokens issued',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Invalid or expired refresh (AUTH_REFRESH_INVALID), or reuse/revoked/concurrent race (AUTH_REFRESH_REUSED)',
        schema: {
            examples: {
                invalid: {
                    value: {
                        success: false,
                        error: {
                            code: 'AUTH_REFRESH_INVALID',
                            message: 'Invalid or expired refresh token',
                        },
                        timestamp: '2026-04-08T12:00:00.000Z',
                        path: '/v1/auth/refresh',
                    },
                },
                reused: {
                    value: {
                        success: false,
                        error: {
                            code: 'AUTH_REFRESH_REUSED',
                            message: 'Refresh token was already used or revoked',
                        },
                        timestamp: '2026-04-08T12:00:00.000Z',
                        path: '/v1/auth/refresh',
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                refreshToken: { type: 'string', example: 'eyJhbGci...' },
            },
            required: ['refreshToken'],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_dto_1.RefreshDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get current user profile',
        description: 'RF08: Returns user profile and effective roles/perms using a Bearer token.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Valid user profile',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Missing, invalid, or non-user token',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", auth_response_dto_1.UserProfileDto)
], AuthController.prototype, "getMe", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __param(0, (0, common_1.Inject)(auth_service_1.AuthService)),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map