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
const integration_token_guard_1 = require("../auth/guards/integration-token.guard");
const require_scopes_decorator_1 = require("../auth/decorators/require-scopes.decorator");
const tenant_guard_1 = require("../auth/guards/tenant.guard");
const current_tenant_decorator_1 = require("../auth/decorators/current-tenant.decorator");
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
    async getUserIdentity(id, tenantId) {
        return this.integrationService.findUserIdentityById(id, tenantId);
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
__decorate([
    (0, common_1.Get)('integration/users/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, integration_token_guard_1.IntegrationTokenGuard, tenant_guard_1.TenantGuard, scopes_guard_1.ScopesGuard),
    (0, require_scopes_decorator_1.RequireScopes)('identity:read'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user identity by UUID (M2M)',
        description: 'RF29: Returns id, name, email and status for squads consuming Core identity (e.g. Fiscal emitente, CRM logged-in name). Requires JWT `integration_access`, scope `identity:read`, and header `X-Tenant-Id`. Human tokens are rejected.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'User UUID (same as JWT claim `sub` for human users)' }),
    (0, swagger_1.ApiHeader)({
        name: 'X-Tenant-Id',
        required: true,
        description: 'Tenant UUID for row-level isolation (RF27)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User identity found',
        schema: {
            example: {
                success: true,
                data: {
                    id: '550e8400-e29b-41d4-a716-446655440000',
                    email: 'agente@empresa.com',
                    name: 'Agente CRM',
                    status: 'ACTIVE',
                    createdAt: '2026-05-01T10:00:00.000Z',
                    updatedAt: '2026-05-01T10:00:00.000Z',
                },
                timestamp: '2026-05-27T12:00:00.000Z',
                path: '/v1/integration/users/550e8400-e29b-41d4-a716-446655440000',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden — missing scope, human token, or invalid token type',
        schema: {
            example: {
                success: false,
                error: { code: 'AUTHZ_FORBIDDEN', message: 'Insufficient scopes. Required: identity:read' },
                timestamp: '2026-05-27T12:00:00.000Z',
                path: '/v1/integration/users/:id',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found',
        schema: {
            example: {
                success: false,
                error: { code: 'RESOURCE_NOT_FOUND', message: 'Usuário não encontrado' },
                timestamp: '2026-05-27T12:00:00.000Z',
                path: '/v1/integration/users/:id',
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IntegrationController.prototype, "getUserIdentity", null);
exports.IntegrationController = IntegrationController = __decorate([
    (0, swagger_1.ApiTags)('Integration'),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(integration_service_1.IntegrationService)),
    __metadata("design:paramtypes", [integration_service_1.IntegrationService])
], IntegrationController);
//# sourceMappingURL=integration.controller.js.map