import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionResponseDto } from './dto/permission-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';

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

@ApiTags('Permissions')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(@Inject(PermissionsService) private readonly permissionsService: PermissionsService) {}

  @Post()
  @RequirePermissions('permissions:write')
  @ApiOperation({
    summary: 'Create a new permission',
    description: 'RF11: Creates a new permission. Requires permission `permissions:write`. Code must be unique (RN06).',
  })
  @ApiResponse({ status: 201, description: 'Permission created successfully.' })
  @ApiConflictResponse({
    description: 'Permission code already exists.',
    schema: {
      example: {
        success: false,
        error: { code: 'RESOURCE_CONFLICT', message: 'Permission code already exists (RN06)' },
        timestamp: '2026-04-15T10:00:00.000Z',
        path: '/v1/permissions',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks `permissions:write` permission.', schema: forbiddenExample })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', example: 'users:write' },
        description: { type: 'string', example: 'Create users' },
      },
      required: ['code'],
    },
  })
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @RequirePermissions('permissions:read')
  @ApiOperation({
    summary: 'List all permissions',
    description: 'RF11: Returns a list of all permissions. Requires permission `permissions:read`.',
  })
  @ApiResponse({ status: 200, description: 'List of permissions.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks `permissions:read` permission.', schema: forbiddenExample })
  async findAll() {
    return this.permissionsService.findAll();
  }
}


