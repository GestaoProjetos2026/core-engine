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
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_service_1 = require("./roles.service");
const create_role_dto_1 = require("./dto/create-role.dto");
const assign_role_users_dto_1 = require("./dto/assign-role-users.dto");
const assign_role_permissions_dto_1 = require("./dto/assign-role-permissions.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const require_permissions_decorator_1 = require("../auth/decorators/require-permissions.decorator");
const unauthorizedExample = {
    example: {
        success: false,
        error: { code: 'AUTH_TOKEN_INVALID', message: 'Invalid or missing bearer token' },
        timestamp: '2026-04-15T10:00:00.000Z',
        path: '/v1/roles',
    },
};
const forbiddenExample = {
    example: {
        success: false,
        error: { code: 'AUTHZ_FORBIDDEN', message: 'Insufficient permissions' },
        timestamp: '2026-04-15T10:00:00.000Z',
        path: '/v1/roles',
    },
};
let RolesController = class RolesController {
    rolesService;
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    async create(createRoleDto) {
        return this.rolesService.create(createRoleDto);
    }
    async findAll() {
        return this.rolesService.findAll();
    }
    async assignUsers(id, dto) {
        return this.rolesService.assignUsers(id, dto);
    }
    async assignPermissions(id, dto) {
        return this.rolesService.assignPermissions(id, dto);
    }
    async removeUser(id, userId) {
        return this.rolesService.removeUser(id, userId);
    }
    async removePermission(id, permissionId) {
        return this.rolesService.removePermission(id, permissionId);
    }
    async deleteRole(id) {
        return this.rolesService.delete(id);
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('roles:write'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new role',
        description: 'RF10: Creates a new role. Requires permission `roles:write`. Name must be unique (RN06).',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Role created successfully.' }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'Role name already exists.',
        schema: {
            example: {
                success: false,
                error: { code: 'RESOURCE_CONFLICT', message: 'Role name already exists (RN06)' },
                timestamp: '2026-04-15T10:00:00.000Z',
                path: '/v1/roles',
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks `roles:write` permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Admin' },
                description: { type: 'string', example: 'Administrator role' },
            },
            required: ['name'],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_role_dto_1.CreateRoleDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('roles:read'),
    (0, swagger_1.ApiOperation)({
        summary: 'List all roles',
        description: 'RF10: Returns a list of all roles. Requires permission `roles:read`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of roles.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks `roles:read` permission.', schema: forbiddenExample }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(':id/users'),
    (0, common_1.HttpCode)(200),
    (0, require_permissions_decorator_1.RequirePermissions)('roles:manage'),
    (0, swagger_1.ApiOperation)({
        summary: 'Assign users to a role',
        description: 'RF12: Links one or more users to a role. Requires permission `roles:manage`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Users assigned successfully.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Role or one/more users not found.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks `roles:manage` permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, type: String, description: 'Role UUID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                userIds: { type: 'array', items: { type: 'string' }, example: ['uuid1', 'uuid2'] },
            },
            required: ['userIds'],
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_role_users_dto_1.AssignRoleUsersDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "assignUsers", null);
__decorate([
    (0, common_1.Post)(':id/permissions'),
    (0, common_1.HttpCode)(200),
    (0, require_permissions_decorator_1.RequirePermissions)('roles:manage'),
    (0, swagger_1.ApiOperation)({
        summary: 'Assign permissions to a role',
        description: 'RF13: Links one or more permissions to a role. Requires permission `roles:manage`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permissions assigned successfully.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Role or one/more permissions not found.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks `roles:manage` permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, type: String, description: 'Role UUID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                permissionIds: { type: 'array', items: { type: 'string' }, example: ['uuid1', 'uuid2'] },
            },
            required: ['permissionIds'],
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_role_permissions_dto_1.AssignRolePermissionsDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "assignPermissions", null);
__decorate([
    (0, common_1.Delete)(':id/users/:userId'),
    (0, common_1.HttpCode)(200),
    (0, require_permissions_decorator_1.RequirePermissions)('roles:manage'),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove user from a role',
        description: 'Removes a user from a role. Requires permission `roles:manage`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User removed from role successfully.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Link not found.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks `roles:manage` permission.', schema: forbiddenExample }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "removeUser", null);
__decorate([
    (0, common_1.Delete)(':id/permissions/:permissionId'),
    (0, common_1.HttpCode)(200),
    (0, require_permissions_decorator_1.RequirePermissions)('roles:manage'),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove permission from a role',
        description: 'Removes a permission from a role. Requires permission `roles:manage`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permission removed from role successfully.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Link not found.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks `roles:manage` permission.', schema: forbiddenExample }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('permissionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "removePermission", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(200),
    (0, require_permissions_decorator_1.RequirePermissions)('roles:manage'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a role',
        description: 'Deletes a role. Requires permission `roles:manage`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role deleted successfully.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Role not found.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks `roles:manage` permission.', schema: forbiddenExample }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "deleteRole", null);
exports.RolesController = RolesController = __decorate([
    (0, swagger_1.ApiTags)('Roles'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('roles'),
    __param(0, (0, common_1.Inject)(roles_service_1.RolesService)),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map