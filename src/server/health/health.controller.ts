import { Controller, Get, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@ApiBearerAuth('bearer')
@Controller('health')
export class HealthController {
  constructor(@Inject(HealthService) private readonly healthService: HealthService) {}
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns service status and envelope metadata.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service status (ok or degraded).',
    schema: {
      example: {
        success: true,
        data: { 
          status: 'ok',
          services: {
            database: 'ok',
            redis: 'ok',
          }
        },
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
  async getHealth() {
    const dbStatus = await this.healthService.checkDatabase();
    const redisStatus = await this.healthService.checkRedis();
    const isOk = dbStatus === 'ok' && redisStatus === 'ok';

    return {
      status: isOk ? 'ok' : 'degraded',
      services: {
        database: dbStatus,
        redis: redisStatus,
      },
    };
  }
}

