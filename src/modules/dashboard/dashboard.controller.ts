import { Controller, Get, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(
    @Inject(DashboardService) private readonly dashboardService: DashboardService,
  ) { }

  @Get()
  @RequirePermissions('dashboard:read')
  @ApiOperation({ summary: 'Get dashboard summary statistics' })
  @ApiResponse({ status: 200, description: 'Stats retrieved' })
  async getStats() {
    console.log('--- [DEBUG] DashboardController.getStats() called ---');
    if (!this.dashboardService) {
      console.error('--- [DEBUG] DashboardService IS UNDEFINED ---');
      throw new Error('Service Injection Failed');
    }
    return this.dashboardService.getStats();
  }
}
