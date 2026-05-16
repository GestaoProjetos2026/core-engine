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
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_service_1 = require("./permissions.service");
const create_permission_dto_1 = require("./dto/create-permission.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const require_permissions_decorator_1 = require("../auth/decorators/require-permissions.decorator");
const unauthorizedExample = {
    example: {
        success: false,
        error: { code: 'AUTH_TOKEN_INVALID', message: 'Invalid or missing bearer token' },
        timestamp: '2026-04-15T10:00:00.000Z',
        path: '/v1/permissions',
    },
};
const forbiddenExample = {
    example: {
        success: false,
        error: { code: 'AUTHZ_FORBIDDEN', message: 'Insufficient permissions' },
        timestamp: '2026-04-15T10:00:00.000Z',
        path: '/v1/permissions',
    },
};
let PermissionsController = class PermissionsController {
    permissionsService;
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    async create(createPermissionDto) {
        return this.permissionsService.create(createPermissionDto);
    }
    async findAll() {
        return this.permissionsService.findAll();
    }
    async deletePermission(id) {
        return this.permissionsService.delete(id);
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('permissions:write'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new permission',
        description: 'RF11: Creates a new permission. Requires permission `permissions:write`. Code must be unique (RN06).',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Permission created successfully.' }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'Permission code already exists.',
        schema: {
            example: {
                success: false,
                error: { code: 'RESOURCE_CONFLICT', message: 'Permission code already exists (RN06)' },
                timestamp: '2026-04-15T10:00:00.000Z',
                path: '/v1/permissions',
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks `permissions:write` permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                code: { type: 'string', example: 'users:write' },
                description: { type: 'string', example: 'Create users' },
            },
            required: ['code'],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_permission_dto_1.CreatePermissionDto]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('permissions:read'),
    (0, swagger_1.ApiOperation)({
        summary: 'List all permissions',
        description: 'RF11: Returns a list of all permissions. Requires permission `permissions:read`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of permissions.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks `permissions:read` permission.', schema: forbiddenExample }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(200),
    (0, require_permissions_decorator_1.RequirePermissions)('permissions:write'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a permission',
        description: 'Deletes a permission. Requires permission `permissions:write`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permission deleted successfully.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Permission not found.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks `permissions:write` permission.', schema: forbiddenExample }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "deletePermission", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, swagger_1.ApiTags)('Permissions'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('permissions'),
    __param(0, (0, common_1.Inject)(permissions_service_1.PermissionsService)),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService])
], PermissionsController);
//# sourceMappingURL=permissions.controller.js.map