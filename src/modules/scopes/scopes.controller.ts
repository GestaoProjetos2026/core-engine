import { Controller, Get, Post, Body, UseGuards, Inject } from '@nestjs/common';
import { ScopesService } from './scopes.service';
import { CreateScopeDto } from './dto/create-scope.dto';
import { ApiBearerAuth, ApiConflictResponse, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';

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

@ApiTags('Scopes')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('scopes')
export class ScopesController {
  constructor(@Inject(ScopesService) private readonly scopesService: ScopesService) {}

  @Post()
  @RequirePermissions('scopes:write')
  @ApiOperation({
    summary: 'Create a new scope',
    description: 'Creates a new scope for M2M integration. Requires `scopes:write`.',
  })
  @ApiResponse({ status: 201, description: 'Scope created successfully.' })
  @ApiConflictResponse({ description: 'Scope code already exists.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks permission.', schema: forbiddenExample })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', example: 'orders.read' },
        description: { type: 'string', example: 'Read orders' },
      },
      required: ['code'],
    },
  })
  async create(@Body() createScopeDto: CreateScopeDto) {
    return this.scopesService.create(createScopeDto);
  }

  @Get()
  @RequirePermissions('scopes:read')
  @ApiOperation({
    summary: 'List all scopes',
    description: 'Returns all global scopes. Requires `scopes:read`.',
  })
  @ApiResponse({ status: 200, description: 'List of scopes.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks permission.', schema: forbiddenExample })
  async findAll() {
    return this.scopesService.findAll();
  }
}
