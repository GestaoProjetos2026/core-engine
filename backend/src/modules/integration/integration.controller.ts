import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';
import { IntegrationService } from './integration.service';
import { OAuthTokenRequestDto } from './dto/oauth-token-request.dto';
import { OAuthTokenResponseDto } from './dto/oauth-token-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ScopesGuard } from '../auth/guards/scopes.guard';
import { IntegrationTokenGuard } from '../auth/guards/integration-token.guard';
import { RequireScopes } from '../auth/decorators/require-scopes.decorator';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';

@ApiTags('Integration')
@Controller()
export class IntegrationController {
  constructor(
    @Inject(IntegrationService) private readonly integrationService: IntegrationService,
  ) {}

  @Post('oauth/token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'OAuth 2.0 token endpoint (RF21)',
    description: 'Issues tokens based on the provided grant type (client_credentials or refresh_token).',
  })
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        grant_type: { 
          type: 'string', 
          enum: ['client_credentials', 'refresh_token'],
          example: 'client_credentials' 
        },
        client_id: { type: 'string', example: 'app_123' },
        client_secret: { type: 'string', example: 'secret_abc' },
        scope: { type: 'string', example: 'read:all' },
        refresh_token: { type: 'string', example: 'refresh_xyz' },
      },
      required: ['grant_type'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token issued successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        token_type: { type: 'string', example: 'Bearer' },
        expires_in: { type: 'number', example: 3600 },
        refresh_token: { type: 'string' },
        scope: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Missing or invalid parameters',
    schema: {
      type: 'object',
      example: {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'grant_type should not be empty'
        },
        timestamp: '2026-03-21T18:30:00Z',
        path: '/v1/oauth/token'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid client credentials, unsupported grant type or invalid refresh token',
    schema: {
      type: 'object',
      example: {
        success: false,
        error: {
          code: 'AUTH_INVALID_CLIENT',
          message: 'Invalid client credentials or application inactive'
        },
        timestamp: '2026-03-21T18:30:00Z',
        path: '/v1/oauth/token'
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Invalid scope requested',
    schema: {
      type: 'object',
      example: {
        success: false,
        error: {
          code: 'AUTH_INVALID_SCOPE',
          message: 'None of the requested scopes are allowed for this application'
        },
        timestamp: '2026-03-21T18:30:00Z',
        path: '/v1/oauth/token'
      }
    }
  })
  async oauthToken(@Body() dto: OAuthTokenRequestDto): Promise<OAuthTokenResponseDto> {
    return this.integrationService.issueToken(dto);
  }

  @Post('integration/token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'M2M Integration token endpoint (RF17)',
    description: 'Simplified alias for client_credentials grant.',
  })
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        client_id: { type: 'string', example: 'app_123' },
        client_secret: { type: 'string', example: 'secret_abc' },
        scope: { type: 'string', example: 'read:all' },
      },
      required: ['client_id', 'client_secret'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token issued successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        token_type: { type: 'string', example: 'Bearer' },
        expires_in: { type: 'number', example: 3600 },
        scope: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Missing client_id or client_secret',
    schema: {
      type: 'object',
      example: {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'client_id should not be empty'
        },
        timestamp: '2026-03-21T18:30:00Z',
        path: '/v1/integration/token'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid client credentials',
    schema: {
      type: 'object',
      example: {
        success: false,
        error: {
          code: 'AUTH_INVALID_CLIENT',
          message: 'Invalid client credentials or application inactive'
        },
        timestamp: '2026-03-21T18:30:00Z',
        path: '/v1/integration/token'
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Invalid scope requested',
    schema: {
      type: 'object',
      example: {
        success: false,
        error: {
          code: 'AUTH_INVALID_SCOPE',
          message: 'None of the requested scopes are allowed for this application'
        },
        timestamp: '2026-03-21T18:30:00Z',
        path: '/v1/integration/token'
      }
    }
  })
  async integrationToken(@Body() dto: OAuthTokenRequestDto): Promise<OAuthTokenResponseDto> {
    // Force grant_type to client_credentials if using this endpoint
    const requestDto = { ...dto, grant_type: dto.grant_type || 'client_credentials' as any };
    return this.integrationService.issueToken(requestDto);
  }
  
  @Get('integration/test-scope')
  @UseGuards(JwtAuthGuard, ScopesGuard)
  @RequireScopes('test:scope')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Test endpoint for scope validation',
    description: 'Requires "test:scope" to access.',
  })
  @ApiResponse({
    status: 200,
    description: 'Access granted',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient scopes',
  })
  async testScope() {
    return { success: true, message: 'You have the required scope!' };
  }

  @Get('integration/users/:id')
  @UseGuards(JwtAuthGuard, IntegrationTokenGuard, TenantGuard, ScopesGuard)
  @RequireScopes('identity:read')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user identity by UUID (M2M)',
    description:
      'RF29: Returns id, name, email and status for squads consuming Core identity (e.g. Fiscal emitente, CRM logged-in name). Requires JWT `integration_access`, scope `identity:read`, and header `X-Tenant-Id`. Human tokens are rejected.',
  })
  @ApiParam({ name: 'id', type: String, description: 'User UUID (same as JWT claim `sub` for human users)' })
  @ApiHeader({
    name: 'X-Tenant-Id',
    required: true,
    description: 'Tenant UUID for row-level isolation (RF27)',
  })
  @ApiResponse({
    status: 200,
    description: 'User identity found',
    schema: {
      example: {
        success: true,
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'agente@empresa.com',
          name: 'Agente CRM',
          status: 'ACTIVE',
          createdAt: '2026-05-01T10:00:00.000Z',
          updatedAt: '2026-05-01T10:00:00.000Z',
        },
        timestamp: '2026-05-27T12:00:00.000Z',
        path: '/v1/integration/users/550e8400-e29b-41d4-a716-446655440000',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — missing scope, human token, or invalid token type',
    schema: {
      example: {
        success: false,
        error: { code: 'AUTHZ_FORBIDDEN', message: 'Insufficient scopes. Required: identity:read' },
        timestamp: '2026-05-27T12:00:00.000Z',
        path: '/v1/integration/users/:id',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        success: false,
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Usuário não encontrado' },
        timestamp: '2026-05-27T12:00:00.000Z',
        path: '/v1/integration/users/:id',
      },
    },
  })
  async getUserIdentity(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.integrationService.findUserIdentityById(id, tenantId);
  }
}
