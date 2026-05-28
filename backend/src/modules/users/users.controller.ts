import {
  Body,
  Controller,
  Get,
  Param,
  Inject,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';
import { X_TENANT_ID_HEADER } from '../../shared/constants/tenant-headers';

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

@ApiTags('Users')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(@Inject(UsersService) private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions('users:write')
  @ApiOperation({
    summary: 'Create a new user (admin)',
    description:
      'RF09: Creates a new user. Requires permission `users:write`. E-mail must be unique (RN06).',
  })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiConflictResponse({
    description: 'E-mail already registered (RN06).',
    schema: {
      example: {
        success: false,
        error: { code: 'RESOURCE_CONFLICT', message: 'Email already registered' },
        timestamp: '2026-04-15T10:00:00.000Z',
        path: '/v1/users',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks `users:write` permission.', schema: forbiddenExample })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: 'John Doe' },
        password: { type: 'string', example: 'strongPassword123' },
      },
      required: ['email', 'name', 'password'],
    },
  })
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentTenant() tenantId: string,
  ) {
    return this.usersService.create(createUserDto, tenantId);
  }

  @Get()
  @RequirePermissions('users:read')
  @ApiOperation({
    summary: 'List users (paginated)',
    description: 'RF09: Returns a paginated list of users. Requires permission `users:read`. Supports filtering by email and status.',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of users.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks `users:read` permission.', schema: forbiddenExample })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'email', required: false, type: String, description: 'Filter by email' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filter by name' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  @ApiQuery({
    name: X_TENANT_ID_HEADER,
    required: false,
    type: String,
    description:
      'Tenant UUID; when omitted, the tenant_id from the JWT is used. Must match the token when provided (RF27).',
  })
  async findAll(@Query() query: ListUsersQueryDto, @CurrentTenant() tenantId: string) {
    return this.usersService.findAll(query, tenantId);
  }

  @Get(':id')
  @RequirePermissions('users:read')
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'RF09: Returns a single user by UUID. Requires permission `users:read`.',
  })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiNotFoundResponse({ description: 'User not found.', schema: notFoundExample })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks `users:read` permission.', schema: forbiddenExample })
  @ApiParam({ name: 'id', required: true, type: String, description: 'User UUID' })
  async findOne(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.usersService.findOne(id, tenantId);
  }

  @Patch(':id')
  @RequirePermissions('users:write')
  @ApiOperation({
    summary: 'Update a user',
    description: 'RF09: Partially updates user fields. Requires permission `users:write`.',
  })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiNotFoundResponse({ description: 'User not found.', schema: notFoundExample })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks `users:write` permission.', schema: forbiddenExample })
  @ApiParam({ name: 'id', required: true, type: String, description: 'User UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: 'John Doe' },
        password: { type: 'string', example: 'strongPassword123' },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentTenant() tenantId: string,
  ) {
    return this.usersService.update(id, updateUserDto, tenantId);
  }

  @Patch(':id/status')
  @RequirePermissions('users:write')
  @ApiOperation({
    summary: 'Change user status (activate / deactivate)',
    description:
      'RF09 / RN01: Sets user status to ACTIVE or INACTIVE. Inactive users cannot authenticate.',
  })
  @ApiResponse({
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
  })
  @ApiNotFoundResponse({ description: 'User not found.', schema: notFoundExample })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks `users:write` permission.', schema: forbiddenExample })
  @ApiParam({ name: 'id', required: true, type: String, description: 'User UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ACTIVE' },
      },
      required: ['status'],
    },
  })
  async changeStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeUserStatusDto,
    @CurrentTenant() tenantId: string,
  ) {
    return this.usersService.changeStatus(id, changeStatusDto, tenantId);
  }
}
