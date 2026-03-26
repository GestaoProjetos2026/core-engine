import { Controller, Get, Req } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

type ApiSuccessResponse<T> = {
  success: true;
  message?: string;
  data: T;
  timestamp: string;
  path: string;
};

@Controller('health')
export class HealthController {
  @Get()
  getHealth(@Req() req: FastifyRequest): ApiSuccessResponse<{ status: 'ok' }> {
    return {
      success: true,
      data: { status: 'ok' },
      timestamp: new Date().toISOString(),
      path: req.url,
    };
  }
}

