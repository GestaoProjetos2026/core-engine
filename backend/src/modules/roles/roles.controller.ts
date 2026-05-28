import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleUsersDto } from './dto/assign-role-users.dto';
import { AssignRolePermissionsDto } from './dto/assign-role-permissions.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';

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

@ApiTags('Roles')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(@Inject(RolesService) private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermissions('roles:write')
  @ApiOperation({
    summary: 'Create a new role',
    description: 'RF10: Creates a new role. Requires permission `roles:write`. Name must be unique (RN06).',
  })
  @ApiResponse({ status: 201, description: 'Role created successfully.' })

  @ApiConflictResponse({
    description: 'Role name already exists.',
    schema: {
      example: {
        success: false,
        error: { code: 'RESOURCE_CONFLICT', message: 'Role name already exists (RN06)' },
        timestamp: '2026-04-15T10:00:00.000Z',
        path: '/v1/roles',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks `roles:write` permission.', schema: forbiddenExample })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Admin' },
        description: { type: 'string', example: 'Administrator role' },
      },
      required: ['name'],
    },
  })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @RequirePermissions('roles:read')
  @ApiOperation({
    summary: 'List all roles',
    description: 'RF10: Returns a list of all roles. Requires permission `roles:read`.',
  })
  @ApiResponse({ status: 200, description: 'List of roles.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks `roles:read` permission.', schema: forbiddenExample })
  async findAll() {
    return this.rolesService.findAll();
  }

  @Post(':id/users')
  @HttpCode(200)
  @RequirePermissions('roles:manage')
  @ApiOperation({
    summary: 'Assign users to a role',
    description: 'RF12: Links one or more users to a role. Requires permission `roles:manage`.',
  })
  @ApiResponse({ status: 200, description: 'Users assigned successfully.' })
  @ApiNotFoundResponse({ description: 'Role or one/more users not found.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks `roles:manage` permission.', schema: forbiddenExample })
  @ApiParam({ name: 'id', required: true, type: String, description: 'Role UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userIds: { type: 'array', items: { type: 'string' }, example: ['uuid1', 'uuid2'] },
      },
      required: ['userIds'],
    },
  })
  async assignUsers(@Param('id') id: string, @Body() dto: AssignRoleUsersDto) {
    return this.rolesService.assignUsers(id, dto);
  }

  @Post(':id/permissions')
  @HttpCode(200)
  @RequirePermissions('roles:manage')
  @ApiOperation({
    summary: 'Assign permissions to a role',
    description: 'RF13: Links one or more permissions to a role. Requires permission `roles:manage`.',
  })
  @ApiResponse({ status: 200, description: 'Permissions assigned successfully.' })
  @ApiNotFoundResponse({ description: 'Role or one/more permissions not found.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks `roles:manage` permission.', schema: forbiddenExample })
  @ApiParam({ name: 'id', required: true, type: String, description: 'Role UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        permissionIds: { type: 'array', items: { type: 'string' }, example: ['uuid1', 'uuid2'] },
      },
      required: ['permissionIds'],
    },
  })
  async assignPermissions(@Param('id') id: string, @Body() dto: AssignRolePermissionsDto) {
    return this.rolesService.assignPermissions(id, dto);
  }

  @Post(':id/permissions/sync') // I'll use /sync for clarity or PUT :id/permissions
  @HttpCode(200)
  @RequirePermissions('roles:manage')
  @ApiOperation({
    summary: 'Sync permissions with a role (overwrite)',
    description: 'Overwrites all permissions for a role with the provided list. Requires permission `roles:manage`.',
  })
  @ApiResponse({ status: 200, description: 'Permissions synced successfully.' })
  @ApiParam({ name: 'id', required: true, type: String, description: 'Role UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        permissionIds: { type: 'array', items: { type: 'string' }, example: ['uuid1', 'uuid2'] },
      },
      required: ['permissionIds'],
    },
  })
  async syncPermissions(@Param('id') id: string, @Body() dto: AssignRolePermissionsDto) {
    return this.rolesService.syncPermissions(id, dto);
  }

  @Delete(':id/users/:userId')
  @HttpCode(200)
  @RequirePermissions('roles:manage')
  @ApiOperation({
    summary: 'Remove user from a role',
    description: 'Removes a user from a role. Requires permission `roles:manage`.',
  })
  @ApiResponse({ status: 200, description: 'User removed from role successfully.' })
  @ApiNotFoundResponse({ description: 'Link not found.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks `roles:manage` permission.', schema: forbiddenExample })
  async removeUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.rolesService.removeUser(id, userId);
  }

  @Delete(':id/permissions/:permissionId')
  @HttpCode(200)
  @RequirePermissions('roles:manage')
  @ApiOperation({
    summary: 'Remove permission from a role',
    description: 'Removes a permission from a role. Requires permission `roles:manage`.',
  })
  @ApiResponse({ status: 200, description: 'Permission removed from role successfully.' })
  @ApiNotFoundResponse({ description: 'Link not found.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks `roles:manage` permission.', schema: forbiddenExample })
  async removePermission(@Param('id') id: string, @Param('permissionId') permissionId: string) {
    return this.rolesService.removePermission(id, permissionId);
  }

  @Delete(':id')
  @HttpCode(200)
  @RequirePermissions('roles:manage')
  @ApiOperation({
    summary: 'Delete a role',
    description: 'Deletes a role. Requires permission `roles:manage`.',
  })
  @ApiResponse({ status: 200, description: 'Role deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks `roles:manage` permission.', schema: forbiddenExample })
  async deleteRole(@Param('id') id: string) {
    return this.rolesService.delete(id);
  }
}


