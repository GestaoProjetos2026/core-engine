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
const require_permissions_decorator_1 = require("../auth/decorators/require-permissions.decorator");
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
    async create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    async findAll(query) {
        return this.usersService.findAll(query);
    }
    async findOne(id) {
        return this.usersService.findOne(id);
    }
    async update(id, updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    async changeStatus(id, changeStatusDto) {
        return this.usersService.changeStatus(id, changeStatusDto);
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
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
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
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_users_query_dto_1.ListUsersQueryDto]),
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
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
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
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
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
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_user_status_dto_1.ChangeUserStatusDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changeStatus", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map