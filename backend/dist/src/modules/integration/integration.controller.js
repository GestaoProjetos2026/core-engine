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
exports.IntegrationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const integration_service_1 = require("./integration.service");
const oauth_token_request_dto_1 = require("./dto/oauth-token-request.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const scopes_guard_1 = require("../auth/guards/scopes.guard");
const require_scopes_decorator_1 = require("../auth/decorators/require-scopes.decorator");
let IntegrationController = class IntegrationController {
    integrationService;
    constructor(integrationService) {
        this.integrationService = integrationService;
    }
    async oauthToken(dto) {
        return this.integrationService.issueToken(dto);
    }
    async integrationToken(dto) {
        // Force grant_type to client_credentials if using this endpoint
        const requestDto = { ...dto, grant_type: dto.grant_type || 'client_credentials' };
        return this.integrationService.issueToken(requestDto);
    }
    async testScope() {
        return { success: true, message: 'You have the required scope!' };
    }
};
exports.IntegrationController = IntegrationController;
__decorate([
    (0, common_1.Post)('oauth/token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'OAuth 2.0 token endpoint (RF21)',
        description: 'Issues tokens based on the provided grant type (client_credentials or refresh_token).',
    }),
    (0, swagger_1.ApiConsumes)('application/x-www-form-urlencoded', 'application/json'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                grant_type: {
                    type: 'string',
                    enum: ['client_credentials', 'refresh_token'],
                    example: 'client_credentials'
                },
                client_id: { type: 'string', example: 'app_123' },
                client_secret: { type: 'string', example: 'secret_abc' },
                scope: { type: 'string', example: 'read:all' },
                refresh_token: { type: 'string', example: 'refresh_xyz' },
            },
            required: ['grant_type'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token issued successfully',
        schema: {
            type: 'object',
            properties: {
                access_token: { type: 'string' },
                token_type: { type: 'string', example: 'Bearer' },
                expires_in: { type: 'number', example: 3600 },
                refresh_token: { type: 'string' },
                scope: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Missing or invalid parameters',
        schema: {
            type: 'object',
            example: {
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'grant_type should not be empty'
                },
                timestamp: '2026-03-21T18:30:00Z',
                path: '/v1/oauth/token'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid client credentials, unsupported grant type or invalid refresh token',
        schema: {
            type: 'object',
            example: {
                success: false,
                error: {
                    code: 'AUTH_INVALID_CLIENT',
                    message: 'Invalid client credentials or application inactive'
                },
                timestamp: '2026-03-21T18:30:00Z',
                path: '/v1/oauth/token'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Invalid scope requested',
        schema: {
            type: 'object',
            example: {
                success: false,
                error: {
                    code: 'AUTH_INVALID_SCOPE',
                    message: 'None of the requested scopes are allowed for this application'
                },
                timestamp: '2026-03-21T18:30:00Z',
                path: '/v1/oauth/token'
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth_token_request_dto_1.OAuthTokenRequestDto]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "oauthToken", null);
__decorate([
    (0, common_1.Post)('integration/token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'M2M Integration token endpoint (RF17)',
        description: 'Simplified alias for client_credentials grant.',
    }),
    (0, swagger_1.ApiConsumes)('application/json', 'application/x-www-form-urlencoded'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                client_id: { type: 'string', example: 'app_123' },
                client_secret: { type: 'string', example: 'secret_abc' },
                scope: { type: 'string', example: 'read:all' },
            },
            required: ['client_id', 'client_secret'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token issued successfully',
        schema: {
            type: 'object',
            properties: {
                access_token: { type: 'string' },
                token_type: { type: 'string', example: 'Bearer' },
                expires_in: { type: 'number', example: 3600 },
                scope: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Missing client_id or client_secret',
        schema: {
            type: 'object',
            example: {
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'client_id should not be empty'
                },
                timestamp: '2026-03-21T18:30:00Z',
                path: '/v1/integration/token'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid client credentials',
        schema: {
            type: 'object',
            example: {
                success: false,
                error: {
                    code: 'AUTH_INVALID_CLIENT',
                    message: 'Invalid client credentials or application inactive'
                },
                timestamp: '2026-03-21T18:30:00Z',
                path: '/v1/integration/token'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Invalid scope requested',
        schema: {
            type: 'object',
            example: {
                success: false,
                error: {
                    code: 'AUTH_INVALID_SCOPE',
                    message: 'None of the requested scopes are allowed for this application'
                },
                timestamp: '2026-03-21T18:30:00Z',
                path: '/v1/integration/token'
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth_token_request_dto_1.OAuthTokenRequestDto]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "integrationToken", null);
__decorate([
    (0, common_1.Get)('integration/test-scope'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, scopes_guard_1.ScopesGuard),
    (0, require_scopes_decorator_1.RequireScopes)('test:scope'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Test endpoint for scope validation',
        description: 'Requires "test:scope" to access.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Access granted',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient scopes',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "testScope", null);
exports.IntegrationController = IntegrationController = __decorate([
    (0, swagger_1.ApiTags)('Integration'),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(integration_service_1.IntegrationService)),
    __metadata("design:paramtypes", [integration_service_1.IntegrationService])
], IntegrationController);
//# sourceMappingURL=integration.controller.js.map