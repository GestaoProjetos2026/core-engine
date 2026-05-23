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
exports.ScopesController = void 0;
const common_1 = require("@nestjs/common");
const scopes_service_1 = require("./scopes.service");
const create_scope_dto_1 = require("./dto/create-scope.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const require_permissions_decorator_1 = require("../auth/decorators/require-permissions.decorator");
const unauthorizedExample = {
    example: {
        success: false,
        error: { code: 'AUTH_TOKEN_INVALID', message: 'Invalid or missing bearer token' },
        timestamp: '2026-04-20T10:00:00.000Z',
        path: '/v1/scopes',
    },
};
const forbiddenExample = {
    example: {
        success: false,
        error: { code: 'AUTHZ_FORBIDDEN', message: 'Insufficient permissions' },
        timestamp: '2026-04-20T10:00:00.000Z',
        path: '/v1/scopes',
    },
};
let ScopesController = class ScopesController {
    scopesService;
    constructor(scopesService) {
        this.scopesService = scopesService;
    }
    async create(createScopeDto) {
        return this.scopesService.create(createScopeDto);
    }
    async findAll() {
        return this.scopesService.findAll();
    }
};
exports.ScopesController = ScopesController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('scopes:write'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new scope',
        description: 'Creates a new scope for M2M integration. Requires `scopes:write`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Scope created successfully.' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Scope code already exists.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                code: { type: 'string', example: 'orders.read' },
                description: { type: 'string', example: 'Read orders' },
            },
            required: ['code'],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_scope_dto_1.CreateScopeDto]),
    __metadata("design:returntype", Promise)
], ScopesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('scopes:read'),
    (0, swagger_1.ApiOperation)({
        summary: 'List all scopes',
        description: 'Returns all global scopes. Requires `scopes:read`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of scopes.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks permission.', schema: forbiddenExample }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScopesController.prototype, "findAll", null);
exports.ScopesController = ScopesController = __decorate([
    (0, swagger_1.ApiTags)('Scopes'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('scopes'),
    __param(0, (0, common_1.Inject)(scopes_service_1.ScopesService)),
    __metadata("design:paramtypes", [scopes_service_1.ScopesService])
], ScopesController);
//# sourceMappingURL=scopes.controller.js.map