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
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ChangeApplicationStatusDto } from './dto/change-application-status.dto';
import { ListApplicationsQueryDto } from './dto/list-applications-query.dto';
import { AssociateScopesDto } from './dto/associate-scopes.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';

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

@ApiTags('Applications')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(@Inject(ApplicationsService) private readonly applicationsService: ApplicationsService) {}

  @Post()
  @RequirePermissions('applications:write')
  @ApiOperation({
    summary: 'Create a new application',
    description:
      'RF14: Creates a new application. Returns the `client_secret` just once (RN02). Requires `applications:write`.',
  })
  @ApiResponse({ status: 201, description: 'Application created successfully with client_secret.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks permission.', schema: forbiddenExample })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'My App' },
      },
      required: ['name'],
    },
  })
  async create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(createApplicationDto);
  }

  @Get()
  @RequirePermissions('applications:read')
  @ApiOperation({
    summary: 'List applications',
    description: 'RF14: Returns a paginated list of applications without secrets (RN02). Requires `applications:read`.',
  })
  @ApiResponse({ status: 200, description: 'List of applications.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks permission.', schema: forbiddenExample })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filter by app name' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  async findAll(@Query() query: ListApplicationsQueryDto) {
    return this.applicationsService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('applications:read')
  @ApiOperation({
    summary: 'Get an application by ID',
    description: 'RF14: Returns an application by its UUID without the secret. Requires `applications:read`.',
  })
  @ApiResponse({ status: 200, description: 'Application details.' })
  @ApiNotFoundResponse({ description: 'Application not found.', schema: notFoundExample })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks permission.', schema: forbiddenExample })
  @ApiParam({ name: 'id', required: true, type: String, description: 'Application UUID' })
  async findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('applications:write')
  @ApiOperation({
    summary: 'Update application details',
    description: 'RF14: Updates application fields such as name. Requires `applications:write`.',
  })
  @ApiResponse({ status: 200, description: 'Application updated successfully.' })
  @ApiNotFoundResponse({ description: 'Application not found.', schema: notFoundExample })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks permission.', schema: forbiddenExample })
  @ApiParam({ name: 'id', required: true, type: String, description: 'Application UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'My App' },
      },
    },
  })
  async update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationsService.update(id, updateApplicationDto);
  }

  @Patch(':id/status')
  @RequirePermissions('applications:write')
  @ApiOperation({
    summary: 'Change application status',
    description: 'RF14: Sets application status to ACTIVE or INACTIVE. Requires `applications:write`.',
  })
  @ApiResponse({ status: 200, description: 'Status updated.' })
  @ApiNotFoundResponse({ description: 'Application not found.', schema: notFoundExample })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks permission.', schema: forbiddenExample })
  @ApiParam({ name: 'id', required: true, type: String, description: 'Application UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ACTIVE' },
      },
      required: ['status'],
    },
  })
  async changeStatus(@Param('id') id: string, @Body() changeStatusDto: ChangeApplicationStatusDto) {
    return this.applicationsService.changeStatus(id, changeStatusDto);
  }

  @Post(':id/regenerate-secret')
  @RequirePermissions('applications:write')
  @ApiOperation({
    summary: 'Regenerate client secret',
    description: 'RF15: Generates a new secret for the application and returns it just once. Requires `applications:write`.',
  })
  @ApiResponse({ status: 201, description: 'Secret regenerated successfully.' })
  @ApiNotFoundResponse({ description: 'Application not found.', schema: notFoundExample })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks permission.', schema: forbiddenExample })
  @ApiParam({ name: 'id', required: true, type: String, description: 'Application UUID' })
  async regenerateSecret(@Param('id') id: string) {
    return this.applicationsService.regenerateSecret(id);
  }

  @Get(':id/scopes')
  @RequirePermissions('applications:read')
  @ApiOperation({
    summary: 'List application scopes',
    description: 'RF16: Returns a list of scopes associated with the application. Requires `applications:read`.',
  })
  @ApiResponse({ status: 200, description: 'List of application scopes.' })
  @ApiNotFoundResponse({ description: 'Application not found.', schema: notFoundExample })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks permission.', schema: forbiddenExample })
  @ApiParam({ name: 'id', required: true, schema: { type: 'string' }, description: 'Application UUID' })
  async getScopes(@Param('id') id: string) {
    return this.applicationsService.getScopes(id);
  }

  @Post(':id/scopes')
  @RequirePermissions('applications:write')
  @ApiOperation({
    summary: 'Associate scopes to application',
    description: 'RF16: Replaces the current scopes associated with the application. Requires `applications:write`.',
  })
  @ApiResponse({ status: 201, description: 'Scopes associated successfully.' })
  @ApiNotFoundResponse({ description: 'Application or scope not found.', schema: notFoundExample })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token.', schema: unauthorizedExample })
  @ApiForbiddenResponse({ description: 'Token lacks permission.', schema: forbiddenExample })
  @ApiParam({ name: 'id', required: true, type: String, description: 'Application UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        scopeIds: { type: 'array', items: { type: 'string' }, example: ['uuid1', 'uuid2'] },
      },
      required: ['scopeIds'],
    },
  })
  async associateScopes(@Param('id') id: string, @Body() associateScopesDto: AssociateScopesDto) {
    return this.applicationsService.associateScopes(id, associateScopesDto);
  }
}
