import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaModule } from '../../server/prisma/prisma.module';
import { HealthModule } from '../../server/health/health.module';

@Module({
  imports: [PrismaModule, HealthModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
