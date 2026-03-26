import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@ApiBearerAuth('bearer')
@Controller('health')
export class HealthController {
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns service status and envelope metadata.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy.',
    schema: {
      example: {
        success: true,
        data: { status: 'ok' },
        timestamp: '2026-03-26T15:03:48.186Z',
        path: '/v1/health',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Request validation error example.',
    schema: {
      example: {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Payload validation failed',
          details: ['Unexpected query parameter'],
        },
        timestamp: '2026-03-26T15:03:56.831Z',
        path: '/v1/health',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized error example for protected routes.',
    schema: {
      example: {
        success: false,
        error: {
          code: 'AUTH_TOKEN_INVALID',
          message: 'Invalid or missing bearer token',
        },
        timestamp: '2026-03-26T15:03:56.831Z',
        path: '/v1/health',
      },
    },
  })
  @Get()
  getHealth(): { status: 'ok' } {
    return { status: 'ok' };
  }
}

