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
const login_dto_1 = require("./dto/login.dto");
const refresh_dto_1 = require("./dto/refresh.dto");
const register_dto_1 = require("./dto/register.dto");
const auth_service_1 = require("./auth.service");
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
        description: 'User created (envelope wraps this object in `data`)',
        schema: {
            example: {
                id: '550e8400-e29b-41d4-a716-446655440000',
                email: 'user@company.com',
                name: 'User Name',
                status: 'ACTIVE',
            },
        },
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
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Login with e-mail and password',
        description: 'Returns access and refresh tokens (RF02, RF03). Failed login does not reveal whether the e-mail exists.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tokens issued (envelope wraps this object in `data`)',
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'opaque-refresh-token',
                tokenType: 'Bearer',
                expiresIn: 900,
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
        description: 'New tokens issued (envelope wraps this object in `data`)',
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'new-opaque-refresh-token',
                tokenType: 'Bearer',
                expiresIn: 900,
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'AUTH_REFRESH_INVALID (invalid/expired/inactive) or AUTH_REFRESH_REUSED (revoked or concurrent rotation). Example payload shape matches other 401 errors.',
        schema: {
            example: {
                success: false,
                error: {
                    code: 'AUTH_REFRESH_REUSED',
                    message: 'Refresh token was already used or revoked',
                },
                timestamp: '2026-04-08T12:00:00.000Z',
                path: '/v1/auth/refresh',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_dto_1.RefreshDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __param(0, (0, common_1.Inject)(auth_service_1.AuthService)),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map