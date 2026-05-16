import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class RootController {
  @Get()
  @ApiOperation({ summary: 'API Root' })
  index() {
    return {
      success: true,
      message: 'Core Engine & Auth API is running',
      data: {
        version: '1.0.0',
        docs: '/v1/docs',
        health: '/v1/health',
      },
      timestamp: new Date().toISOString(),
      path: '/',
    };
  }
}
