import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { IntegrationService } from './integration.service';
import { OAuthTokenRequestDto } from './dto/oauth-token-request.dto';
import { OAuthTokenResponseDto } from './dto/oauth-token-response.dto';

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
    status: 401,
    description: 'Invalid client credentials or grant',
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
  async integrationToken(@Body() dto: OAuthTokenRequestDto): Promise<OAuthTokenResponseDto> {
    // Force grant_type to client_credentials if using this endpoint
    const requestDto = { ...dto, grant_type: dto.grant_type || 'client_credentials' as any };
    return this.integrationService.issueToken(requestDto);
  }
}
