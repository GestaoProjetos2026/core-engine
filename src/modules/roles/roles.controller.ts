import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
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
}


