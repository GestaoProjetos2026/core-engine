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
exports.ApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const applications_service_1 = require("./applications.service");
const create_application_dto_1 = require("./dto/create-application.dto");
const update_application_dto_1 = require("./dto/update-application.dto");
const change_application_status_dto_1 = require("./dto/change-application-status.dto");
const list_applications_query_dto_1 = require("./dto/list-applications-query.dto");
const associate_scopes_dto_1 = require("./dto/associate-scopes.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const require_permissions_decorator_1 = require("../auth/decorators/require-permissions.decorator");
const unauthorizedExample = {
    example: {
        success: false,
        error: { code: 'AUTH_TOKEN_INVALID', message: 'Invalid or missing bearer token' },
        timestamp: '2026-04-20T10:00:00.000Z',
        path: '/v1/applications',
    },
};
const forbiddenExample = {
    example: {
        success: false,
        error: { code: 'AUTHZ_FORBIDDEN', message: 'Insufficient permissions' },
        timestamp: '2026-04-20T10:00:00.000Z',
        path: '/v1/applications',
    },
};
const notFoundExample = {
    example: {
        success: false,
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Application not found' },
        timestamp: '2026-04-20T10:00:00.000Z',
        path: '/v1/applications/:id',
    },
};
let ApplicationsController = class ApplicationsController {
    applicationsService;
    constructor(applicationsService) {
        this.applicationsService = applicationsService;
    }
    async create(createApplicationDto) {
        return this.applicationsService.create(createApplicationDto);
    }
    async findAll(query) {
        return this.applicationsService.findAll(query);
    }
    async findOne(id) {
        return this.applicationsService.findOne(id);
    }
    async update(id, updateApplicationDto) {
        return this.applicationsService.update(id, updateApplicationDto);
    }
    async changeStatus(id, changeStatusDto) {
        return this.applicationsService.changeStatus(id, changeStatusDto);
    }
    async regenerateSecret(id) {
        return this.applicationsService.regenerateSecret(id);
    }
    async getScopes(id) {
        return this.applicationsService.getScopes(id);
    }
    async associateScopes(id, associateScopesDto) {
        return this.applicationsService.associateScopes(id, associateScopesDto);
    }
};
exports.ApplicationsController = ApplicationsController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('applications:write'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new application',
        description: 'RF14: Creates a new application. Returns the `client_secret` just once (RN02). Requires `applications:write`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Application created successfully with client_secret.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'My App' },
            },
            required: ['name'],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_application_dto_1.CreateApplicationDto]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('applications:read'),
    (0, swagger_1.ApiOperation)({
        summary: 'List applications',
        description: 'RF14: Returns a paginated list of applications without secrets (RN02). Requires `applications:read`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of applications.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'name', required: false, type: String, description: 'Filter by app name' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String, description: 'Filter by status' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_applications_query_dto_1.ListApplicationsQueryDto]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('applications:read'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get an application by ID',
        description: 'RF14: Returns an application by its UUID without the secret. Requires `applications:read`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application details.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Application not found.', schema: notFoundExample }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, type: String, description: 'Application UUID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('applications:write'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update application details',
        description: 'RF14: Updates application fields such as name. Requires `applications:write`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application updated successfully.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Application not found.', schema: notFoundExample }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, type: String, description: 'Application UUID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'My App' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_application_dto_1.UpdateApplicationDto]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, require_permissions_decorator_1.RequirePermissions)('applications:write'),
    (0, swagger_1.ApiOperation)({
        summary: 'Change application status',
        description: 'RF14: Sets application status to ACTIVE or INACTIVE. Requires `applications:write`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Application not found.', schema: notFoundExample }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, type: String, description: 'Application UUID' }),
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_application_status_dto_1.ChangeApplicationStatusDto]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "changeStatus", null);
__decorate([
    (0, common_1.Post)(':id/regenerate-secret'),
    (0, require_permissions_decorator_1.RequirePermissions)('applications:write'),
    (0, swagger_1.ApiOperation)({
        summary: 'Regenerate client secret',
        description: 'RF15: Generates a new secret for the application and returns it just once. Requires `applications:write`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Secret regenerated successfully.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Application not found.', schema: notFoundExample }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, type: String, description: 'Application UUID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "regenerateSecret", null);
__decorate([
    (0, common_1.Get)(':id/scopes'),
    (0, require_permissions_decorator_1.RequirePermissions)('applications:read'),
    (0, swagger_1.ApiOperation)({
        summary: 'List application scopes',
        description: 'RF16: Returns a list of scopes associated with the application. Requires `applications:read`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of application scopes.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Application not found.', schema: notFoundExample }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, schema: { type: 'string' }, description: 'Application UUID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "getScopes", null);
__decorate([
    (0, common_1.Post)(':id/scopes'),
    (0, require_permissions_decorator_1.RequirePermissions)('applications:write'),
    (0, swagger_1.ApiOperation)({
        summary: 'Associate scopes to application',
        description: 'RF16: Replaces the current scopes associated with the application. Requires `applications:write`.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Scopes associated successfully.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Application or scope not found.', schema: notFoundExample }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Missing or invalid token.', schema: unauthorizedExample }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Token lacks permission.', schema: forbiddenExample }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, type: String, description: 'Application UUID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                scopeIds: { type: 'array', items: { type: 'string' }, example: ['uuid1', 'uuid2'] },
            },
            required: ['scopeIds'],
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, associate_scopes_dto_1.AssociateScopesDto]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "associateScopes", null);
exports.ApplicationsController = ApplicationsController = __decorate([
    (0, swagger_1.ApiTags)('Applications'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('applications'),
    __param(0, (0, common_1.Inject)(applications_service_1.ApplicationsService)),
    __metadata("design:paramtypes", [applications_service_1.ApplicationsService])
], ApplicationsController);
//# sourceMappingURL=applications.controller.js.map