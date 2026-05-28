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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const change_user_status_dto_1 = require("./dto/change-user-status.dto");
const list_users_query_dto_1 = require("./dto/list-users-query.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const tenant_guard_1 = require("../auth/guards/tenant.guard");
const require_permissions_decorator_1 = require("../auth/decorators/require-permissions.decorator");
const current_tenant_decorator_1 = require("../auth/decorators/current-tenant.decorator");
const tenant_headers_1 = require("../../shared/constants/tenant-headers");
const unauthorizedExample = {
    example: {
        success: false,
        error: { code: 'AUTH_TOKEN_INVALID', message: 'Invalid or missing bearer token' },
        timestamp: '2026-04-15T10:00:00.000Z',
        path: '/v1/users',
    },
};
const forbiddenExample = {
    example: {
        success: false,
        error: { code: 'AUTHZ_FORBIDDEN', message: 'Insufficient permissions' },
        timestamp: '2026-04-15T10:00:00.000Z',
        path: '/v1/users',
    },
};
const notFoundExample = {
    example: {
        success: false,
        error: { code: 'RESOURCE_NOT_FOUND', message: 'User not found' },
        timestamp: '2026-04-15T10:00:00.000Z',
        path: '/v1/users/:id',
    },
};
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async create(createUserDto, tenantId) {
        return this.usersService.create(createUserDto, tenantId);
    }
    async findAll(query, tenantId) {
        return this.usersService.findAll(query, tenantId);
    }
    async findOne(id, tenantId) {
        return this.usersService.findOne(id, tenantId);
    }
    async update(id, updateUserDto, tenantId) {
        return this.usersService.update(id, updateUserDto, tenantId);
    }
    async changeStatus(id, changeStatusDto, tenantId) {
        return this.usersService.changeStatus(id, changeStatusDto, tenantId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('users:write'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new user (admin)',
        description: 'RF09: Creates a new user. Requires permission `users:write`. E-mail must be unique (RN06).',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User created successfully.' }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'E-mail already registered (RN06).',
        schema: {
            example: {
                success: false,
                error: { code: 'RESOURCE_CONFLICT', message: 'Email already registered' },
                timestamp: '2026-04-15T10:00:00.000Z',
                path: '/v1/users',
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks `users:write` permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
                name: { type: 'string', example: 'John Doe' },
                password: { type: 'string', example: 'strongPassword123' },
            },
            required: ['email', 'name', 'password'],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('users:read'),
    (0, swagger_1.ApiOperation)({
        summary: 'List users (paginated)',
        description: 'RF09: Returns a paginated list of users. Requires permission `users:read`. Supports filtering by email and status.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list of users.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks `users:read` permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'email', required: false, type: String, description: 'Filter by email' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String, description: 'Filter by status' }),
    (0, swagger_1.ApiQuery)({
        name: tenant_headers_1.X_TENANT_ID_HEADER,
        required: false,
        type: String,
        description: 'Tenant UUID; when omitted, the tenant_id from the JWT is used. Must match the token when provided (RF27).',
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_users_query_dto_1.ListUsersQueryDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('users:read'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a user by ID',
        description: 'RF09: Returns a single user by UUID. Requires permission `users:read`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User found.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found.', schema: notFoundExample }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks `users:read` permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, type: String, description: 'User UUID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('users:write'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a user',
        description: 'RF09: Partially updates user fields. Requires permission `users:write`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User updated successfully.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found.', schema: notFoundExample }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks `users:write` permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, type: String, description: 'User UUID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
                name: { type: 'string', example: 'John Doe' },
                password: { type: 'string', example: 'strongPassword123' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, require_permissions_decorator_1.RequirePermissions)('users:write'),
    (0, swagger_1.ApiOperation)({
        summary: 'Change user status (activate / deactivate)',
        description: 'RF09 / RN01: Sets user status to ACTIVE or INACTIVE. Inactive users cannot authenticate.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Status updated.',
        schema: {
            example: {
                success: true,
                data: {
                    id: '550e8400-e29b-41d4-a716-446655440000',
                    email: 'usuario@empresa.com',
                    name: 'João Silva',
                    status: 'INACTIVE',
                },
                timestamp: '2026-04-15T10:00:00.000Z',
                path: '/v1/users/550e8400-e29b-41d4-a716-446655440000/status',
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found.', schema: notFoundExample }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks `users:write` permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, type: String, description: 'User UUID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'ACTIVE' },
            },
            required: ['status'],
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_user_status_dto_1.ChangeUserStatusDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changeStatus", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('users'),
    __param(0, (0, common_1.Inject)(users_service_1.UsersService)),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map